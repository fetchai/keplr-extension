import { toBase64, toHex } from "@cosmjs/encoding";
import { serializeSignDoc } from "@cosmjs/launchpad";
import { encrypt } from "eciesjs";
import { SigningStargateClient } from "@cosmjs/stargate";
import { CHAIN_ID_DORADO, SENDER_MNEMONIC_DATA, TARGET_MNEMONIC_DATA } from "../config/config";
import { getWalletKeys } from ".";
import { useStore } from "../stores";

const encryptMessage = async (
  chain_id: string,
  account: any,
  targetPubKey: string,
  messageStr: string
) => {

  console.log("inside encrypt message function",account,targetPubKey,messageStr);
  
  const message: any = {
    sender: account.pubKey, //public key
    target: targetPubKey, // public key
    type: 1, //private_message
    content: {
      text: messageStr,
    },
  };
  console.log("inside encrypt message",message);
  
  const encodedRawData = toBase64(Buffer.from(JSON.stringify(message)));
  const encryptedSenderRawData = encrypt(
    account.pubKey,
    Buffer.from(encodedRawData)
  );
  console.log("inside encrypt encryptedSenderRawData",encryptedSenderRawData);
  const encryptedTargetRawData = encrypt(
    targetPubKey,
    Buffer.from(encodedRawData)
  );
  console.log("inside encrypt encryptedTargetRawData",encryptedTargetRawData);
  const dataPayload = {
    encryptedSenderData: toBase64(encryptedSenderRawData),
    encryptedTargetData: toBase64(encryptedTargetRawData),
  };
  console.log("inside encrypt dataPayload",encryptedTargetRawData);
  const msg = {
    chain_id: "",
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

  console.log("inside encrypt msg",msg);

  // @ts-ignore "ignoring type checking here"
  const res = await window.fetchBrowserWallet?.keplr?.signAmino(
    chain_id,
    account.address,
    msg,
    { isADR36WithString: true } as any
  );
  console.log("inside encrypt res",res);
  
  const dataEnvalop = {
    data: toHex(serializeSignDoc(res.signed)),
    senderPublicKey: account.pubKey,
    destinationPublicKey: targetPubKey,
    signature: res.signature.signature,
  };
  const encodedData = toBase64(Buffer.from(JSON.stringify(dataEnvalop)));
  return encodedData;
};

export const encryptAllData = async (message: any) => {
console.log("messagemessagemessagemessage",message);

  // const { chainStore, accountStore } = useStore();
  // const current = chainStore.current;
  // const accountInfo = accountStore.getAccount(current.chainId);
  // const walletAddress = accountStore.getAccount(chainStore.current.chainId).bech32Address;
  // const pubKey = accountInfo.pubKey;

  const targetKeys = await getWalletKeys(TARGET_MNEMONIC_DATA);
  const senderKeys = await getWalletKeys(SENDER_MNEMONIC_DATA)
  //@ts-ignore "ignoring type checking here"
  console.log("targetKeys",targetKeys);
  
  
  const senderData = await window?.fetchBrowserWallet?.keplr?.getKey(
    "dorado-1"
    );
  
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

    console.log("senderData",senderData);
  // if (senderData) {
    const res = await encryptMessage(
      CHAIN_ID_DORADO,
      {
        address: "fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc",
        pubKey: "023269c0a9ef2597e739171887d62fd46c496b4c1ef73af41e72f06e9d17ffc9c1", // sender public key
      },
      "02d50663899060e875618515f1ee84380290ca196ef282ec93cb6881677002f799",
      message
    );
    return res;
  }
// };

export const fetchTargetDeatils = async () => {
  //@ts-ignore "ignoring type checking here"
  const offlineSigner = window?.fetchBrowserWallet?.keplr.getOfflineSigner(
    "dorado-1"
  );
  console.log("offlineSigner", offlineSigner);

  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc-dorado.fetch.ai:443",
    offlineSigner
  );
  const destAcount = await client.getAccount(
    "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr"
  );
  console.log("Account", client, "destAcount", destAcount);
};
