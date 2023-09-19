import { ContextProps } from "@components/notification";
import { makeSignDoc } from "@cosmjs/amino";
import { toBase64, toBech32 } from "@cosmjs/encoding";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  MakeTxResponse,
  SecretAccount,
} from "@keplr-wallet/stores";
import { generateUUID } from "@utils/auth";
import axios from "axios";
import { sha256 } from "sha.js";
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
  const sender = toBech32("agent", account.pubKey);
  const session = generateUUID();
  const schema_digest =
    "model:a830ecadac9ea969c7062b316043fed2212ef1c3cc628d533d67673cf8cfb486";
  const expires = parseInt(`${new Date().getTime() / 1000 + 30}`);
  const payloadJson = {
    domain,
    address: sender,
    public_key: toBase64(account.pubKey),
    chain_id: chainId,
  };
  const payload = toBase64(Buffer.from(JSON.stringify(payloadJson)));

  const digest = await createDigest({
    sender,
    target,
    session,
    payload,
    schema_digest,
  });
  const memo = "";
  const accountNumber = 0;
  const sequence = 0;

  // Construct a transaction
  const msg = {
    type: "cosmos-sdk/MsgSignData",
    value: {
      data: digest.toString("base64"),
      from_address: sender,
    },
  };

  const fee = {
    amount: [],
    gas: "200000",
  };

  // Create a StdSignDoc
  const signDoc = makeSignDoc(
    [msg],
    fee,
    chainId,
    memo,
    accountNumber,
    sequence
  );
  const signedTxResponse = await window.keplr?.signAmino(
    chainId,
    account.bech32Address,
    signDoc
  );
  if (signedTxResponse?.signature.signature) {
    const signature = toBech32(
      "sig",
      Buffer.from(signedTxResponse.signature.signature),
      1000
    );

    const response = await axios.post(
      "https://oracle.sandbox-london-b.fetch-ai.com/submit",
      {
        version: 1,
        sender,
        target,
        session: generateUUID(),
        schema_digest,
        protocol_digest: null,
        nonce: null,
        payload,
        expires,
        signature,
      },
      {
        headers: {
          "content-type": "application/json",
          "x-uagents-connection": "sync",
        },
      }
    );
    console.log(response);
  }
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

const createDigest = async (data: any) => {
  const { sender, target, session, payload, expires, schema_digest } = data;
  const hasher = new sha256();
  const encoder = new TextEncoder();
  hasher.update(encoder.encode(sender));
  hasher.update(encoder.encode(target));
  hasher.update(encoder.encode(session));
  hasher.update(encoder.encode(schema_digest));
  hasher.update(encoder.encode(payload));
  hasher.update(encoder.encode(expires));
  return hasher.digest();
};
