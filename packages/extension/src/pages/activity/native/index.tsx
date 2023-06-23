import { fetchTransactions } from "@graphQL/activity-api";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useStore } from "../../../stores";
import { FilterActivities } from "../filter";
import { ActivityRow } from "./activity-row";
import style from "../style.module.scss";

const options = [
  { value: "/cosmos.bank.v1beta1.MsgSend", label: "Funds transfers" },
  {
    value: "/cosmos.staking.v1beta1.MsgDelegate",
    label: "Staked Funds",
  },
  {
    value: "/cosmos.staking.v1beta1.MsgUndelegate",
    label: "Unstaked Funds",
  },
  {
    value:
      "/cosmos.authz.v1beta1.MsgExec,/cosmwasm.wasm.v1.MsgExecuteContract,/cosmos.authz.v1beta1.MsgRevoke",
    label: "Contract Interactions",
  },
  {
    value: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    label: "Claim Rewards",
  },
  {
    value: "/ibc.applications.transfer.v1.MsgTransfer",
    label: "IBC transfers",
  },
];

export const NativeTab = ({ latestBlock }: { latestBlock: any }) => {
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [nodes, setNodes] = useState<any>({});
  const [pageInfo, setPageInfo] = useState<any>();
  const [filter, setFilter] = useState<string[]>(
    options.map((option) => option.value)
  );

  const fetchNodes = async (cursor: any) => {
    setIsLoading(true);
    const fetchedData = await fetchTransactions(
      current.chainId,
      cursor,
      accountInfo.bech32Address,
      filter
    );
    if (fetchedData) {
      const nodeMap: any = {};
      fetchedData.nodes.map((node: any) => {
        nodeMap[node.id] = node;
      });

      setPageInfo(fetchedData.pageInfo);
      setNodes({ ...nodes, ...nodeMap });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const fetchedData = await fetchTransactions(
        current.chainId,
        "",
        accountInfo.bech32Address,
        options.map((option) => option.value)
      );
      if (fetchedData) {
        const nodeMap: any = {};
        fetchedData.nodes.map((node: any) => {
          nodeMap[node.id] = node;
        });

        setPageInfo(fetchedData.pageInfo);
        setNodes({ ...nodeMap });
      }

      setIsLoading(false);
    };
    init();
  }, [accountInfo.bech32Address, current.chainId]);

  useEffect(() => {
    const refreshNodes = async () => {
      setIsLoading(true);
      const fetchedData = await fetchTransactions(
        current.chainId,
        "",
        accountInfo.bech32Address,
        filter
      );
      if (fetchedData) {
        const nodeMap: any = {};
        fetchedData.nodes.map((node: any) => {
          nodeMap[node.id] = node;
        });

        setPageInfo(fetchedData.pageInfo);
        setNodes({ ...nodes, ...nodeMap });
      }

      setIsLoading(false);
    };
    if (!isLoading) refreshNodes();
  }, [filter, latestBlock]);

  const handleClick = async () => {
    setLoadingRequest(true);
    await fetchNodes(pageInfo.endCursor);
    setLoadingRequest(false);
  };

  const handleFilterChange = (selectedFilter: string[]) => {
    setPageInfo(undefined);
    setNodes({});
    setFilter(selectedFilter);
    if (
      selectedFilter.includes(
        "/cosmos.authz.v1beta1.MsgExec,/cosmwasm.wasm.v1.MsgExecuteContract,/cosmos.authz.v1beta1.MsgRevoke"
      )
    ) {
      selectedFilter.push("/cosmos.authz.v1beta1.MsgExec");
      selectedFilter.push("/cosmwasm.wasm.v1.MsgExecuteContract");
      selectedFilter.push("/cosmos.authz.v1beta1.MsgExec");
    }
  };

  return (
    <React.Fragment>
      <FilterActivities
        onFilterChange={handleFilterChange}
        options={options}
        selectedFilter={filter}
      />
      {Object.keys(nodes).length > 0 ? (
        <React.Fragment>
          {Object.values(nodes).map((node, index) => (
            <ActivityRow node={node} key={index} />
          ))}
          {pageInfo?.hasNextPage && (
            <Button
              outline
              color="primary"
              size="sm"
              block
              disabled={!pageInfo?.hasNextPage || loadingRequest}
              onClick={handleClick}
              className="mt-2"
            >
              Load more{" "}
              {loadingRequest && <i className="fas fa-spinner fa-spin ml-2" />}
            </Button>
          )}
        </React.Fragment>
      ) : isLoading ? (
        <div className={style.activityMessage}>Loading Activities...</div>
      ) : (
        <div className={style.activityMessage}>
          No activity available right now
        </div>
      )}
    </React.Fragment>
  );
};
