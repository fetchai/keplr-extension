import { ContextProps } from "@components/notification";
import { fromBase64, toBase64, toBech32, toHex } from "@cosmjs/encoding";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  MakeTxResponse,
  SecretAccount,
} from "@keplr-wallet/stores";
import { encodeLengthPrefixed } from "@utils/ans-v2-utils";
import { generateUUID } from "@utils/auth";
import axios from "axios";
import { createHash } from "crypto";
import { ANS_CONFIG } from "../config.ui.var";

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
  agent_address: any,
  domain: string,
  notification: ContextProps,
  approval_token?: string
) => {
  const registerData: {
    domain: string;
    agent_address: any;
    approval_token?: string;
  } = {
    domain,
    agent_address,
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
    []
  );

  await executeTxn(tx, notification);
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
  await executeTxn(tx, notification);
};

export const verifyDomain = async (
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  chainId: string,
  domain: string
) => {
  const target =
    "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w";
  const sender = toBech32("user", account.pubKey);
  const payloadJson = {
    domain,
    address: sender,
    public_key: toHex(account.pubKey),
    chain_id: chainId,
  };
  const payload = toBase64(Buffer.from(JSON.stringify(payloadJson)));
  const session = generateUUID();
  const schema_digest =
    "model:a8a8aab82fd00e7dfbe0733ea13f4b1c1432143ea133e832a75bc1a3fb0f0860";
  const expires = parseInt(`${new Date().getTime() / 1000 + 30}`);
  const response = await axios.post(
    "https://oracle.sandbox-london-b.fetch-ai.com/submit",
    {
      version: 1,
      sender,
      target,
      session,
      schema_digest,
      protocol_digest: null,
      nonce: null,
      payload,
      expires,
    },
    {
      headers: {
        "content-type": "application/json",
        "x-uagents-connection": "sync",
      },
    }
  );
  const result = Buffer.from(fromBase64(response.data.payload)).toString();

  return JSON.parse(result);
};

const executeTxn = async (tx: MakeTxResponse, notification: ContextProps) => {
  const gasResponse = await tx.simulate();
  await tx.send(
    {
      amount: [],
      gas: Math.floor(gasResponse.gasUsed * 1.5).toString(),
    },
    "",
    {},
    {
      onFulfill: (tx: any) => {
        console.log(tx);
        notification.push({
          placement: "top-center",
          type: "success",
          duration: 2,
          content: `Transaction Successful!`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
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
  hasher.update(encodeLengthPrefixed(sender));
  hasher.update(encodeLengthPrefixed(target));
  hasher.update(encodeLengthPrefixed(session));
  hasher.update(encodeLengthPrefixed(schema_digest));
  hasher.update(encodeLengthPrefixed(payload));
  hasher.update(encodeLengthPrefixed(expires));
  return hasher.digest();
};
