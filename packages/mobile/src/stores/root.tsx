import {
  CommunityChainInfoRepo,
  EmbedChainInfos,
  EthereumEndpoint,
} from "../config";
import {
  KeyRingStore,
  InteractionStore,
  QueriesStore,
  CoinGeckoPriceStore,
  AccountStore,
  SignInteractionStore,
  TokensStore,
  CosmosQueries,
  CosmwasmQueries,
  SecretQueries,
  CosmosAccount,
  CosmwasmAccount,
  SecretAccount,
  LedgerInitStore,
  IBCCurrencyRegsitrar,
  PermissionStore,
  ChainSuggestStore,
  ObservableQueryBase,
  DeferInitialQueryController,
  ActivityStore,
  ProposalStore,
  TokenGraphStore,
} from "@keplr-wallet/stores";
import { AsyncKVStore } from "../common";
import { APP_PORT } from "@keplr-wallet/router";
import {
  ChainInfoWithCoreTypes,
  PermissionService,
} from "@keplr-wallet/background";
import { RNEnv, RNRouterUI, RNMessageRequesterInternal } from "../router";
import { ChainStore } from "./chain";
import EventEmitter from "eventemitter3";
import { Keplr } from "@keplr-wallet/provider";
import { KeychainStore } from "./keychain";
import { WalletConnectStore } from "./wallet-connect";
import { FeeType } from "@keplr-wallet/hooks";
import { AmplitudeApiKey } from "../config";
import { AnalyticsStore, NoopAnalyticsClient } from "@keplr-wallet/analytics";
import { Amplitude } from "@amplitude/react-native";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import {
  AxelarEVMBridgeCurrencyRegistrar,
  GravityBridgeCurrencyRegsitrar,
  KeplrETCQueries,
} from "@keplr-wallet/stores-etc";

export class RootStore {
  public readonly chainStore: ChainStore;
  public readonly keyRingStore: KeyRingStore;

  protected readonly interactionStore: InteractionStore;
  public readonly permissionStore: PermissionStore;
  public readonly permissionService: PermissionService;
  public readonly ledgerInitStore: LedgerInitStore;
  public readonly signInteractionStore: SignInteractionStore;
  public readonly chainSuggestStore: ChainSuggestStore;
  public readonly proposalStore: ProposalStore;
  public readonly activityStore: ActivityStore;
  public readonly tokenGraphStore: TokenGraphStore;
  public readonly accountBaseStore: AsyncKVStore;

  public readonly queriesStore: QueriesStore<
    [CosmosQueries, CosmwasmQueries, SecretQueries, KeplrETCQueries]
  >;
  public readonly accountStore: AccountStore<
    [CosmosAccount, CosmwasmAccount, SecretAccount]
  >;
  public readonly priceStore: CoinGeckoPriceStore;
  public readonly tokensStore: TokensStore<ChainInfoWithCoreTypes>;

  protected readonly ibcCurrencyRegistrar: IBCCurrencyRegsitrar<ChainInfoWithCoreTypes>;
  protected readonly gravityBridgeCurrencyRegistrar: GravityBridgeCurrencyRegsitrar<ChainInfoWithCoreTypes>;
  protected readonly axelarEVMBridgeCurrencyRegistrar: AxelarEVMBridgeCurrencyRegistrar<ChainInfoWithCoreTypes>;

  public readonly keychainStore: KeychainStore;
  public readonly walletConnectStore: WalletConnectStore;

