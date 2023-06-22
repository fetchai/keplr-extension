import { fetchTransactions } from "@graphQL/activity-api";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useStore } from "../../../stores";
import { FilterActivities } from "../filter";
import { ActivityRow } from "./activity-row";

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
    value: "/cosmos.authz.v1beta1.MsgExec",
    label: "Contract Interaction",
  },
  {
    value: "/cosmwasm.wasm.v1.MsgExecuteContract",
    label: "Contract Execution",
  },
  {
    value: "/cosmos.authz.v1beta1.MsgRevoke",
    label: "Contract Msg Revoke",
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
        <React.Fragment>
          <br />
          <span style={{ color: "#808da0" }}>Loading Activities...</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <br />
          No activity available right now
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
