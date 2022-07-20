export interface DenomUnit {
    name: string;
    exponent: number;
    aliases?: string[];
}

export interface BaseCurrency {
    readonly type: "native" | "cw20" | "ibc";

    readonly description?: string;
    readonly denomUnits: DenomUnit[];

    readonly display: string;
    readonly name: string;
    readonly symbol: string;

    /**
     * This is used to fetch asset's fiat value from coingecko.
     * You can get id from https://api.coingecko.com/api/v3/coins/list.
     */
    readonly coinGeckoId?: string;
    readonly coinImageUrl?: string;
}

export interface NativeCurrency extends BaseCurrency {
    readonly type: "native"
    readonly denom: string;
}

export function isNativeCurrency(currency: BaseCurrency): currency is NativeCurrency {
    return currency.type === "native";
}

export interface CW20Currency extends BaseCurrency {
    readonly type: "cw20";
    readonly contractAddress: string;
}

export function isCw20Currency(currency: BaseCurrency): currency is CW20Currency {
    return currency.type === "cw20";
}

/**
 * IBCCurrency is the currency that is sent from the other chain via IBC.
 * This will be handled as similar to the native currency.
 * But, this has more information abounr IBC channel and paths.
 */
export interface IbcPath {
    portId: string;
    channelId: string;
}

export interface IBCCurrency extends BaseCurrency {
    readonly type: "ibc"
    readonly paths: IbcPath[];
    /**
     * The chain id that the currency is from.
     * If that chain is unknown, this will be undefined.
     */
    readonly originChainId: string | undefined;
    readonly originCurrency: NativeCurrency | CW20Currency | undefined;
}

export type Currency = NativeCurrency | IBCCurrency | CW20Currency;