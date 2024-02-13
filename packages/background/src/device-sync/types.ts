import { ExportKeyRingData } from "../keyring";

export interface AddressBookData {
  name: string;
  address: string;
  memo: string;
}

export type AccessToken = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export type SyncStatus = {
  email: string;
  tokenExpired: boolean;
  passwordNotAvailable: boolean;
  paused: boolean;
};

export type SyncData = {
  version: number;
  hash: string;
  data: {
    keyringData: ExportKeyRingData[];
    addressBooks: { [chainId: string]: AddressBookData[] | undefined };
  };
};
