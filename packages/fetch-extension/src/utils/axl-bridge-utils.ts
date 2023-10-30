/* eslint-disable import/no-extraneous-dependencies */
import { Environment } from "@axelar-network/axelarjs-sdk";

export const getEnvironment = (chain: string) => {
  switch (chain) {
    case "osmosis testnet":
      return Environment.TESTNET;
    case "ethereum-2":
      return Environment.TESTNET;
    case "axelar testnet":
      return Environment.TESTNET;
    case "dorado":
      return Environment.TESTNET;
    default:
      return Environment.MAINNET;
  }
};
export const extractNumberFromBalance = (balanceString: string) => {
  // Use regular expression to extract the numeric part
  if (!balanceString) return 0;
  const regex = /(\d+(\.\d+)?)/;
  const match = balanceString.match(regex);
  if (match) {
    return parseFloat(match[0]);
  } else {
    return 0;
  }
};
