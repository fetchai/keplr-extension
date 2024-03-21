import { fetchTransactions } from "@graphQL/activity-api";
import React, { useEffect, useState } from "react";
import { useStore } from "../../../stores";
import { FilterDropdown, FilterActivities } from "../filter";
import { ActivityRow } from "./activity-row";
import style from "../style.module.scss";
import { NoActivity } from "../no-activity";
import { ButtonV2 } from "@components-v2/buttons/button";

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
    value: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    label: "Redelegate Funds",
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

const processFilters = (filters: string[]) => {
  let result: string[] = [];
  filters.map((value) => {
    result = result.concat(value.split(","));
  });
  return result;
};

function debounce(func: any, timeout = 500) {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, timeout);
  };
}

export const NativeTab = ({ latestBlock }: { latestBlock: any }) => {
  const { chainStore, accountStore, analyticsStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [fetchedData, setFetchedData] = useState<any>();
  const [nodes, setNodes] = useState<any>({});
  const [isSelectAll, setIsSelectAll] = useState(true);
  const [isSaveChangesButtonDisabled, setIsSaveChangesButtonDisabled] =
    useState(true);
  const [pageInfo, setPageInfo] = useState<any>();
  const [filter, setFilter] = useState<string[]>(
    options.map((option) => option.value)
  );

  const fetchNodes = debounce(async (cursor: any) => {
    setIsLoading(true);
    const data = await fetchTransactions(
      current.chainId,
      cursor,
      accountInfo.bech32Address,
      processFilters(filter)
    );
    setFetchedData(data?.nodes);
    if (!pageInfo || cursor != "") setPageInfo(data.pageInfo);
    setIsLoading(false);
  }, 1000);

  useEffect(() => {
    fetchNodes("");
  }, [filter, latestBlock]);

  useEffect(() => {
    if (fetchedData) {
      const nodeMap: any = {};
      fetchedData.map((node: any) => {
        nodeMap[node.id] = node;
      });
      setNodes({ ...nodes, ...nodeMap });
      setIsLoading(false);
      setLoadingRequest(false);
    }
  }, [fetchedData]);

  const handleClick = () => {
    analyticsStore.logEvent("activity_transactions_click", {
      pageName: "Transaction Tab",
    });
    setLoadingRequest(true);
    fetchNodes(pageInfo.endCursor);
  };

  const handleFilterChange = (selectedFilter: string[]) => {
    setPageInfo(undefined);
    setNodes({});
    setFilter(selectedFilter);
    analyticsStore.logEvent("activity_filter_click", {
      pageName: "Transaction Tab",
    });
  };

  const handleCheckboxChange = (value: string) => {
    const newFilters = filter.slice();
    if (newFilters.includes(value)) {
      setIsSelectAll(false);
      setFilter(newFilters.filter((item) => item !== value));
    } else {
      setFilter([...newFilters, value]);
      setIsSelectAll(filter.length === options.length);
    }
    setIsSaveChangesButtonDisabled(false);
  };

  const handleDeselectClicks = () => {
    setIsSelectAll(false);
    setFilter([]);
    setIsSaveChangesButtonDisabled(false);
  };

  const handleSelectClicks = () => {
    setIsSelectAll(true);
    setFilter(options.map((option) => option.value));
    setIsSaveChangesButtonDisabled(false);
  };

  const handleSaveChanges = () => {
    setIsSaveChangesButtonDisabled(true);
    handleFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <FilterDropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        options={options}
        selectedFilter={filter}
        handleCheckboxChange={handleCheckboxChange}
        handleSaveChanges={handleSaveChanges}
        isSelectAll={isSelectAll}
        handleSelectClicks={handleSelectClicks}
        handleDeselectClicks={handleDeselectClicks}
        isSaveChangesButtonDisabled={isSaveChangesButtonDisabled}
      />
      <div className={style["filter"]}>
        <FilterActivities
          onFilterChange={handleFilterChange}
          options={options}
          selectedFilter={filter}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      </div>
      {Object.values(nodes).filter((node: any) =>
        processFilters(filter).includes(
          node.transaction.messages.nodes[0].typeUrl
        )
      ).length > 0 ? (
        <React.Fragment>
          {Object.values(nodes)
            .filter((node: any) =>
              processFilters(filter).includes(
                node.transaction.messages.nodes[0].typeUrl
              )
            )
            .map((node, index) => (
              <ActivityRow node={node} key={index} />
            ))}
          {pageInfo?.hasNextPage && (
            <ButtonV2
              disabled={!pageInfo?.hasNextPage || loadingRequest}
              onClick={handleClick}
              text=""
              styleProps={{ width: "326px" }}
            >
              Load more{" "}
              {loadingRequest && <i className="fas fa-spinner fa-spin ml-2" />}
            </ButtonV2>
          )}
        </React.Fragment>
      ) : isLoading ? (
        <div className={style["activityMessage"]}>Loading Activities...</div>
      ) : (
        <NoActivity />
      )}
    </React.Fragment>
  );
};
