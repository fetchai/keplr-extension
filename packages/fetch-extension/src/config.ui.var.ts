import { IntlMessages } from "./languages";
import { RegisterOption } from "@keplr-wallet/hooks";
import sendTokenIcon from "@assets/icon/send-token.png";
import claimTokenIcon from "@assets/icon/claim-token.png";
import autoCompoundIcon from "@assets/icon/auto-compound.png";
import closeIcon from "@assets/icon/close-grey.png";
import restartIcon from "@assets/icon/undo.png";

export const DEV_AUTH_CLIENT_ID = process.env["DEV_AUTH_CLIENT_ID"] || "";
export const PROD_AUTH_CLIENT_ID = process.env["PROD_AUTH_CLIENT_ID"] || "";
export const PROD_AMPLITUDE_API_KEY =
  process.env["PROD_AMPLITUDE_API_KEY"] || "";
export const DEV_AMPLITUDE_API_KEY = process.env["DEV_AMPLITUDE_API_KEY"] || "";
export const ETHEREUM_ENDPOINT =
  "https://mainnet.infura.io/v3/eeb00e81cdb2410098d5a270eff9b341";

export const ADDITIONAL_SIGN_IN_PREPEND: RegisterOption[] | undefined =
  undefined;

export const ADDITIONAL_INTL_MESSAGES: IntlMessages = {};

// export const MESSAGING_SERVER = "http://localhost:4000/graphql";
// export const SUBSCRIPTION_SERVER = "ws://localhost:4000/subscription";
// export const AUTH_SERVER = "http://localhost:5500";

export const AUTH_SERVER = "https://accounts.fetch.ai/v1";

export const CHAIN_ID_DORADO = "dorado-1";
export const CHAIN_ID_FETCHHUB = "fetchhub-4";
export const GROUP_PAGE_COUNT = 30;
export const CHAT_PAGE_COUNT = 30;

let SUBSCRIPTION_SERVER, MESSAGING_SERVER;
export let NOTYPHI_BASE_URL: string;

if (process.env.NODE_ENV === "production") {
  SUBSCRIPTION_SERVER = "wss://messaging-server.prod.fetch-ai.com/subscription";
  MESSAGING_SERVER = "https://messaging-server.prod.fetch-ai.com/graphql";
  NOTYPHI_BASE_URL = "https://api.notyphi.com/v1";
} else {
  SUBSCRIPTION_SERVER =
    "wss://messaging-server.sandbox-london-b.fetch-ai.com/subscription";
  MESSAGING_SERVER =
    "https://messaging-server.sandbox-london-b.fetch-ai.com/graphql";
  NOTYPHI_BASE_URL = "https://api-staging.notyphi.com/v1";
}

const ACTIVITY_SERVER: { [key: string]: string } = {
  [CHAIN_ID_DORADO]: "https://subquery-dorado.fetch.ai/",
  [CHAIN_ID_FETCHHUB]: "https://subquery.fetch.ai/",
};

export const GRAPHQL_URL = {
  SUBSCRIPTION_SERVER,
  MESSAGING_SERVER,
  ACTIVITY_SERVER,
};

let FETCHHUB_AGENT, DORADO_AGENT;
let FETCHHUB_FEEDBACK, DORADO_FEEDBACK;

if (process.env.NODE_ENV === "production") {
  FETCHHUB_AGENT =
    "agent1qvmfez9k6fycllzqc6p7telhwyzzj709n32sc5x2q0ss62ehqc3e52qgna7";
  DORADO_AGENT =
    "agent1qdhydny2mmdntqn6dx3d3wpyukaq855j2yexl2f0z07d5esl76932mctpvf";
  FETCHHUB_FEEDBACK = "https://fetchbot.prod.fetch-ai.com/";
  DORADO_FEEDBACK = "https://fetchbot-dorado.prod.fetch-ai.com/";
} else {
  FETCHHUB_AGENT =
    "agent1qv5rmumv0xe0fqlmm3k4lxu4mhmz9aluy07tgp5lmzr2z0mccttcyjksf7r";
  DORADO_AGENT =
    "agent1qtvyuq8gkywtymym00n83llwcj6dscwfaz9dgdhm2dw0e9tqmkzq7tesse9";
  FETCHHUB_FEEDBACK =
    "https://fetchbot-uagent-staging-mainnet.sandbox-london-b.fetch-ai.com";
  DORADO_FEEDBACK =
    "https://fetchbot-uagent-staging.sandbox-london-b.fetch-ai.com";
}

export const AGENT_FEEDBACK_URL: { [key: string]: string } = {
  [CHAIN_ID_DORADO]: DORADO_FEEDBACK,
  [CHAIN_ID_FETCHHUB]: FETCHHUB_FEEDBACK,
};

