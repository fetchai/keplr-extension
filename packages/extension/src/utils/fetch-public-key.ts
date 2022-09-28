import { fromBase64 } from "@cosmjs/encoding";
import { StargateClient } from "@cosmjs/stargate";
import { InjectedKeplr } from "@keplr-wallet/provider";
import { toHex } from "@keplr-wallet/router/src/json-uint8-array/hex";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../config/config";
import manifest from "../manifest.json";

export const fetchPublicKey = async (searchAddress: string) => {
  try {
    const keplr = new InjectedKeplr(manifest.version, "extension");
    const offlineSigner = keplr.getOfflineSigner(CHAIN_ID_FETCHHUB);
    console.log("offlineSigner", offlineSigner);

    const client = await StargateClient.connect(
      "https://rpc-dorado.fetch.ai:443",
      offlineSigner
    );
    const accountDetails = await client.getAccount(searchAddress);
    return accountDetails?.pubkey?.value
      ? toHex(fromBase64(accountDetails.pubkey.value))
      : "";
  } catch (error: any) {
    console.log(error);
  }
};
