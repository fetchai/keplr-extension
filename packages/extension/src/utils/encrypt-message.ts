import { toBase64, toHex } from "@cosmjs/encoding";
import { serializeSignDoc } from "@cosmjs/launchpad";
// import { SigningStargateClient } from "@cosmjs/stargate";
import { encrypt } from "eciesjs";
import { getWalletKeys } from ".";
import {
  CHAIN_ID_DORADO,
  SENDER_ADDRESS,
  SENDER_MNEMONIC_DATA,
  TARGET_MNEMONIC_DATA,
} from "../config/config";
// import { useStore } from "../stores";

const encryptMessage = async (chain_id: string, account: any, targetPubKey: string, messageStr: string) => {
  const message: any = {
    sender: account.pubKey, //public key
    target: targetPubKey, // public key
    type: 1, //private_message
    content: {
      text: messageStr,
    },
  };

  const encodedRawData = toBase64(Buffer.from(JSON.stringify(message)));
  const encryptedSenderRawData = encrypt(account.pubKey, Buffer.from(encodedRawData));
  const encryptedTargetRawData = encrypt(targetPubKey, Buffer.from(encodedRawData));
  const dataPayload = {
    encryptedSenderData: toBase64(encryptedSenderRawData),
    encryptedTargetData: toBase64(encryptedTargetRawData),
  };
  const msg = {
    chain_id: chain_id,
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer: account.address,
          data: toBase64(Buffer.from(JSON.stringify(dataPayload))),
        },
      },
    ],
    memo: "",
  };

  // @ts-ignore "ignoring type checking here"
  // const res = await window.fetchBrowserWallet?.keplr?.signAmino(chain_id, account.address, msg, {
  //   isADR36WithString: true,
  // } as any);
  // console.log("inside encrypt res", res);

  const dataEnvalop = {
    data: toHex(serializeSignDoc(msg)),
    senderPublicKey: account.pubKey,
    destinationPublicKey: targetPubKey,
    // signature: res.signature.signature,
    signature: "test signature",
  };
  const encodedData = toBase64(Buffer.from(JSON.stringify(dataEnvalop)));
  return encodedData;
};

export const encryptAllData = async (message: any) => {

  // const { chainStore, accountStore } = useStore();
  // const current = chainStore.current;
  // const accountInfo = accountStore.getAccount(current.chainId);
  // const walletAddress = accountStore.getAccount(chainStore.current.chainId).bech32Address;
  // const pubKey = accountInfo.pubKey;

  const targetKeys = await getWalletKeys(TARGET_MNEMONIC_DATA);
  const senderKeys = await getWalletKeys(SENDER_MNEMONIC_DATA);
  //@ts-ignore "ignoring type checking here"
  // console.log("targetKeys", targetKeys);

  // const senderData = await window?.fetchBrowserWallet?.keplr?.getKey("dorado-1");

  // export const fetchTargetDeatils=async()=>{
  //   //@ts-ignore
  //   const offlineSigner = window?.fetchBrowserWallet?.keplr.getOfflineSigner('dorado-1');
  //   console.log("offlineSigner",offlineSigner);

  //    const client = await SigningStargateClient.connectWithSigner(
  //      "https://rpc-dorado.fetch.ai:443",
  //      offlineSigner
  //    );
  //    const destAcount = await client.getAccount('fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr')
  //    console.log("Account",client,"destAcount",destAcount)
  // }
  // if (senderData) {
  const res = await encryptMessage(
    CHAIN_ID_DORADO,
    {
      address: SENDER_ADDRESS,
      pubKey: senderKeys.publicKey, // sender public key
    },
    targetKeys.publicKey,
    message
  );
  return res;
};
// };

// export const fetchTargetDeatils = async () => {
//   //@ts-ignore "ignoring type checking here"
//   const offlineSigner = window?.fetchBrowserWallet?.keplr.getOfflineSigner("dorado-1");
//   console.log("offlineSigner", offlineSigner);

//   const client = await SigningStargateClient.connectWithSigner("https://rpc-dorado.fetch.ai:443", offlineSigner);
//   const destAcount = await client.getAccount("fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr");
//   console.log("Account", client, "destAcount", destAcount);
// };