export const AGENT_ADDRESS: { [key: string]: string } = {
  [CHAIN_ID_FETCHHUB]: FETCHHUB_AGENT,
  [CHAIN_ID_DORADO]: DORADO_AGENT,
};
// export const AGENT_ADDRESS =
//   "agent1qdh7x8k7se255j44dmt2yrpnxqdyn9qqt3dvcn4zy3dwq5qthl577v7njct";

export const AGENT_COMMANDS = [
  {
    command: "/transferFET",
    eventName: "bot_transfer_fet_click",
    label: "transferFET (Transfer FET)",
    icon: sendTokenIcon,
    enabled: true,
  },
  {
    command: "/sendAsset",
    eventName: "bot_send_asset_click",
    label: "sendAsset (Send a native or CW20 Asset)",
    icon: sendTokenIcon,
    enabled: true,
  },
  {
    command: "/ibcTransfer",
    eventName: "bot_ibc_transfer_click",
    label: "IBC Transfer (Transfer IBC assets cross chain)",
    icon: sendTokenIcon,
    enabled: true,
  },
  {
    command: "/autocompound",
    eventName: "bot_auto_compound_click",
    label: "autocompound (Auto-Compound Rewards)",
    icon: autoCompoundIcon,
    enabled: true,
  },
  {
    command: "/redeemFET",
    eventName: "bot_redeem_fet_click",
    label: "redeemFET (Redeem Stake Rewards)",
    icon: claimTokenIcon,
    enabled: true,
  },
  {
    command: "/recurringPayments",
    eventName: "bot_recurring_payments_click",
    label: "recurringPayments (schedule payments)",
    icon: restartIcon,
    enabled: true,
  },
  {
    command: "/recurringStakes",
    eventName: "bot_recurring_stakes_click",
    label: "recurringStakes (schedule stakes)",
    icon: restartIcon,
    enabled: true,
  },
  {
    command: "/tweet",
    eventName: "bot_share_tweet_click",
    label: "tweet (Share your tweet)",
    icon: require("@assets/icon/agent-tweet.svg"),
    enabled: false,
  },
  {
    command: "/cancelRecurringTransfer",
    eventName: "bot_cancel_recurring_transfer_click",
    label: "cancelRecurringTransfer (Cancel Automation)",
    icon: closeIcon,
    enabled: true,
  },
  {
    command: "/cancelRecurringStake",
    eventName: "bot_cancel_recurring_stakes_click",
    label: "cancelRecurringStake (Cancel Automation)",
    icon: closeIcon,
    enabled: true,
  },
  {
    command: "/cancelAutocompound",
    eventName: "bot_cancel_autocompound_click",
    label: "cancelAutocompound (Cancel Automation)",
    icon: closeIcon,
    enabled: true,
  },
  {
    command: "/cancel",
    eventName: "bot_cancel_automation_click",
    label: "cancel (Cancel Automation)",
    icon: closeIcon,
    enabled: true,
  },
];

export const FNS_CONFIG: {
  [key: string]: {
    network: "mainnet" | "testnet";
    rpc: string;
    contractAddress: string;
    isEditable: boolean;
  };
} = {
  [CHAIN_ID_DORADO]: {
    network: "testnet",
    rpc: "https://rpc-dorado.fetch.ai:443",
    contractAddress:
      "fetch15hq5u4susv7d064llmupeyevx6hmskkc3p8zvt8rwn0lj02yt72s88skrf",
    isEditable: true,
  },
  [CHAIN_ID_FETCHHUB]: {
    network: "mainnet",
    rpc: "https://rpc-fetchhub.fetch.ai:443",
    contractAddress:
      "fetch1cj7pfh3aqut6p2ursuqsgceadd2p09cqjklur485sce85tvw3zusy0fpy8",
    isEditable: true,
  },
};

