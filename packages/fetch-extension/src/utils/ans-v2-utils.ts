export function encode(value: any) {
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
  return encoded;
}
