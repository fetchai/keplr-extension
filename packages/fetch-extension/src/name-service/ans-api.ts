import { ContextProps, NotificationProperty } from "@components/notification";
import { fromBase64, toBase64, toBech32, toHex } from "@cosmjs/encoding";
import { PubKeyPayload, SignPayload } from "@keplr-wallet/background/build/ans";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  MakeTxResponse,
  SecretAccount,
} from "@keplr-wallet/stores";
import { generateUUID } from "@utils/auth";
import axios from "axios";
import { createHash } from "crypto";
import { ANS_AMOUNT, ANS_CONFIG } from "../config.ui.var";
import { encode } from "@utils/ans-v2-utils";

export const getAgentAddressByDomain = async (
  chainId: string,
  domainName: string
) => {
  const response = await axios.get(
    `${ANS_CONFIG[chainId].apiUrl}/search/agents-by-domain/${domainName}`
  );
  return response.data;
};

export const getAllDomainsbyAddress = async (
  chainId: string,
  address: string
) => {
  const response = await axios.get(
    `${ANS_CONFIG[chainId].apiUrl}/search/domains/${address}`
  );
  return response.data;
};

export const getDomainDetails = async (chainId: string, domainName: string) => {
  const response = await axios.get(
    `${ANS_CONFIG[chainId].apiUrl}/search/domain_details/${domainName}`
  );
  return response.data;
};

export const registerDomain = async (
  chainId: string,
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  domain: string,
  notification: ContextProps,
  amount: any,
  approval_token?: string
) => {
  const registerData: {
    domain: string;
    approval_token?: string;
  } = {
    domain,
  };
  if (approval_token !== undefined) {
    registerData.approval_token = approval_token;
  }
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONFIG[chainId].contractAddress,
    {
      register: registerData,
    },
    [amount]
  );

  await executeTxn(tx, notification, ANS_AMOUNT);
};
export const updateRecord = async (
  chainId: string,
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  domain: string,
  notification: ContextProps,
  agentAddress: any
) => {
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONFIG[chainId].contractAddress,
    {
      update_record: {
        domain: domain,
        agent_records: [{ address: agentAddress, weight: 123 }],
      },
    },
    []
  );

  await executeTxn(tx, notification, ANS_AMOUNT);
};

export const removeDomain = async (
  chainId: string,
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  domain: string,
  notification: ContextProps
) => {
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONFIG[chainId].contractAddress,
    {
      remove_domain: {
        domain: domain,
      },
    },
    []
  );
  await executeTxn(tx, notification, ANS_AMOUNT);
};
export const resetDomain = async (
  chainId: string,
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  domain: string,
  notification: ContextProps,
  new_admin?: any
) => {
  let resetData: {
    domain: string;
    new_admin?: string;
  } = {
    domain,
    new_admin,
  };
  if (new_admin !== undefined) {
    resetData = {
      domain: domain,
      new_admin: new_admin,
    };
  }

  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONFIG[chainId].contractAddress,
    {
      reset_domain: resetData,
    },
    []
  );
  await executeTxn(tx, notification, ANS_AMOUNT);
};

export const extendDomainExpiration = async (
  chainId: string,
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  domain: string,
  notification: ContextProps
) => {
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONFIG[chainId].contractAddress,
    {
      extend_expiration: { domain: domain },
    },
    []
  );
  await executeTxn(tx, notification, ANS_AMOUNT);
};

export const updateDomainPermissions = async (
  chainId: string,
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  owner: any,
  domain: string,
  permissions: string,
  notification: ContextProps
) => {
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONFIG[chainId].contractAddress,
    {
      update_ownership: {
        domain,
        owner,
        permissions,
      },
    },
    []
  );
  await executeTxn(tx, notification, ANS_AMOUNT);
};

export const verifyDomain = async (chainId: string, domain: string) => {
  const requester = new InExtensionMessageRequester();
  const public_key = await requester.sendMessage(
    BACKGROUND_PORT,
    new PubKeyPayload(chainId)
  );
  const senderAgentAddress = toBech32("agent", public_key);
  const payloadJson = {
    domain,
    address: senderAgentAddress,
    public_key: toHex(public_key),
    chain_id: chainId,
  };
  const payload = toBase64(Buffer.from(JSON.stringify(payloadJson)));
  const data = {
    sender: senderAgentAddress,
    target: ANS_CONFIG[chainId].oracleAgentContract,
    session: generateUUID(),
    schema_digest: ANS_CONFIG[chainId].schemaDigest,
    expires: parseInt(`${new Date().getTime() / 1000 + 30}`),
    payload: payload,
  };

  let signature;
  try {
    const digest = await createDigest(data);
    signature = await requester.sendMessage(
      BACKGROUND_PORT,
      new SignPayload(chainId, digest)
    );
  } catch (err) {
    console.log("signature", err);
  }

  const response = await axios.post(
    ANS_CONFIG[chainId].oracleApi,
    {
      version: 1,
      signature,
      protocol_digest: null,
      nonce: null,
      ...data,
    },
    {
      headers: {
        "content-type": "application/json",
        "x-uagents-connection": "sync",
      },
    }
  );
  const result = Buffer.from(fromBase64(response.data.payload)).toString();
  console.log(result);
  return JSON.parse(result);
};

const notificationProperty: NotificationProperty = {
  placement: "top-center",
  type: "success",
  duration: 2,
  content: `Transaction Successful!`,
  canDelete: true,
  transition: {
    duration: 0.25,
  },
};
const executeTxn = async (
  tx: MakeTxResponse,
  notification: ContextProps,
  amount?: any
) => {
  const gasResponse = await tx.simulate();
  await tx.send(
    {
      amount: [amount],
      gas: Math.floor(gasResponse.gasUsed * 1.5).toString(),
    },
    "",
    {},

    {
      onFulfill: (tx: any) => {
        console.log("trnsx hash: ", tx.hash);
        notification.push(notificationProperty);
      },

      onBroadcastFailed: (tx: any) => {
        console.log(tx);
        notification.push({
          placement: "top-center",
          type: "danger",
          duration: 2,
          content: `Transaction Failed!`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
      },
    }
  );
};

export const createDigest = async (data: any) => {
  const { sender, target, session, payload, expires, schema_digest } = data;
  const hasher = createHash("sha256");
  hasher.update(encode(sender));
  hasher.update(encode(target));
  hasher.update(encode(session));
  hasher.update(encode(schema_digest));
  hasher.update(encode(payload));
  // Update with expires if not null
  if (expires !== null) {
    // Convert expires to a packed 64-bit integer and update the hasher
    hasher.update(encode(expires));
  }
  return hasher.digest();
};
