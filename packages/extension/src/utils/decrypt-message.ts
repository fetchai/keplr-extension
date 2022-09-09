import { fromBase64, fromHex, fromUtf8 } from "@cosmjs/encoding";
import { decrypt } from "eciesjs";
import { getWalletKeys } from ".";
import { SENDER_MNEMONIC_DATA } from "../config/config";

export const decryptMessage = async (content: string, isSender: boolean) => {
  
  
  try {
    const data = Buffer.from(content, "base64").toString("ascii");
  
    //@ts-ignore "ignoring type checking here"
    const dataEnvalopDecoded = JSON.parse(data);
    
    const decodedData = fromUtf8(fromHex(dataEnvalopDecoded.data));
    
    const msgrev = JSON.parse(decodedData);
    
    const msgrevToAscii = msgrev.msgs[0].value.data;
  
    const senTargetData = Buffer.from(fromBase64(msgrevToAscii)).toString(
      "ascii"
    );
    
    const parsedData = JSON.parse(senTargetData);

    const senderKeys = await getWalletKeys(SENDER_MNEMONIC_DATA);


    const decryptedData = decrypt(
      senderKeys.privateKey,
      Buffer.from(
        !isSender
          ? parsedData.encryptedSenderData
          : parsedData.encryptedTargetData,
        "base64"
      )
    );

    // const decryptedData = decrypt(
    //   "02374e853b83f99f516caef4ee117a63bc90a20a89a0929b8d549f46568c63ff65",
    //   Buffer.from(
    //     content,
    //     "base64"
    //   )
    // );
        
    const dataString = Buffer.from(
      decryptedData.toString("ascii"),
      "base64"
    ).toString("ascii");

    const parsedDataString = JSON.parse(dataString);
    return parsedDataString.content.text;
  } catch (error) {
    console.log("error : ", error);
    return "";
  }
};
