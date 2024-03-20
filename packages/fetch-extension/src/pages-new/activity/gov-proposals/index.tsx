import { fetchGovProposalTransactions } from "@graphQL/activity-api";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useStore } from "../../../stores";
import { FilterActivities } from "../filter";
import { ActivityRow } from "./activity-row";
import style from "../style.module.scss";
import { NoActivity } from "../no-activity";
import { ButtonV2 } from "@components-v2/buttons/button";
import { Card } from "@components-v2/card";
import { Dropdown } from "@components-v2/dropdown";
const options = [
  { value: "YES", label: "Voted Yes" },
  { value: "NO", label: "Voted No" },
  { value: "ABSTAIN", label: "Voted Abstain" },
  { value: "NO_WITH_VETO", label: "Voted No With Veto" },
];

export const GovProposalsTab = ({ latestBlock }: { latestBlock: any }) => {
  const { chainStore, accountStore, analyticsStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [loadingRequest, setLoadingRequest] = useState(false);
  const [nodes, setNodes] = useState<any>({});
  const [pageInfo, setPageInfo] = useState<any>();
  const [filter, setFilter] = useState<string[]>(
    options.map((option) => option.value)
  );
  const [isSelectAll, setIsSelectAll] = useState(true);
  const [isSaveChangesButtonDisabled, setIsSaveChangesButtonDisabled] =
    useState(true);

  const fetchNodes = async (cursor: any) => {
    setIsLoading(true);
    const fetchedData = await fetchGovProposalTransactions(
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
    fetchNodes("");
  }, []);

  useEffect(() => {
    fetchNodes("");
  }, [filter, latestBlock]);

  const handleClick = async () => {
    analyticsStore.logEvent("activity_transactions_click", {
      pageName: "Transaction Tab",
    });
    setLoadingRequest(true);
    await fetchNodes(pageInfo.endCursor);
    setLoadingRequest(false);
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
    fetchNodes(pageInfo.endCursor);
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"Filter"}
        closeClicked={() => {
          setIsOpen(false);
        }}
        styleProp={{ position: "block" }}
      >
        <div className={style["select"]}>
          {!isSelectAll ? (
            <div className={style["selectAll"]} onClick={handleSelectClicks}>
              Select all
            </div>
          ) : (
            <div className={style["selectAll"]} onClick={handleDeselectClicks}>
              Unselect all
            </div>
          )}
        </div>
        <div className={style["dropdownMenu"]}>
          {options.map((option) => (
            <label key={option.value} className={style["dropdownItem"]}>
              <Card
                style={
                  filter.includes(option.value)
                    ? {
                        width: "333px",
                        background: "var(--Indigo---Fetch, #5F38FB)",
                      }
                    : { width: "333px", background: "rgba(255,255,255,0.1)" }
                }
                rightContent={
                  <input
                    type="checkbox"
                    className="mx-2"
                    value={option.value}
                    checked={filter.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                  />
                }
                heading={option.label}
              />
            </label>
          ))}
        </div>
        <ButtonV2
          disabled={isSaveChangesButtonDisabled}
          onClick={handleSaveChanges}
          text="Save Changes"
        />
      </Dropdown>
      <FilterActivities
        onFilterChange={handleFilterChange}
        options={options}
        selectedFilter={filter}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {Object.keys(nodes).length > 0 ? (
        <React.Fragment>
          {Object.values(nodes)
            .filter((node: any) => filter.includes(node.option))
            .map((node, index) => (
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
        <div className={style["activityMessage"]}>Loading Activities...</div>
      ) : (
        <NoActivity />
      )}
      {filter.length === 0 && !isLoading && <NoActivity />}
    </React.Fragment>
  );
};
