export const formatAddress = (address: string) => {
  if (address?.length > 15)
    return (
      address.substring(0, 8).toLowerCase() +
      '...' +
      address.substring(36, 44).toLowerCase()
    );
  else return address;
};

export const shortenNumber = (value: string) => {
  const number = parseFloat(value) / 10 ** 18;
  let result = '';
  if (number >= 1000000) {
    result = (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    result = (number / 1000).toFixed(1) + 'K';
  } else {
    result = number.toFixed(0);
  }

  return result;
};
