import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useStore } from "../../../stores";
// import { AppCurrency } from "@keplr-wallet/types";
import style from "./style.module.scss";
import sendIcon from "@assets/icon/send-grey.png";
import pendingIcon from "@assets/icon/awaiting.png";
import success from "@assets/icon/success.png";
import cancel from "@assets/icon/cancel.png";
import { Alert, Tooltip } from "reactstrap";
import { FilterActivities } from "../filter";

interface ItxData {
  to: string;
  value: string;
  from: string;
  gas: string;
  blockNumber: string;
  type: string;
  time: string;
}
const options = [
  { value: "FundsTransfers", label: "Funds transfers" },
  { value: "ContractInteraction", label: "Contract interaction" },
];
export interface ITxn {
  hash: string;
  status: "pending" | "success" | "failed";
}

const TransactionDetailsModal: FunctionComponent<{
  transactionUrl: string;
  txData: ItxData;
  isTxDetailsModalOpen: boolean;
  setIsTxDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  transactionUrl,
  txData,
  isTxDetailsModalOpen,
  setIsTxDetailsModalOpen,
}) => {
  return (
    <Modal
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(50, 50, 50, 0.75)",
        },
        content: {
          width: "330px",
          minWidth: "330px",
          minHeight: "unset",
          maxHeight: "unset",
        },
      }}
      isOpen={isTxDetailsModalOpen}
      onRequestClose={() => {
        setIsTxDetailsModalOpen(false);
      }}
    >
      <div>
        <h3 style={{ marginBottom: "8px" }}>Transaction Details</h3>
        <div
          style={{
            marginBottom: "8px",
            fontSize: "14px",
            overflowWrap: "break-word",
          }}
        >
          {transactionUrl !== "" && (
            <a href={transactionUrl} target="_blank" rel="noopener noreferrer">
              View in explorer
            </a>
          )}
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "white",
            backgroundColor: "#FC7C5F",
            padding: "5px 8px",
          }}
        >
          <div
            style={{
              overflowWrap: "break-word",
            }}
          >
            <strong>Type:</strong> {txData.type}
          </div>
          {txData.type === "Sent" ? (
            <div
              style={{
                overflowWrap: "break-word",
              }}
            >
              <strong>To: </strong> {txData.to}
            </div>
          ) : (
            <div>
              <strong>From: </strong> {txData.from}
            </div>
          )}
          <div>
            <strong>Value: </strong> {parseInt(txData.value, 16) + " wei"}
          </div>
          <div>
            <strong>Block: </strong> {parseInt(txData.blockNumber, 16)}
          </div>
          <div>
            <strong>Gas: </strong> {parseInt(txData.gas, 16)}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const TransactionItem: FunctionComponent<{
  transactionHash: string;
  onTransactionClick: (transactionHash: string, txData: ItxData) => void;
  status: "pending" | "success" | "failed"; // Add this
  latestBlock: number;
}> = ({ transactionHash, onTransactionClick, status }) => {
  const [txData, setTxData] = useState<ItxData>({
    to: "",
    value: "",
    from: "",
    gas: "",
    blockNumber: "",
    type: "",
    time: "",
  });
  //   const [color, setColor] = useState("yellow")
  const { chainStore, accountStore } = useStore();

  const getTxnInfo = async (rpcUrl: string, txn: string) => {
    try {
      const response = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionByHash",
        params: [txn],
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(
        "Unable to connect with RPC url provided or fetch chains data:",
        error
      );
    }
  };

  const getBlockInfo = async (rpcUrl: string, blockNumber: string) => {
    try {
      const response = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [blockNumber, false],
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(
        "Unable to connect with RPC url provided or fetch block data:",
        error
      );
    }
  };

  const currentRpc = chainStore.current.rpc;
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const formattedTime = hours + ":" + minutes.substr(-2);
    console.log(
      `${formattedTime} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    );
    return `${formattedTime} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  // This info can be cached
  useEffect(() => {
    (async () => {
      const resp = await getTxnInfo(currentRpc, transactionHash);
      const blockData = await getBlockInfo(currentRpc, resp.result.blockNumber);
      console.log(blockData.result);
      const _txData = {
        to: resp.result.to,
        value: resp.result.value,
        from: resp.result.from,
        gas: resp.result.gas,
        blockNumber: resp.result.blockNumber,
        type: resp.result.type,
        time: formatTimestamp(parseInt(blockData.result.timestamp, 16)),
      };
      setTxData(_txData);
    })();
  }, [transactionHash]);

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
  return (
    <div
      className={style["activityRow"]}
      onClick={() => onTransactionClick(transactionHash, txData)}
    >
      <div className={style["activityCol"]} style={{ width: "7%" }}>
        <img src={sendIcon} />
      </div>
      <div className={style["activityCol"]} style={{ width: "53%" }}>
        {txData.value
          ? accountInfo.ethereum.weiToEther(txData.value) +
            " " +
            chainStore.current.currencies[0].coinDenom
          : "Fetcing tx details"}
      </div>
      <div className={style["activityCol"]} style={{ width: "53%" }}>
        {txData.time}
      </div>
      <div className={style["activityCol"]} style={{ width: "7%" }}>
        <img src={getStatusIcon(status)} alt={status} />
      </div>
    </div>
  );
};

export const NativeEthTab = ({ latestBlock }: { latestBlock: any }) => {
  const { chainStore, accountStore } = useStore();
  const [isTxDetailsModalOpen, setIsTxDetailsModalOpen] = useState(false);
  const [hashlist, setHashlist] = useState<ITxn[]>([]);
  const [transactionUrl, setTransactionUrl] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [filter, setFilter] = useState<string[]>(
    options.map((option) => option.value)
  );
  const InitialTxData = {
    to: "",
    value: "",
    from: "",
    gas: "",
    blockNumber: "",
    type: "",
    time: "",
  };
  const [txnData, settxnData] = useState<ItxData>(InitialTxData);
  const [visible, setVisible] = useState(true);

  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const onDismiss = () => setVisible(false);

  const getTxList = async () => {
    const txList: ITxn[] | unknown = await accountInfo.ethereum.getTxList(
      accountInfo.ethereumHexAddress
    );
    const rv = await txList;
    Array.isArray(rv) ? setHashlist(rv) : "";
  };

  const chechStatusAndUpdate = async (hash: string) => {
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
    console.log("updating...");
    hashlist.map(async (txData, _) => {
      if (txData.status === "pending") {
        console.log(txData.hash);
        await chechStatusAndUpdate(txData.hash);
      }
    });
  }, [latestBlock]);

  useEffect(() => {
    // async mutex check || normal mutex
    if (!accountInfo.ethereumHexAddress) {
      return;
    }

    (async () => {
      await getTxList();
    })();
  }, [accountInfo.ethereumHexAddress]);

  const onTransactionClick = async (transaction: string, txData: ItxData) => {
    const _transactionUrl = explorerUrl + "/tx/" + transaction;
    console.log(_transactionUrl);
    if (explorerUrl !== "") {
      setTransactionUrl(_transactionUrl);
    }
    setIsTxDetailsModalOpen(true);
    settxnData(txData);
  };
  const handleFilterChange = (selectedFilter: string[]) => {
    setFilter(selectedFilter);
  };
  // TODO: remove this when filter feature is done
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
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
        {/* TODO:  remove tool tip when filter feature is done */}
        <Tooltip
          placement={"top"}
          isOpen={tooltipOpen}
          target={"filterActivities"}
          toggle={toggle}
        >
          WIP: filter activities
        </Tooltip>
        <TransactionDetailsModal
          transactionUrl={transactionUrl}
          txData={txnData}
          isTxDetailsModalOpen={isTxDetailsModalOpen}
          setIsTxDetailsModalOpen={setIsTxDetailsModalOpen}
        />
        {hashlist.length ? (
          <Alert color="warning" isOpen={visible} toggle={onDismiss}>
            Click on transaction below to see more details!
          </Alert>
        ) : (
          <Alert color="danger" isOpen={visible} toggle={onDismiss}>
            No transactions available to display
          </Alert>
        )}
        {hashlist.reverse().map((transactionInfo, index) => (
          <TransactionItem
            key={index}
            transactionHash={transactionInfo.hash}
            onTransactionClick={onTransactionClick}
            status={transactionInfo.status}
            latestBlock={latestBlock}
          />
        ))}
      </div>
    </React.Fragment>
  );
};
