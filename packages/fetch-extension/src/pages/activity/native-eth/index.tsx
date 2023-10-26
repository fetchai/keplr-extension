import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import pendingIcon from "@assets/icon/awaiting.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";
import contractIcon from "@assets/icon/contract-grey.png";
import { FilterActivities } from "../filter";

const options = [
  { value: "FundsTransfers", label: "Funds transfers" },
  { value: "ContractInteraction", label: "Contract interaction" },
];
interface ITxn {
  hash: string;
  type: "ContractInteraction" | "FundsTransfers";
  status: "pending" | "success" | "failed";
  amount: string;
  symbol: string;
}

const TransactionItem: FunctionComponent<{
  transactionInfo: ITxn;
}> = ({ transactionInfo }) => {
  const [explorerUrl, setExplorerUrl] = useState("");
  const { chainStore, accountStore } = useStore();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "success":
        return success;
      case "pending":
        return pendingIcon;
      default:
        return cancel;
    }
  };

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case "FundsTransfers":
        return sendIcon;
      case "ContractInteraction":
        return contractIcon;
      default:
        return contractIcon;
    }
  };

  useEffect(() => {
    (async () => {
      const chains = await axios.get("https://chainid.network/chains.json");
      const chainId = chainStore.current.chainId;
      if (chains.status === 200) {
        const chainData = chains.data.find(
          (element: any) => chainId == element.chainId
        );
        setExplorerUrl(chainData.explorers[0].url);
      }
    })();
  }, [chainStore.current.chainId]);

  const displayActivity = (status: string, amount: string) => {
    return (
      <div className={style["activityRow"]}>
        <div className={style["activityCol"]} style={{ width: "7%" }}>
          <img
            src={getActivityIcon(transactionInfo.type)}
            alt={transactionInfo.type}
          />
        </div>
        <div
          className={style["activityCol"]}
          style={{ width: "53%", overflow: "hidden" }}
        >
          {transactionInfo.hash}
        </div>
        <div className={style["activityCol"]} style={{ width: "33%" }}>
          {accountInfo.ethereum.weiToEther(amount) +
            (transactionInfo.type === "ContractInteraction"
              ? transactionInfo.symbol
              : chainStore.current.currencies[0].coinDenom)}
        </div>
        <div className={style["activityCol"]} style={{ width: "7%" }}>
          <img src={getStatusIcon(status)} alt={status} />
        </div>
      </div>
    );
  };

  return explorerUrl ? (
    <a
      href={explorerUrl + "/tx/" + transactionInfo.hash}
      target="_blank"
      rel="noreferrer"
    >
      {displayActivity(transactionInfo.status, transactionInfo.amount)}
    </a>
  ) : (
    displayActivity(transactionInfo.status, transactionInfo.amount)
  );
};

export const NativeEthTab = ({ latestBlock }: { latestBlock: any }) => {
  const { chainStore, accountStore } = useStore();
  const [hashList, setHashList] = useState<ITxn[]>([]);
  const [explorerUrl, setExplorerUrl] = useState("");
  const [filter, setFilter] = useState<string[]>(
    options.map((option) => option.value)
  );

  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  const getTxList = async () => {
    const txList: ITxn[] | unknown = await accountInfo.ethereum.getTxList(
      `${accountInfo.ethereumHexAddress}-${chainStore.current.chainId}`
    );
    const rv: any = await txList;
    const filteredList = filterHashList(rv, filter);
    setHashList(filteredList.reverse());
  };

  const checkStatusAndUpdate = async (hash: string) => {
    const status = await accountInfo.ethereum.checkTransactionStatus(hash);
    if (status === 1) {
      await accountInfo.ethereum.updateTransactionStatus(hash, "success");
      await getTxList();
    } else if (status === 0) {
      await accountInfo.ethereum.updateTransactionStatus(hash, "failed");
      await getTxList();
    }
  };

  useEffect(() => {
    (async () => {
      const chains = await axios.get("https://chainid.network/chains.json");
      const chainId = chainStore.current.chainId;
      if (chains.status === 200) {
        const chainData = chains.data.find(
          (element: any) => chainId == element.chainId
        );
        setExplorerUrl(chainData.explorers[0].url);
      }
    })();
  }, [explorerUrl]);

  useEffect(() => {
    hashList.map(async (txData, _) => {
      if (txData.status === "pending") {
        await checkStatusAndUpdate(txData.hash);
      }
    });
  }, [latestBlock]);

  useEffect(() => {
    if (!accountInfo.ethereumHexAddress) {
      return;
    }

    (async () => {
      await getTxList();
    })();
  }, [accountInfo.ethereumHexAddress, chainStore.current.chainId, filter]);

  const filterHashList = (hashList: ITxn[], selectedFilters: string[]) => {
    const _list = hashList.filter((transaction) =>
      selectedFilters.includes(transaction.type)
    );
    return _list;
  };

  const handleFilterChange = (selectedFilter: string[]) => {
    setFilter(selectedFilter);
  };

  return (
    <React.Fragment>
      <div>
        <div id={"filterActivities"}>
          <FilterActivities
            onFilterChange={handleFilterChange}
            options={options}
            selectedFilter={filter}
          />
        </div>
        {hashList.map((transactionInfo, index) => (
          <TransactionItem key={index} transactionInfo={transactionInfo} />
        ))}
      </div>
    </React.Fragment>
  );
};
