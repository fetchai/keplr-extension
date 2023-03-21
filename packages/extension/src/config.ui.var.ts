import { IntlMessages } from "./languages";
import { RegisterOption } from "@keplr-wallet/hooks";
import sendTokenIcon from "@assets/icon/send-token.png";
import claimTokenIcon from "@assets/icon/claim-token.png";
import autoCompoundIcon from "@assets/icon/auto-compound.png";
import closeIcon from "@assets/icon/close-grey.png";

export const PROD_AMPLITUDE_API_KEY =
  process.env["PROD_AMPLITUDE_API_KEY"] || "";
export const DEV_AMPLITUDE_API_KEY = process.env["DEV_AMPLITUDE_API_KEY"] || "";
export const ETHEREUM_ENDPOINT =
  "https://mainnet.infura.io/v3/eeb00e81cdb2410098d5a270eff9b341";

export const ADDITIONAL_SIGN_IN_PREPEND:
  | RegisterOption[]
  | undefined = undefined;

export const ADDITIONAL_INTL_MESSAGES: IntlMessages = {};

// export const MESSAGING_SERVER = "http://localhost:4000/graphql";
// export const SUBSCRIPTION_SERVER = "ws://localhost:4000/subscription";
// export const AUTH_SERVER = "http://localhost:5500";

export const AUTH_SERVER = "https://auth-attila.sandbox-london-b.fetch-ai.com";

export const CHAIN_ID_DORADO = "dorado-1";
export const CHAIN_ID_FETCHHUB = "fetchhub-4";

export const GROUP_PAGE_COUNT = 30;
export const CHAT_PAGE_COUNT = 30;

let SUBSCRIPTION_SERVER, MESSAGING_SERVER;
if (process.env.NODE_ENV === "production") {
  SUBSCRIPTION_SERVER = "wss://messaging.fetch-ai.network/subscription";
  MESSAGING_SERVER = "https://messaging.fetch-ai.network/graphql";
} else {
  SUBSCRIPTION_SERVER =
    "wss://messaging-server.sandbox-london-b.fetch-ai.com/subscription";
  MESSAGING_SERVER =
    "https://messaging-server.sandbox-london-b.fetch-ai.com/graphql";
}

export const GRAPHQL_URL = { SUBSCRIPTION_SERVER, MESSAGING_SERVER };

export const AGENT_ADDRESS =
  "agent1qdhydny2mmdntqn6dx3d3wpyukaq855j2yexl2f0z07d5esl76932mctpvf";
// export const AGENT_ADDRESS =
//   "agent1qdh7x8k7se255j44dmt2yrpnxqdyn9qqt3dvcn4zy3dwq5qthl577v7njct";

export const AGENT_COMMANDS = [
  {
    command: "/transferFET",
    label: "Transfer FET",
    icon: sendTokenIcon,
    enabled: true,
  },
  {
    command: "/sendToken",
    label: "Send Token",
    icon: sendTokenIcon,
    enabled: true,
  },
  {
    command: "/autoCompound",
    label: "Auto-Compound Rewards",
    icon: autoCompoundIcon,
    enabled: false,
  },
  {
    command: "/redeemFET",
    label: "Claim Token",
    icon: claimTokenIcon,
    enabled: true,
  },
  {
    command: "/cancel",
    label: "Cancel Automation",
    icon: closeIcon,
    enabled: true,
  },
];

export const TRANSACTION_APPROVED = "Transaction approved";
export const TRANSACTION_SENT = "Transaction sent";
export const TRANSACTION_FAILED = "Transaction failed";
