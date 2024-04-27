import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { View, Text, Button, ViewStyle } from "react-native";
import { fetchTransactions } from "../../../graphQL/activity-api";
import moment from "moment";
import { useStore } from "stores/index";
import { useStyle } from "styles/index";
import { CardDivider } from "components/card";
import { FilterItem } from "screens/activity";
import { activityFilterOptions, ActivityFilterView } from "./activity-filter";
import { ActivityRow } from "./activity-row";
import { NoActivityView } from "./no-activity-view";

const processFilters = (filters: string[]) => {
  let result: any[] = [];
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
export const ActivityNativeTab: FunctionComponent<{
  latestBlock: any;
  isOpenModal: boolean;
  setIsOpenModal: any;
}> = ({ latestBlock, isOpenModal, setIsOpenModal }) => {
  const style = useStyle();
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

  const [_date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [fetchedData, setFetchedData] = useState<any>();

  const [pageInfo, setPageInfo] = useState<any>();
  const [nodes, setNodes] = useState({});
  const [filters, setFilters] = useState<FilterItem[]>(activityFilterOptions);

  const filter = useCallback(
    () =>
      filters
        .filter((filter) => filter.isSelected)
        .map((option) => option.value),
    [filters]
  )();

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
  }, []);

  useEffect(() => {
    fetchNodes("");
  }, [latestBlock, filters]);

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
    setLoadingRequest(true);
    fetchNodes(pageInfo.endCursor);
  };

  const handleFilterChange = (selectedFilters: FilterItem[]) => {
    setPageInfo(undefined);
    setNodes({});
    setFilters(selectedFilters);
    setIsOpenModal(false);
  };

  const renderNodes = (
    nodes: { [s: string]: unknown } | ArrayLike<unknown>
  ) => {
    const renderedNodes: JSX.Element[] = [];
    Object.values(nodes).forEach(async (node: any, index) => {
      const currentDate = moment(node.block.timestamp)
        .utc()
        .format("MMMM DD, hh:mm A");
      const previousNode: any =
        index > 0 ? Object.values(nodes)[index - 1] : null;
      const previousDate = previousNode
        ? moment(previousNode.block.timestamp).utc().format("ddd, DD MMM YYYY")
        : null;
      const shouldDisplayDate = currentDate !== previousDate;

      renderedNodes.push(
        <React.Fragment key={index}>
          {!shouldDisplayDate && (
            <View style={style.flatten(["height-1"]) as ViewStyle} />
          )}
          {shouldDisplayDate && (
            <Text
              style={
                style.flatten([
                  "color-gray-300",
                  "margin-left-16",
                  "h7",
                  "margin-bottom-12",
                ]) as ViewStyle
              }
            >
              {currentDate}
            </Text>
          )}
          <ActivityRow setDate={setDate} node={node} />
          <View style={style.flatten(["margin-top-10"]) as ViewStyle}>
            <CardDivider
              style={style.flatten(["margin-bottom-18"]) as ViewStyle}
            />
          </View>
        </React.Fragment>
      );
    });
    return renderedNodes;
  };

  return (
    <React.Fragment>
      {Object.values(nodes).filter((node: any) =>
        processFilters(filter).includes(
          node.transaction.messages.nodes[0].typeUrl
        )
      ).length > 0 ? (
        <React.Fragment>
          {renderNodes(nodes)}
          {pageInfo?.hasNextPage && (
            <Button
              disabled={!pageInfo?.hasNextPage || loadingRequest}
              onPress={handleClick}
              title="Load"
            >
              Load more{""}
              {loadingRequest && (
                <Text style={style.flatten(["text-center"]) as ViewStyle}>
                  load
                </Text>
              )}
            </Button>
          )}
        </React.Fragment>
      ) : isLoading ? (
        <Text
          style={
            style.flatten(["color-white", "text-center", "h7"]) as ViewStyle
          }
        >
          Loading Activities...
        </Text>
      ) : (
        <NoActivityView />
      )}
      <ActivityFilterView
        isOpen={isOpenModal}
        filters={filters}
        handleFilterChange={handleFilterChange}
        close={() => setIsOpenModal(false)}
      />
    </React.Fragment>
  );
};
