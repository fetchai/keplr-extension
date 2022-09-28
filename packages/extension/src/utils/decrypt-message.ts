import { fromBase64, fromHex, fromUtf8 } from "@cosmjs/encoding";
import { decrypt } from "eciesjs";
import { store } from "../chatStore";

export const decryptMessage = async (content: string, isSender: boolean) => {
  console.log("decryptMessage content ", content);

  try {
    const state = store.getState();
    const { user } = state;
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
    console.log("isSender isSender", isSender);

    const decryptedData = decrypt(
      user.prvKey,
      Buffer.from(
        isSender
          ? parsedData.encryptedSenderData
          : parsedData.encryptedTargetData,
        "base64"
      )
    );
    console.log("decryptMessage decryptedData ", decryptedData);
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
