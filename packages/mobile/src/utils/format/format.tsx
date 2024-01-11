export const separateNumericAndDenom = (value: any) => {
  const [numericPart, denomPart] = value ? value.split(" ") : ["", ""];
  return { numericPart, denomPart };
};
