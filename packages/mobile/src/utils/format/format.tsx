export const separateNumericAndDenom = (value: any) => {
  const [numericPart, denomPart] = value ? value.split(" ") : ["", ""];
  return { numericPart, denomPart };
};

export const parseDollarAmount = (dollarString: any) => {
  const match = dollarString.match(/[0-9.]+/);
  if (match) {
    return parseFloat(match[0]);
  }
  return NaN;
};
