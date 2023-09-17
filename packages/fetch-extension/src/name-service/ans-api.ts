import { ContextProps } from "@components/notification";
import { toBase64 } from "@cosmjs/encoding";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  MakeTxResponse,
  SecretAccount,
} from "@keplr-wallet/stores";
import { generateUUID } from "@utils/auth";
import axios from "axios";
import { ANS_CONTRACT_ADDRESS } from "../config.ui.var";

export const registerDomain = async (
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
    ANS_CONTRACT_ADDRESS,
    {
      register: registerData,
    },
    []
  );

  await executeTxn(tx, notification);
};

export const updateDomainPermissions = async (
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  owner: any,
  domain: string,
  permissions: string,
  notification: ContextProps
) => {
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONTRACT_ADDRESS,
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
  const pubkeyBuffer = Buffer.from(account.pubKey as any, "hex");
  const payload = {
    domain,
    address: account.bech32Address,
    public_key: pubkeyBuffer.toString("base64"),
    chain_id: chainId,
  };
  const payloadBuffer = new Buffer(JSON.stringify(payload));

  const response = await axios.post(
    "https://oracle.sandbox-london-b.fetch-ai.com/submit",
    {
      version: 1,
      sender:
        "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w",
      target:
        "agent1q2v2gegkl9syp6m93aycfv8djwqwtywyumlnlhqrj3pcnyel6y9dy8r2g5w",
      session: generateUUID(), //??
      schema_digest:
        "model:a830ecadac9ea969c7062b316043fed2212ef1c3cc628d533d67673cf8cfb486",
      signature: "",
      protocol_digest: null,
      nonce: null,
      payload: toBase64(payloadBuffer),
    }
  );
  console.log(response);
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
