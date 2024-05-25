import React, { useEffect, useState } from "react";
import { fetchTransactions } from "@graphQL/activity-api";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { FilterDropdown, FilterActivities } from "../filter";
import { ActivityRow } from "./activity-row";
import style from "../style.module.scss";
import styles from "./style.module.scss";

import { NoActivity } from "../no-activity";
import { ButtonV2 } from "@components-v2/buttons/button";
import moment from "moment";
import { UnsupportedNetwork } from "../unsupported-network";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../../../config.ui.var";
import { ErrorActivity } from "../error-activity";
const options = [
  {
    icon: require("@assets/svg/wireframe/arrow-down.svg"),
    value: "/cosmos.bank.v1beta1.MsgSend",
    label: "Funds transfers",
  },
  {
    icon: require("@assets/svg/wireframe/stake.svg"),
    value: "/cosmos.staking.v1beta1.MsgDelegate",
    label: "Staked Funds",
  },
  {
    icon: require("@assets/svg/wireframe/hand-holding-seedling.svg"),
    value: "/cosmos.staking.v1beta1.MsgUndelegate",
    label: "Unstaked Funds",
  },
  {
    icon: require("@assets/svg/wireframe/rename.svg"),
    value: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    label: "Redelegate Funds",
  },
  {
    icon: require("@assets/svg/wireframe/contract-integration-transparent.svg"),
    value:
      "/cosmos.authz.v1beta1.MsgExec,/cosmwasm.wasm.v1.MsgExecuteContract,/cosmos.authz.v1beta1.MsgRevoke",
    label: "Contract Interactions",
  },
  {
    icon: require("@assets/svg/wireframe/gem.svg"),
    value: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    label: "Claim Rewards",
  },
  {
    icon: require("@assets/svg/wireframe/arrow-down-up-across-line.svg"),
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
      func(...args);
    }, timeout);
  };
}

export const NativeTab = observer(({ latestBlock }: { latestBlock: any }) => {
  const { chainStore, accountStore, analyticsStore, activityStore } =
    useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const [isOpen, setIsOpen] = useState(false);
  const [_date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(true);
  const [isSaveChangesButtonDisabled, setIsSaveChangesButtonDisabled] =
    useState(true);
  const [filter, setFilter] = useState<string[]>(
    options.map((option) => option.value)
  );

  const [pageRender, setPageRender] = useState(true);

  const [isError, setIsError] = useState(false);

  const accountOrChainChanged =
    activityStore.getAddress !== accountInfo.bech32Address ||
    activityStore.getChainId !== current.chainId;

  const fetchNodes = debounce(
    async (
      after: any,
      before: any,
      append: boolean,
      isFilter: boolean,
      isLoadMore: boolean
    ) => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions(
          current.chainId,
          accountInfo.bech32Address,
          filter,
          after,
          before
        );

        const nodeMap: any = {};

        Object.values(data?.nodes).map((node: any) => {
          nodeMap[node.id] = node;
        });

        activityStore.updateNodes({ ...nodeMap }, append, isLoadMore);

        if (!activityStore.getPageInfo || Object.keys(nodeMap).length > 0)
          activityStore.setPageInfo(data?.pageInfo);

        if (isFilter) {
          activityStore.setPageInfo(undefined);
        }
      } catch (error) {
        setIsError(true);
      }

      setLoadingRequest(false);
      setIsLoading(false);
    },
    1000
  );

  useEffect(() => {
    if (accountOrChainChanged || !activityStore.getPageInfo) {
      fetchNodes("", "", false, false, false);
    } else {
      fetchNodes("", activityStore.getPageInfo.startCursor, true, false, false);
    }
  }, [latestBlock]);

  useEffect(() => {
    if (pageRender) {
      setPageRender(false);
    } else {
      fetchNodes("", "", false, true, false);
    }
  }, [filter]);

  useEffect(() => {
    if (accountOrChainChanged) {
      activityStore.updateNodes({});
      activityStore.setPageInfo(undefined);
      activityStore.setAddress(accountInfo.bech32Address);
      activityStore.setChainId(current.chainId);
    }
  }, []);

  const handleClick = () => {
    analyticsStore.logEvent("activity_transactions_click", {
      pageName: "Transaction Tab",
    });
    setLoadingRequest(true);
    fetchNodes(activityStore.getPageInfo.endCursor, "", true, false, true);
  };

  const handleFilterChange = (selectedFilter: string[]) => {
    activityStore.setPageInfo(undefined);
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
  const renderNodes = (nodes: any) => {
    const renderedNodes: JSX.Element[] = [];
    Object.values(nodes).forEach(async (node: any, index) => {
      const currentDate = moment(node.block.timestamp)
        .utc()
        .format("ddd, DD MMM YYYY");
      const previousNode: any =
        index > 0 ? Object.values(nodes)[index - 1] : null;
      const previousDate = previousNode
        ? moment(previousNode.block.timestamp).utc().format("ddd, DD MMM YYYY")
        : null;
      const shouldDisplayDate = currentDate !== previousDate;
      renderedNodes.push(
        <React.Fragment key={index}>
          {!shouldDisplayDate && <div className={styles["hr"]} />}
          {shouldDisplayDate && (
            <div
              className={styles["rowSubtitle"]}
              style={{ marginTop: "12px" }}
            >
              {currentDate}
            </div>
          )}
          <ActivityRow setDate={setDate} node={node} />
        </React.Fragment>
      );
    });
    return renderedNodes;
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

      {current.chainId === CHAIN_ID_FETCHHUB ||
      current.chainId === CHAIN_ID_DORADO ? (
        isError ? (
          <ErrorActivity />
        ) : Object.keys(activityStore.getNodes).length > 0 &&
          Object.values(activityStore.getNodes).filter((node: any) =>
            processFilters(filter).includes(
              node.transaction.messages.nodes[0].typeUrl
            )
          ).length > 0 ? (
          <React.Fragment>
            {renderNodes(activityStore.getNodes)}
            {activityStore.getPageInfo?.hasNextPage && (
              <ButtonV2
                text={
                  loadingRequest ? (
                    <i className="fas fa-spinner fa-spin ml-2" />
                  ) : (
                    "Load more"
                  )
                }
                disabled={
                  !activityStore.getPageInfo?.hasNextPage ||
                  loadingRequest === true
                }
                onClick={handleClick}
                styleProps={{ width: "326px" }}
              />
            )}
          </React.Fragment>
        ) : isLoading ? (
          <div className={style["activityMessage"]}>Loading Activities...</div>
        ) : (
          <NoActivity />
        )
      ) : (
        <UnsupportedNetwork chainID={current.chainName} />
      )}
    </React.Fragment>
  );
});
