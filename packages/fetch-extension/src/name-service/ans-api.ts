import { ContextProps } from "@components/notification";
import { agentDomainNames, ownerAddresses, writerAddresses } from "./constants";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  MakeTxResponse,
  SecretAccount,
} from "@keplr-wallet/stores";
import { ANS_CONTRACT_ADDRESS } from "../config.ui.var";

export const getYourAgentDomains = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const domains = agentDomainNames.map((domainObj) => domainObj.domain);
      resolve(domains);
    }, 1000);
  });
};

export const getDomainOwners = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const domains = ownerAddresses.map((domainObj) => domainObj);
      resolve(domains);
    }, 1000);
  });
};
export const getDomainWriters = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const domains = writerAddresses.map((domainObj) => domainObj);
      resolve(domains);
    }, 1000);
  });
};
export const getAllAgentDomains = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const domains = agentDomainNames.map((domainObj) => domainObj.domain);
      resolve(domains);
    }, 1000);
  });
};

export const registerDomain = async (
  account: AccountSetBase & CosmosAccount & CosmwasmAccount & SecretAccount,
  agent_address: any,
  domain: string,
  notification: ContextProps
) => {
  const tx = account.cosmwasm.makeExecuteContractTx(
    `executeWasm`,
    ANS_CONTRACT_ADDRESS,
    {
      register: {
        domain,
        agent_address,
      },
    },
    []
  );
  await executeTxn(tx, notification);
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
