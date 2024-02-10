import { Buffer } from "buffer/";

export const separateNumericAndDenom = (value: any) => {
  const [numericPart, denomPart] = value ? value.split(" ") : ["", ""];
  return { numericPart, denomPart };
};

export const parseDollarAmount = (dollarString: any) => {
  const match = dollarString.match(/[0-9.]+/);
  if (match) {
    return parseFloat(match[0]);
  }
  return 0;
};

export function trimWordsStr(str: string): string {
  str = str.trim();
  // Split on the whitespace or new line.
  const splited = str.split(/\s+/);
  const words = splited
    .map((word) => word.trim())
    .filter((word) => word.trim().length > 0);
  return words.join(" ");
}

export function isPrivateKey(str: string): boolean {
  if (str.startsWith("0x")) {
    return true;
  }

  if (str.length === 64) {
    try {
      return Buffer.from(str, "hex").length === 32;
    } catch {
      return false;
    }
  }
  return false;
}

export function validatePrivateKey(value: string): boolean {
  if (isPrivateKey(value)) {
    value = value.replace("0x", "");
    if (value.length !== 64) {
      return false;
    }
    return (
      Buffer.from(value, "hex").toString("hex").toLowerCase() ===
      value.toLowerCase()
    );
  }
  return false;
}