export const ANS_CONFIG: {
  [key: string]: {
    network: "mainnet" | "testnet";
    rpc: string;
    contractAddress: string;
    validateAgentAddressContract: string;
    oracleAgentContract: string;
    isEditable: boolean;
    apiUrl: string;
    oracleApi: string;
    schemaDigest: string;
  };
} =
  process.env.NODE_ENV === "production"
    ? {
        [CHAIN_ID_FETCHHUB]: {
          network: "mainnet",
          rpc: "https://rpc-fetchhub.fetch.ai:443",
          contractAddress:
            "fetch1479lwv5vy8skute5cycuz727e55spkhxut0valrcm38x9caa2x8q99ef0q",
          validateAgentAddressContract:
            "fetch1mezzhfj7qgveewzwzdk6lz5sae4dunpmmsjr9u7z0tpmdsae8zmquq3y0y",
          oracleAgentContract:
            "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w",
          isEditable: true,
          apiUrl: "https://agentverse.ai/v1/almanac",
          oracleApi: "https://oracle.sandbox-london-b.fetch-ai.com/submit",
          schemaDigest:
            "model:a8a8aab82fd00e7dfbe0733ea13f4b1c1432143ea133e832a75bc1a3fb0f0860",
        },
        [CHAIN_ID_DORADO]: {
          network: "testnet",
          rpc: "https://rpc-dorado.fetch.ai:443",
          contractAddress:
            "fetch1mxz8kn3l5ksaftx8a9pj9a6prpzk2uhxnqdkwuqvuh37tw80xu6qges77l",
          validateAgentAddressContract:
            "fetch1tjagw8g8nn4cwuw00cf0m5tl4l6wfw9c0ue507fhx9e3yrsck8zs0l3q4w",
          oracleAgentContract:
            "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w",
          isEditable: true,
          apiUrl: "https://agentverse.ai/v1/almanac",
          oracleApi: "https://oracle.sandbox-london-b.fetch-ai.com/submit",
          schemaDigest:
            "model:a8a8aab82fd00e7dfbe0733ea13f4b1c1432143ea133e832a75bc1a3fb0f0860",
        },
      }
    : {
        [CHAIN_ID_DORADO]: {
          network: "testnet",
          rpc: "https://rpc-dorado.fetch.ai:443",
          contractAddress:
            "fetch1mxz8kn3l5ksaftx8a9pj9a6prpzk2uhxnqdkwuqvuh37tw80xu6qges77l",
          validateAgentAddressContract:
            "fetch1tjagw8g8nn4cwuw00cf0m5tl4l6wfw9c0ue507fhx9e3yrsck8zs0l3q4w",
          oracleAgentContract:
            "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w",
          isEditable: true,
          apiUrl: "https://staging.agentverse.ai/v1/almanac",
          oracleApi: "https://oracle.sandbox-london-b.fetch-ai.com/submit",
          schemaDigest:
            "model:a8a8aab82fd00e7dfbe0733ea13f4b1c1432143ea133e832a75bc1a3fb0f0860",
        },
        [CHAIN_ID_FETCHHUB]: {
          network: "mainnet",
          rpc: "https://rpc-fetchhub.fetch.ai:443",
          contractAddress:
            "fetch1479lwv5vy8skute5cycuz727e55spkhxut0valrcm38x9caa2x8q99ef0q",
          validateAgentAddressContract:
            "fetch1mezzhfj7qgveewzwzdk6lz5sae4dunpmmsjr9u7z0tpmdsae8zmquq3y0y",
          oracleAgentContract:
            "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w",
          isEditable: true,
          apiUrl: "https://staging.agentverse.ai/v1/almanac",
          oracleApi: "https://oracle.sandbox-london-b.fetch-ai.com/submit",
          schemaDigest:
            "model:a8a8aab82fd00e7dfbe0733ea13f4b1c1432143ea133e832a75bc1a3fb0f0860",
        },
      };
export const ANS_AMOUNT = { amount: "600000", denom: "afet" };
export const ANS_TRNSX_AMOUNT = {
  denom: "atestfet",
  amount: "5000000000000000",
};

export const TRANSACTION_APPROVED = "Transaction approved";
export const TRANSACTION_SENT = "Transaction sent";
export const TRANSACTION_SIGNED = "Transaction signed";
export const TRANSACTION_FAILED = "Transaction failed";

export const AXL_BRIDGE_EVM_TRNSX_FEE = {
  gas: "2730000",
  amount: [{ denom: "eth", amount: "4000000000000000" }],
};
export const ANS_REGISTERATION_REGEX =
  /^[0-9\-.]*[\u203C\u2049\u20E3\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2601\u260E\u2611\u2614-\u2615\u261D\u263A\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2693\u26A0-\u26A1\u26AA-\u26AB\u26BD-\u26BE\u26C4-\u26C5\u26CE\u26D4\u26EA\u26F2-\u26F3\u26F5\u26FA\u26FD\u2702\u2705\u2708-\u270C\u270F\u2712\u2714\u2716\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2764\u2795-\u2797\u27A1\u27B0\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299\u1F004\u1F0CF\u1F170-\u1F171\u1F17E-\u1F17F\u1F18E\u1F191-\u1F19A\u1F1E7-\u1F1EC\u1F1EE-\u1F1F0\u1F1F3\u1F1F5\u1F1F7-\u1F1FA\u1F201-\u1F202\u1F21A\u1F22F\u1F232-\u1F23A\u1F250-\u1F251\u1F300-\u1F320\u1F330-\u1F335\u1F337-\u1F37C\u1F380-\u1F393\u1F3A0-\u1F3C4\u1F3C6-\u1F3CA\u1F3E0-\u1F3F0\u1F400-\u1F43E\u1F440\u1F442-\u1F4F7\u1F4F9-\u1F4FC\u1F500-\u1F507\u1F509-\u1F53D\u1F550-\u1F567\u1F5FB-\u1F640\u1F645-\u1F64F\u1F680-\u1F68A]+$/u;
