import React, { FunctionComponent, useEffect, useState } from "react";
import { View, ViewStyle, FlatList, ActivityIndicator } from "react-native";
import { useStore } from "stores/index";
import { useStyle } from "styles/index";
import { CardDivider } from "components/card";
import { NoActivityView } from "screens/activity/activity-transaction/no-activity-view";
import { observer } from "mobx-react-lite";
import { GovActivityRow } from "screens/activity/gov-proposals/activity-row";
import { govOptions, processFilters } from "screens/activity/utils";
import { FilterItem, FilterView } from "components/filter";
import { fetchGovProposalTransactions } from "../../../graphQL/activity-api";
import { isFeatureAvailable } from "utils/index";

export const GovProposalsTab: FunctionComponent<{
  isOpenModal: boolean;
  setIsOpenModal: any;
  latestBlock: any;
  nodes: any;
  setNodes: any;
  govFilters: FilterItem[];
  setGovFilters: any;
}> = observer(
  ({
    isOpenModal,
    setIsOpenModal,
    latestBlock,
    nodes,
    setNodes,
    govFilters,
    setGovFilters,
  }) => {
    const style = useStyle();
    const { chainStore, accountStore, queriesStore } = useStore();
    const current = chainStore.current;
    const accountInfo = accountStore.getAccount(current.chainId);

    const queries = queriesStore.get(chainStore.current.chainId);
    const proposalLoading = queries.cosmos.queryGovernance.isFetching;

    const [isLoading, setIsLoading] = useState(true);

    const [pageInfo, setPageInfo] = useState<any>();
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [fetchedData, setFetchedData] = useState<any>();

    const fetchNodes = async (cursor: any) => {
      setIsLoading(true);
      try {
        const fetchedData = await fetchGovProposalTransactions(
          current.chainId,
          cursor,
          accountInfo.bech32Address,
          govFilters.map((option) => option.value)
        );
        setFetchedData(fetchedData?.nodes);

        if (fetchedData) {
          const nodeMap: any = {};
          fetchedData.nodes.map((node: any) => {
            nodeMap[node.id] = node;
          });

          setPageInfo(fetchedData.pageInfo);
          setNodes({ ...nodes, ...nodeMap });
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchNodes("");
    }, []);

    useEffect(() => {
      fetchNodes("");
    }, [govFilters, latestBlock]);

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

    const handleLoadMore = () => {
      if (!loadingRequest) {
        setLoadingRequest(true);
        fetchNodes(pageInfo?.endCursor);
      }
    };

    const handleFilterChange = (selectedFilters: FilterItem[]) => {
      setGovFilters(selectedFilters);
      fetchNodes(pageInfo?.endCursor);
      setIsOpenModal(false);
    };

    const renderList = (nodes: [s: string] | unknown[]) => {
      return (
        <FlatList
          data={nodes}
          scrollEnabled={false}
          renderItem={({ item, index }: { item: any; index: number }) => {
            const isLastPos = index == nodes.length - 1;
            return (
              <React.Fragment key={index}>
                <GovActivityRow node={item} />
                {isLastPos && (
                  <View style={style.get("height-page-pad") as ViewStyle} />
                )}
              </React.Fragment>
            );
          }}
          keyExtractor={(_item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <CardDivider style={style.flatten(["margin-y-16"]) as ViewStyle} />
          )}
          onEndReached={() => handleLoadMore()}
        />
      );
    };

    const data = Object.values(nodes).filter((node: any) =>
      processFilters(govFilters).includes(node.option)
    );

    return (
      <React.Fragment>
        {isFeatureAvailable(current.chainId) &&
        data.length > 0 &&
        Object.values(nodes).length > 0 &&
        !proposalLoading ? (
          renderList(data)
        ) : Object.values(nodes).length == 0 && isLoading ? (
          <ActivityIndicator
            size="large"
            color={style.get("color-white").color}
          />
        ) : (
          <NoActivityView />
        )}
        <FilterView
          isOpen={isOpenModal}
          filters={govFilters}
          handleFilterChange={handleFilterChange}
          close={() => setIsOpenModal(false)}
          options={govOptions}
        />
      </React.Fragment>
    );
  }
);
