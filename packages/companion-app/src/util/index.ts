export const DORADO_REST = 'https://rest-dorado.fetch.ai:443';
export const DORADO_CHAIN_ID = 'dorado-1';

export const formatUnits = (amount: string, decimals: number): string => {
  const result = (parseFloat(amount) / 10 ** decimals).toString();
  return result;
};

export const parseUnit = (amount: string, decimals: number): string => {
  const result = (parseFloat(amount) * 10 ** decimals).toString();
  return result;
};
