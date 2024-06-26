import {
  createSmartNavigatorProvider,
  SmartNavigator,
} from "hooks/use-smart-navigation";
import {
  AddressBookConfig,
  AddressBookData,
  IMemoConfig,
  IRecipientConfig,
  IRecipientConfigWithICNS,
  RegisterConfig,
} from "@keplr-wallet/hooks";
import { NewMnemonicConfig } from "screens/register/mnemonic";
import { BIP44HDPath, ExportKeyRingData } from "@keplr-wallet/background";

interface Configs {
  amount: string;
  denom: string;
  recipient?: any;
  memo?: string;
}

export interface State {
  isNext: boolean;
  configs: Configs;
}
const { SmartNavigatorProvider, useSmartNavigation } =
  createSmartNavigatorProvider(
    new SmartNavigator({
      Unlock: {
        upperScreenName: "Unlock",
      },
      "Register.Intro": {
        upperScreenName: "Register",
      },
      "Register.NewMnemonic": {
        upperScreenName: "Register",
      },
      "Register.VerifyMnemonic": {
        upperScreenName: "Register",
      },
      "Register.RecoverMnemonic": {
        upperScreenName: "Register",
      },
      "Register.MigrateETH": {
        upperScreenName: "Register",
      },
      "Register.CreateAccount": {
        upperScreenName: "Register",
      },
      "Register.Ledger": {
        upperScreenName: "Register",
      },
      "Register.TorusSignIn": {
        upperScreenName: "Register",
      },
      "Register.ImportFromExtension.Intro": {
        upperScreenName: "Register",
      },
      "Register.ImportFromExtension": {
        upperScreenName: "Register",
      },
      "Register.ImportFromExtension.SetPassword": {
        upperScreenName: "Register",
      },
      "Register.End": {
        upperScreenName: "Register",
      },
      Home: {
        upperScreenName: "HomeTab",
      },
      Receive: {
        upperScreenName: "Others",
      },
      Send: {
        upperScreenName: "Others",
      },
      Portfolio: {
        upperScreenName: "HomeTab",
      },
      NativeTokens: {
        upperScreenName: "HomeTab",
      },
      Tokens: {
        upperScreenName: "Others",
      },
      Camera: {
        upperScreenName: "Others",
      },
      Inbox: {
        upperScreenName: "HomeTab",
      },
      "Staking.Dashboard": {
        upperScreenName: "Stake",
      },
      "Validator.Details": {
        upperScreenName: "Stake",
      },
      "SelectorValidator.Details": {
        upperScreenName: "Stake",
      },
      "Validator.List": {
        upperScreenName: "Stake",
      },
      Delegate: {
        upperScreenName: "Stake",
      },
      Undelegate: {
        upperScreenName: "Stake",
      },
      Redelegate: {
        upperScreenName: "Stake",
      },
      Governance: {
        upperScreenName: "Setting",
      },
      "Governance Details": {
        upperScreenName: "Setting",
      },
      "Setting.ViewPrivateData": {
        upperScreenName: "Setting",
      },
      "Setting.Currency": {
        upperScreenName: "Setting",
      },
      "Setting.Version": {
        upperScreenName: "Setting",
      },
      "Setting.ChainList": {
        upperScreenName: "Setting",
      },
      "Setting.AddToken": {
        upperScreenName: "Setting",
      },
      "Setting.ManageTokens": {
        upperScreenName: "Setting",
      },
      AddressBook: {
        upperScreenName: "AddressBooks",
      },
      SecurityAndPrivacy: {
        upperScreenName: "Others",
      },
      AddAddressBook: {
        upperScreenName: "AddressBooks",
      },
      EditAddressBook: {
        upperScreenName: "AddressBooks",
      },
      Result: {
        upperScreenName: "Others",
      },
      "Web.Intro": {
        upperScreenName: "Web",
      },
      "Web.Osmosis": {
        upperScreenName: "Web",
      },
      "Web.OsmosisFrontier": {
        upperScreenName: "Web",
      },
      "Web.Stargaze": {
        upperScreenName: "Web",
      },
      "Web.Umee": {
        upperScreenName: "Web",
      },
      "Web.Junoswap": {
        upperScreenName: "Web",
      },
      WebView: {
        upperScreenName: "Others",
      },
      RenameWallet: {
        upperScreenName: "Others",
      },
      DeleteWallet: {
        upperScreenName: "Others",
      },
    }).withParams<{
      WebView: {
        url: string;
      };
      "Staking.Dashboard": {
        isTab?: boolean;
      };
      "Register.Intro": {
        isBack: boolean;
      };
      "Register.NewMnemonic": {
        registerConfig: RegisterConfig;
      };
      "Register.VerifyMnemonic": {
        registerConfig: RegisterConfig;
        newMnemonicConfig: NewMnemonicConfig;
      };
      "Register.RecoverMnemonic": {
        registerConfig: RegisterConfig;
      };
      "Register.MigrateETH": {
        registerConfig: RegisterConfig;
      };
      "Register.CreateAccount": {
        registerConfig: RegisterConfig;
        mnemonic: string;
        bip44HDPath?: BIP44HDPath;
        title?: string;
      };
      "Register.Ledger": {
        registerConfig: RegisterConfig;
      };
      "Register.TorusSignIn": {
        registerConfig: RegisterConfig;
        type: "google" | "apple";
      };
      "Register.ImportFromExtension.Intro": {
        registerConfig: RegisterConfig;
      };
      "Register.ImportFromExtension": {
        registerConfig: RegisterConfig;
      };
      "Register.ImportFromExtension.SetPassword": {
        registerConfig: RegisterConfig;
        exportKeyRingDatas: ExportKeyRingData[];
        addressBooks: { [chainId: string]: AddressBookData[] | undefined };
      };
      "Register.End": {
        password?: string;
      };
      Receive: {
        chainId?: string;
      };
      Send: {
        chainId?: string;
        currency?: string;
        recipient?: string;
        state?: State;
      };
      NativeTokens: {
        tokenString: string;
        tokenBalanceString: string;
      };
      Camera: {
        showMyQRButton?: boolean;
        recipientConfig?: IRecipientConfig | IRecipientConfigWithICNS;
      };
      "Validator.Details": {
        validatorAddress: string;
        prevSelectedValidator?: string;
      };
      "SelectorValidator.Details": {
        prevSelectedValidator?: string;
        validatorAddress: string;
      };
      "Validator.List": {
        prevSelectedValidator?: string;
        selectedValidator?: string;
      };
      Delegate: {
        validatorAddress: string;
      };
      Undelegate: {
        validatorAddress: string;
      };
      Redelegate: {
        selectedValidatorAddress?: string;
        validatorAddress: string;
      };
      "Governance Details": {
        proposalId: string;
      };
      "Setting.ViewPrivateData": {
        privateData: string;
        privateDataType: string;
      };
      AddressBook: {
        recipientConfig?: IRecipientConfig;
        memoConfig?: IMemoConfig;
      };
      AddAddressBook: {
        chainId: string;
        addressBookConfig: AddressBookConfig;
      };
    }>()
  );

export { SmartNavigatorProvider, useSmartNavigation };
