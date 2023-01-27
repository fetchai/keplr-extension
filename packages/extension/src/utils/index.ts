import { NameAddress } from "@chatTypes";
import { toHex } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { formatAddress } from "./format";

export const getWalletKeys = async (mnemonic: string) => {
  const wallet: any = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  return {
    privateKey: toHex(wallet?.privkey),
    publicKey: toHex(wallet?.pubkey),
  };
};

export function removeByIndex(str: string, index: number) {
  return str.slice(0, index) + str.slice(index + 1);
}

export function getUserName(
  walletAddress: string,
  addressBook: NameAddress,
  address: string
): string {
  // translate the contact address into the address book name if it exists

  if (walletAddress === address) {
    return "You";
  }

  const contactAddressBookName = addressBook[address];
  return contactAddressBookName
    ? formatAddress(contactAddressBookName)
    : formatAddress(address);
}

/// Todo need to update the payload to refractor event messages
export function getEventMessage(
  walletAddress: string,
  addressBook: NameAddress,
  message: string
): string {
  const data = message.split(" ");
  const tempAddress = data.find((element) => element.startsWith("-"));
  if (tempAddress) {
    if (message.endsWith("]")) {
      const lastObj = data.find(
        (element) => element.startsWith("[") && element.endsWith("]")
      );
      if (lastObj) {
        const addresses = lastObj.replace("[", "").replace("]", "");

        if (addresses.includes(",")) {
          const tempAddressess = addresses.split(",");
          const finalData = message
            .replace(
              tempAddress,
              getUserName(
                walletAddress,
                addressBook,
                removeByIndex(tempAddress, 0)
              )
            )
            .replace(
              lastObj,
              tempAddressess
                .map((address) =>
                  getUserName(walletAddress, addressBook, address)
                )
                .join(", ")
            );
          return finalData;
        } else {
          const finalData = message
            .replace(
              tempAddress,
              getUserName(
                walletAddress,
                addressBook,
                removeByIndex(tempAddress, 0)
              )
            )
            .replace(
              lastObj,
              getUserName(walletAddress, addressBook, addresses)
            );
          return finalData;
        }
      }
    } else {
      const finalData = message.replace(
        tempAddress,
        getUserName(walletAddress, addressBook, removeByIndex(tempAddress, 0))
      );
      return finalData;
    }
  }

  return message;
}
