import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useStore } from "../../../stores";
import { FilterDropdown, FilterActivities } from "../filter";
import { ActivityRow } from "./activity-row";
import { NoActivity } from "../no-activity";
import { govOptions } from "../utils";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../../../config.ui.var";
import { UnsupportedNetwork } from "../unsupported-network";
import { observer } from "mobx-react-lite";

export const GovProposalsTab: FunctionComponent<{ latestBlock: any }> =
  observer(({}) => {
    const { chainStore, analyticsStore, accountStore, activityStore } =
      useStore();
    const current = chainStore.current;
    const accountInfo = accountStore.getAccount(current.chainId);
    // const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [loadingRequest, setLoadingRequest] = useState(false);
    // const [nodes, setNodes] = useState<any>({});
    const [pageInfo, setPageInfo] = useState<any>();
    const [filter, setFilter] = useState<string[]>(
      govOptions.map((option) => option.value)
    );
    const [isSelectAll, setIsSelectAll] = useState(true);
    const [isSaveChangesButtonDisabled, setIsSaveChangesButtonDisabled] =
      useState(true);
    // const [isError, setIsError] = useState(false);

    const proposalNodes = activityStore.sortedNodesProposals;

    const accountOrChainChanged =
      activityStore.getAddress !== accountInfo.bech32Address ||
      activityStore.getChainId !== current.chainId;

    useEffect(() => {
      if (accountOrChainChanged) {
        activityStore.setAddress(accountInfo.bech32Address);
        activityStore.setChainId(current.chainId);
      }

      //accountInit is required because in case of a reload, this.proposalNodes becomes empty and should be updated with KVstore's saved nodes
      if (accountInfo.bech32Address !== "") {
        activityStore.accountInit();
      }
    }, [
      accountInfo.bech32Address,
      current.chainId,
      accountOrChainChanged,
      activityStore,
    ]);

    // const fetchNodes = async (cursor: any) => {
    //   setIsLoading(true);
    //   try {
    //     const fetchedData = await fetchGovProposalTransactions(
    //       current.chainId,
    //       cursor,
    //       accountInfo.bech32Address,
    //       filter
    //     );
    //     if (fetchedData) {
    //       const nodeMap: any = {};
    //       fetchedData.nodes.map((node: any) => {
    //         nodeMap[node.id] = node;
    //       });
    //       setPageInfo(fetchedData.pageInfo);
    //       setNodes({ ...nodes, ...nodeMap });
    //     }
    //   } catch (error) {
    //     setIsError(true);
    //   }

    //   setIsLoading(false);
    // };

    // useEffect(() => {
    //   fetchNodes("");
    // }, []);

    // useEffect(() => {
    //   fetchNodes("");
    // }, [filter, latestBlock]);

    const handleClick = async () => {
      analyticsStore.logEvent("activity_transactions_click", {
        pageName: "Transaction Tab",
      });
      setLoadingRequest(true);
      // await fetchNodes(pageInfo.endCursor);
      setLoadingRequest(false);
    };

    const handleFilterChange = (selectedFilter: string[]) => {
      setPageInfo(undefined);
      // setNodes({});
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
        setIsSelectAll(filter.length === govOptions.length);
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
      setFilter(govOptions.map((option) => option.value));
      setIsSaveChangesButtonDisabled(false);
    };

    const handleSaveChanges = () => {
      setIsSaveChangesButtonDisabled(true);
      handleFilterChange(filter);
      // fetchNodes(pageInfo.endCursor);
      setIsOpen(false);
    };

    return (
      <React.Fragment>
        <FilterDropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          options={govOptions}
          selectedFilter={filter}
          handleCheckboxChange={handleCheckboxChange}
          handleSaveChanges={handleSaveChanges}
          isSelectAll={isSelectAll}
          handleSelectClicks={handleSelectClicks}
          handleDeselectClicks={handleDeselectClicks}
          isSaveChangesButtonDisabled={isSaveChangesButtonDisabled}
        />
        <FilterActivities
          onFilterChange={handleFilterChange}
          options={govOptions}
          selectedFilter={filter}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
        {current.chainId === CHAIN_ID_FETCHHUB ||
        current.chainId === CHAIN_ID_DORADO ||
        current.chainId === "test" ? (
          // isError ? (
          //   <ErrorActivity />
          // ) :
          proposalNodes.length > 0 &&
          proposalNodes.filter((node: any) => filter.includes(node.option))
            .length > 0 ? (
            <React.Fragment>
              {proposalNodes
                .filter((node: any) => filter.includes(node.option))
                .map((node: any, index: any) => (
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
                  {loadingRequest && (
                    <i className="fas fa-spinner fa-spin ml-2" />
                  )}
                </Button>
              )}
            </React.Fragment>
          ) : (
            // : isLoading ? (
            //   <div className={style["activityMessage"]}>
            //     Loading Activities...
            //   </div>
            // )
            <NoActivity />
          )
        ) : (
          <UnsupportedNetwork chainID={current.chainName} />
        )}

        {filter.length === 0 && <NoActivity />}
      </React.Fragment>
    );
  });
