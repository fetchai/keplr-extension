import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { EncryptMessagingMessage } from "@keplr-wallet/background/build/messaging";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import crypto from "crypto";
import { GroupMembers } from "@chatTypes";

function generateSymmetricKey() {
  const secret = "fetchwallet";
  const key = crypto
    .createHash("sha256")
    .update(String(secret))
    .digest("base64");
  return key;
}

export async function generateEncryptedSymmetricKeyForAddress(
  chainId: string,
  accessToken: string,
  symmetricKey: string,
  address: string
) {
  const requester = new InExtensionMessageRequester();
  const encryptMsg = new EncryptMessagingMessage(
    chainId,
    address,
    toBase64(toUtf8(JSON.stringify(symmetricKey))),
    accessToken
  );
  const encryptSymmetricKey = await requester.sendMessage(
    BACKGROUND_PORT,
    encryptMsg
  );
  return encryptSymmetricKey;
}

export const createEncryptedSymmetricKeyForAddresses = async (
  addresses: GroupMembers[],
  chainId: string,
  accessToken: string
) => {
  const newAddresses = [];
  const newSymmetricKey = generateSymmetricKey();
  for (let i = 0; i < addresses.length; i++) {
    const groupAddress = addresses[i];
    const encryptedSymmetricKey = await generateEncryptedSymmetricKeyForAddress(
      chainId,
      accessToken,
      newSymmetricKey,
      groupAddress.address
    );
    newAddresses[i] = { ...groupAddress, encryptedSymmetricKey };
  }
  return newAddresses;
};

export function encryptGroupData(key: string, data: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "base64"),
    iv
  );
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return `${iv.toString("base64")}:${encrypted}`;
}

export function decryptGroupData(key: string, data: string) {
  const [iv, encrypted] = data.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
