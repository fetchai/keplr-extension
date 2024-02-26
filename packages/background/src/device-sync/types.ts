import { ExportSyncData } from "../keyring";

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
  syncPasswordNotAvailable: boolean;
};

export type SyncData = {
  version: number;
  hash: string;
  data: {
    keyringData: ExportSyncData[];
    addressBooks: { [chainId: string]: AddressBookData[] | undefined };
  };
};
