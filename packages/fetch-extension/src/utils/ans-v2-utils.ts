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

export function updateAmountAndDenom(amountObj: any, seconds: number) {
  if (amountObj) {
    const { amount, denom } = amountObj;
    const updatedAmount = BigInt(amount) * BigInt(seconds);
    return { amount: updatedAmount.toString(), denom };
  }
}