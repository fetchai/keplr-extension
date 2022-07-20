import {Currency, NativeCurrency} from "./currencies";

export interface BIP44 {
    readonly coinType: number;
}

export type LargeNumber = string;

export interface NetworkConfig {

    /**
     * Basic chain information
     */
    readonly chainId: string;
    readonly chainName: string;

    /**
     * The network URLs that can be used in the network
     */
    readonly rpcUrl: string;
    readonly restUrl?: string;
    readonly grpcUrl?: string;

    /**
     * Shows whether the blockchain is in production phase or beta phase.
     * Major features such as staking and sending are supported on staging blockchains, but without guarantee.
     * If the blockchain is in an early stage, please set it as beta.
     */
    readonly type?: "mainnet" | "testnet";
    readonly status?: "alpha" | "beta" | "production";

    /**
     * This indicates the type of coin that can be used for stake.
     * You can get actual currency information from Currencies.
     */
    readonly bip44s: BIP44[];
    readonly bech32Config: Bech32Config;

    readonly currencies: Currency[];
    readonly feeCurrencies: NativeCurrency[];
    readonly stakeCurrency: NativeCurrency;

    readonly gasPriceStep?: {
        low: LargeNumber;
        average: LargeNumber;
        high: LargeNumber;
    };
}