  public readonly analyticsStore: AnalyticsStore<
    {
      chainId?: string;
      chainIds?: string[];
      chainIdentifier?: string;
      chainIdentifiers?: string[];
      chainName?: string;
      toChainId?: string;
      toChainName?: string;
      registerType?: "seed" | "google" | "apple" | "ledger" | "keystone" | "qr";
      feeType?: FeeType | undefined;
      rpc?: string;
      rest?: string;
      pageName?: string;
      tabName?: string;
      isClaimAll?: boolean;
      selectedPrivacySetting?: string;
      readReceipt?: boolean;
      message?: string;
      action?: string;
      accountType?: string;
      validatorName?: string;
      toValidatorName?: string;
    },
    {
      registerType?: "seed" | "google" | "apple" | "ledger" | "keystone" | "qr";
      accountType?: "mnemonic" | "privateKey" | "ledger" | "keystone";
      currency?: string;
      language?: string;
      totalAccounts?: number;
    }
  >;
  constructor() {
    const router = new RNRouterUI(RNEnv.produceEnv);

    const eventEmitter = new EventEmitter();
    this.proposalStore = new ProposalStore();

    // Order is important.
    this.interactionStore = new InteractionStore(
      router,
      new RNMessageRequesterInternal()
    );
    this.permissionStore = new PermissionStore(
      this.interactionStore,
      new RNMessageRequesterInternal()
    );
    this.ledgerInitStore = new LedgerInitStore(
      this.interactionStore,
      new RNMessageRequesterInternal()
    );
    this.signInteractionStore = new SignInteractionStore(this.interactionStore);
    this.chainSuggestStore = new ChainSuggestStore(
      this.interactionStore,
      CommunityChainInfoRepo
    );

    ObservableQueryBase.experimentalDeferInitialQueryController =
      new DeferInitialQueryController();

    this.chainStore = new ChainStore(
      new AsyncKVStore("store_chain_config"),
      EmbedChainInfos,
      new RNMessageRequesterInternal(),
      ObservableQueryBase.experimentalDeferInitialQueryController
    );

    this.keyRingStore = new KeyRingStore(
      {
        dispatchEvent: (type: string) => {
          eventEmitter.emit(type);
        },
      },
      "pbkdf2",
      this.chainStore,
      new RNMessageRequesterInternal(),
      this.interactionStore
    );

    this.queriesStore = new QueriesStore(
      // Fix prefix key because there was a problem with storage being corrupted.
      // In the case of storage where the prefix key is "store_queries" or "store_queries_fix", "store_queries_fix2",
      // we should not use it because it is already corrupted in some users.
      // https://github.com/chainapsis/keplr-wallet/issues/275
      // https://github.com/chainapsis/keplr-wallet/issues/278
      // https://github.com/chainapsis/keplr-wallet/issues/318
      new AsyncKVStore("store_queries_fix3"),
      this.chainStore,
      CosmosQueries.use(),
      CosmwasmQueries.use(),
      SecretQueries.use({
        apiGetter: async () => {
          // TOOD: Set version for Keplr API
          return new Keplr("0.12.12", "core", new RNMessageRequesterInternal());
        },
      }),
      KeplrETCQueries.use({
        ethereumURL: EthereumEndpoint,
      })
    );

    this.activityStore = new ActivityStore(
      new AsyncKVStore("store_activity_config"),
      this.chainStore
    );

    this.tokenGraphStore = new TokenGraphStore(
      new AsyncKVStore("store_token_graph_config"),
      this.chainStore
    );
    this.accountBaseStore = new AsyncKVStore("store_account_config");

    this.accountStore = new AccountStore(
      {
        addEventListener: (type: string, fn: () => void) => {
          eventEmitter.addListener(type, fn);
        },
        removeEventListener: (type: string, fn: () => void) => {
          eventEmitter.removeListener(type, fn);
        },
      },
      this.chainStore,
      this.activityStore,
      this.tokenGraphStore,
      this.accountBaseStore,
      () => {
        return {
          suggestChain: false,
          autoInit: true,
          getKeplr: async () => {
            // TOOD: Set version for Keplr API
            return new Keplr(
              "0.12.12",
              "core",
              new RNMessageRequesterInternal()
            );
          },
        };
      },
      CosmosAccount.use({
        queriesStore: this.queriesStore,
        msgOptsCreator: (chainId) => {
          if (chainId.startsWith("osmosis")) {
            return {
              send: {
                native: {
                  gas: 100000,
                },
              },
              undelegate: {
                gas: 350000,
              },
              redelegate: {
                gas: 550000,
              },
              withdrawRewards: {
                gas: 300000,
              },
            };
          }

          if (chainId.startsWith("stargaze-")) {
            return {
              send: {
                native: {
                  gas: 100000,
                },
              },
              withdrawRewards: {
                gas: 200000,
              },
            };
          }
        },
      }),
      CosmwasmAccount.use({
        queriesStore: this.queriesStore,
      }),
      SecretAccount.use({
        queriesStore: this.queriesStore,
      })
    );

    this.priceStore = new CoinGeckoPriceStore(
      new AsyncKVStore("store_prices"),
      {
        usd: {
          currency: "usd",
          symbol: "$",
          maxDecimals: 2,
          locale: "en-US",
        },
        eur: {
          currency: "eur",
          symbol: "€",
          maxDecimals: 2,
          locale: "en-IE",
        },
        gbp: {
          currency: "gbp",
          symbol: "£",
          maxDecimals: 2,
          locale: "en-GB",
        },
        cad: {
          currency: "cad",
          symbol: "CA$",
          maxDecimals: 2,
          locale: "en-CA",
        },
        aud: {
          currency: "aud",
          symbol: "AU$",
          maxDecimals: 2,
          locale: "en-AU",
        },
        rub: {
          currency: "rub",
          symbol: "₽",
          maxDecimals: 0,
          locale: "ru-RU",
        },
        krw: {
          currency: "krw",
          symbol: "₩",
          maxDecimals: 0,
          locale: "ko-KR",
        },
        hkd: {
          currency: "hkd",
          symbol: "HK$",
          maxDecimals: 1,
          locale: "en-HK",
        },
        cny: {
          currency: "cny",
          symbol: "¥",
          maxDecimals: 1,
          locale: "zh-CN",
        },
        jpy: {
          currency: "jpy",
          symbol: "¥",
          maxDecimals: 0,
          locale: "ja-JP",
        },
        inr: {
          currency: "inr",
          symbol: "₹",
          maxDecimals: 1,
          locale: "en-IN",
        },
        ars: {
          currency: "ars",
          symbol: "$",
          maxDecimals: 2,
          locale: "es-AR",
        },
        bmd: {
          currency: "bmd",
          symbol: "BD$",
          maxDecimals: 2,
          locale: "en-BM",
        },
        brl: {
          currency: "brl",
          symbol: "R$",
          maxDecimals: 2,
          locale: "pt-BR",
        },
        chf: {
          currency: "chf",
          symbol: "CHF",
          maxDecimals: 2,
          locale: "de-CH",
        },
        clp: {
          currency: "clp",
          symbol: "$",
          maxDecimals: 0,
          locale: "es-CL",
        },
        czk: {
          currency: "czk",
          symbol: "Kč",
          maxDecimals: 2,
          locale: "cs-CZ",
        },
        dkk: {
          currency: "dkk",
          symbol: "kr",
          maxDecimals: 2,
          locale: "da-DK",
        },
        gel: {
          currency: "gel",
          symbol: "₾",
          maxDecimals: 2,
          locale: "ka-GE",
        },
        huf: {
          currency: "huf",
          symbol: "Ft",
          maxDecimals: 2,
          locale: "hu-HU",
        },
        idr: {
          currency: "idr",
          symbol: "Rp",
          maxDecimals: 2,
          locale: "id-ID",
        },
        ils: {
          currency: "ils",
          symbol: "₪",
          maxDecimals: 2,
          locale: "he-IL",
        },
        kwd: {
          currency: "kwd",
          symbol: "د.ك",
          maxDecimals: 3,
          locale: "ar-KW",
        },
        lkr: {
          currency: "lkr",
          symbol: "Rs",
          maxDecimals: 2,
          locale: "si-LK",
        },
        mmk: {
          currency: "mmk",
          symbol: "K",
          maxDecimals: 0,
          locale: "my-MM",
        },
        mxn: {
          currency: "mxn",
          symbol: "MX$",
          maxDecimals: 2,
          locale: "es-MX",
        },
        myr: {
          currency: "myr",
          symbol: "RM",
          maxDecimals: 2,
          locale: "ms-MY",
        },
        ngn: {
          currency: "ngn",
          symbol: "₦",
          maxDecimals: 2,
          locale: "en-NG",
        },
        nok: {
          currency: "nok",
          symbol: "kr",
          maxDecimals: 2,
          locale: "nb-NO",
        },
        nzd: {
          currency: "nzd",
          symbol: "NZ$",
          maxDecimals: 2,
          locale: "en-NZ",
        },
        php: {
          currency: "php",
          symbol: "₱",
          maxDecimals: 2,
          locale: "en-PH",
        },
        pkr: {
          currency: "pkr",
          symbol: "₨",
          maxDecimals: 2,
          locale: "en-PK",
        },
        pln: {
          currency: "pln",
          symbol: "zł",
          maxDecimals: 2,
          locale: "pl-PL",
        },
        sar: {
          currency: "sar",
          symbol: "ر.س",
          maxDecimals: 2,
          locale: "ar-SA",
        },
        sek: {
          currency: "sek",
          symbol: "kr",
          maxDecimals: 2,
          locale: "sv-SE",
        },
        sgd: {
          currency: "sgd",
          symbol: "S$",
          maxDecimals: 2,
          locale: "en-SG",
        },
        thb: {
          currency: "thb",
          symbol: "฿",
          maxDecimals: 2,
          locale: "th-TH",
        },
        try: {
          currency: "try",
          symbol: "₺",
          maxDecimals: 2,
          locale: "tr-TR",
        },
        twd: {
          currency: "twd",
          symbol: "NT$",
          maxDecimals: 2,
          locale: "zh-TW",
        },
        uah: {
          currency: "uah",
          symbol: "₴",
          maxDecimals: 2,
          locale: "uk-UA",
        },
        vef: {
          currency: "vef",
          symbol: "Bs",
          maxDecimals: 2,
          locale: "es-VE",
        },
        vnd: {
          currency: "vnd",
          symbol: "₫",
          maxDecimals: 0,
          locale: "vi-VN",
        },
        zar: {
          currency: "zar",
          symbol: "R",
          maxDecimals: 2,
          locale: "en-ZA",
        },
      },
      "usd"
    );

    this.tokensStore = new TokensStore(
      {
        addEventListener: (type: string, fn: () => void) => {
          eventEmitter.addListener(type, fn);
        },
      },
      this.chainStore,
      new RNMessageRequesterInternal(),
      this.interactionStore
    );

    this.ibcCurrencyRegistrar =
      new IBCCurrencyRegsitrar<ChainInfoWithCoreTypes>(
        new AsyncKVStore("store_test_ibc_currency_registrar"),
        24 * 3600 * 1000,
        this.chainStore,
        this.accountStore,
        this.queriesStore,
        this.queriesStore
      );

    this.gravityBridgeCurrencyRegistrar = new GravityBridgeCurrencyRegsitrar(
      new AsyncKVStore("store_gravity_bridge_currency_registrar"),
      this.chainStore,
      this.queriesStore
    );
    this.axelarEVMBridgeCurrencyRegistrar =
      new AxelarEVMBridgeCurrencyRegistrar<ChainInfoWithCoreTypes>(
        new AsyncKVStore("store_axelar_evm_bridge_currency_registrar"),
        this.chainStore,
        this.queriesStore,
        "ethereum"
      );

    router.listen(APP_PORT);

    this.keychainStore = new KeychainStore(
      new AsyncKVStore("store_keychain"),
      this.keyRingStore
    );

    this.permissionService = new PermissionService(
      new AsyncKVStore("permission"),
      [
        "https://wallet.keplr.app",
        "https://validator.keplr.app",
        "https://chains.keplr.app",
      ]
    );

    this.walletConnectStore = new WalletConnectStore(
      new AsyncKVStore("store_wallet_connect"),
      {
        addEventListener: (type: string, fn: () => void) => {
          eventEmitter.addListener(type, fn);
        },
        removeEventListener: (type: string, fn: () => void) => {
          eventEmitter.removeListener(type, fn);
        },
      },
      this.chainStore,
      this.keyRingStore,
      this.permissionStore,
      this.permissionService
    );

    this.analyticsStore = new AnalyticsStore(
      (() => {
        if (!AmplitudeApiKey) {
          return new NoopAnalyticsClient();
        } else {
          const amplitudeClient = Amplitude.getInstance();
          amplitudeClient.init(AmplitudeApiKey);

          return amplitudeClient;
        }
      })(),
      {
        logEvent: (eventName, eventProperties) => {
          if (eventProperties?.chainId || eventProperties?.toChainId) {
            eventProperties = {
              ...eventProperties,
            };

            if (eventProperties.chainId) {
              eventProperties.chainId = ChainIdHelper.parse(
                eventProperties.chainId
              ).identifier;
            }

            if (eventProperties.toChainId) {
              eventProperties.toChainId = ChainIdHelper.parse(
                eventProperties.toChainId
              ).identifier;
            }
          }

          return {
            eventName,
            eventProperties,
          };
        },
      }
    );
  }
}

export function createRootStore() {
  return new RootStore();
}
