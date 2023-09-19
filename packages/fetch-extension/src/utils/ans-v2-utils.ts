import { makeSignDoc } from "@cosmjs/amino";

export function encodeLengthPrefixed(value: any) {
  let encoded;

  if (typeof value === "string") {
    encoded = Buffer.from(value, "utf8");
  } else if (typeof value === "number") {
    encoded = Buffer.alloc(8);
    encoded.writeBigInt64BE(BigInt(value));
  } else if (Buffer.isBuffer(value)) {
    encoded = value;
  } else {
    throw new Error("Invalid value type");
  }

  const length = BigInt(encoded.length);
  const prefix = Buffer.alloc(8);
  prefix.writeBigInt64BE(length);

  return Buffer.concat([prefix, encoded]);
}

export function makeArbitrarySignDoc(
  signerAddress: any,
  data: any,
  chainId: any
) {
  const memo = "";
  const accountNumber = 0;
  const sequence = 0;

  // Construct a transaction
  const msg = {
    type: "cosmos-sdk/MsgSignData",
    value: {
      data: Buffer.from(data).toString("base64"),
      from_address: signerAddress,
    },
  };

  const fee = {
    amount: [],
    gas: "200000",
  };

  // Create a StdSignDoc
  return makeSignDoc([msg], fee, chainId, memo, accountNumber, sequence);
}

export function makeVerificationString(signature: any, pubkey: any) {
  const signatureBuffer = Buffer.from(signature, "base64"); // Example first bytes
  const pubkeyBuffer = Buffer.from(pubkey, "base64");

  const data = Buffer.concat([pubkeyBuffer, signatureBuffer]);

  return data
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
