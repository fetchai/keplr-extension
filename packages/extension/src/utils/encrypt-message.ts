import { toBase64, toHex } from "@cosmjs/encoding";
import { serializeSignDoc } from "@cosmjs/launchpad";
// import { SigningStargateClient } from "@cosmjs/stargate";
import { encrypt } from "eciesjs";
import { getWalletKeys } from ".";
import { CHAIN_ID_DORADO, SENDER_ADDRESS, SENDER_MNEMONIC_DATA } from "../config/config";
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

export const encryptAllData = async (message: any, targetPubkey: string) => {
  // const { chainStore, accountStore } = useStore();
  // const current = chainStore.current;
  // const accountInfo = accountStore.getAccount(current.chainId);
  // const walletAddress = accountStore.getAccount(chainStore.current.chainId).bech32Address;
  // const pubKey = accountInfo.pubKey;
  const senderKeys = await getWalletKeys(SENDER_MNEMONIC_DATA);
 
  const res = await encryptMessage(
    CHAIN_ID_DORADO,
    {
      address: SENDER_ADDRESS,
      pubKey: senderKeys.publicKey, // sender public key
    },
    targetPubkey,
    message
  );
  return res;
};
