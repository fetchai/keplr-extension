export const formatAddress = (address: string) => {
    if (address?.length > 15)
      return address.substring(0, 4).toLowerCase() + "..." + address.substring(40, 44).toLowerCase();
    else return address;
  };