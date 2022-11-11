export const getUniqueChatId = (address1: string, address2: string): string => {
  return [address1, address2].sort().join("-");
};

export const getTargetAddress = (
  uniqueChatId: string,
  walletAddress: string
): string => {
  const addresses = uniqueChatId.split("-");
  return addresses.filter((contact: any) => contact !== walletAddress)[0];
};
