import { fetchLatestBlock, fetchTransactions } from "@graphQL/activity-api";
import { HeaderLayout } from "@layouts/index";
import { getActivityIcon, getStatusIcon } from "@utils/activity-utils";
import { formatActivityHash } from "@utils/format";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { Button } from "reactstrap";

export const ActivityPage: FunctionComponent = observer(() => {
  const history = useHistory();
  const intl = useIntl();
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const [latestBlock, setLatestBlock] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [blockIsLoading, setBlockIsLoading] = useState(true);
  const [nodes, setNodes] = useState<any>();
  const [pageInfo, setPageInfo] = useState<any>();
  useEffect(() => {
    const initialize = async () => {
      setBlockIsLoading(true);
      const block = await fetchLatestBlock(current.chainId);
      if (latestBlock != block) setLatestBlock(block);
      setBlockIsLoading(false);
    };
    setInterval(() => initialize(), 5000);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      const newActivities = await fetchTransactions(
        current.chainId,
        "",
        accountInfo.bech32Address
      );
      if (!pageInfo) setPageInfo(newActivities.pageInfo);
      const nodeMap: any = {};
      newActivities.nodes.map((node: any) => {
        nodeMap[node.id] = node;
      });
      setNodes({ ...nodes, ...nodeMap });
      setIsLoading(false);
    };
    fetchActivities();
  }, [accountInfo.bech32Address, latestBlock]);

  const handleClick = async () => {
    setLoadingRequest(true);
    const newActivities = await fetchTransactions(
      current.chainId,
      pageInfo.endCursor,
      accountInfo.bech32Address
    );
    setPageInfo(newActivities.pageInfo);
    const nodeMap: any = {};
    newActivities.nodes.map((node: any) => {
      nodeMap[node.id] = node;
    });
    setNodes({ ...nodes, ...nodeMap });
    setLoadingRequest(false);
  };

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "main.menu.activity",
      })}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.container}>
        <div className={style.title}>
          <FormattedMessage id="main.menu.activity" />
          {/* <a href="#">All activity</a> */}
        </div>
        <div className={style.activityRow}>
          Latest Block: {latestBlock}{" "}
          {blockIsLoading && <i className="fas fa-spinner fa-spin ml-2" />}
        </div>

        {nodes ? (
          <React.Fragment>
            {Object.values(nodes).map((node, index) => (
              <ActivityRow node={node} key={index} />
            ))}
            <Button
              outline
              color="primary"
              size="sm"
              disabled={!pageInfo?.hasNextPage || loadingRequest}
              onClick={handleClick}
            >
              Load more{" "}
              {loadingRequest && <i className="fas fa-spinner fa-spin ml-2" />}
            </Button>
          </React.Fragment>
        ) : isLoading ? (
          "Loading Activities "
        ) : (
          "No Data found"
        )}
      </div>
    </HeaderLayout>
  );
});

export const ActivityRow = ({ node }: { node: any }) => {
  return (
    <div className={style.activityRow}>
      <div className={style.activityCol} style={{ width: "7%" }}>
        <img
          src={getActivityIcon(node.messages.nodes[0].typeUrl)}
          alt={node.messages.nodes[0].typeUrl}
        />
      </div>
      <div className={style.activityCol} style={{ width: "33%" }}>
        {formatActivityHash(node.id)}
      </div>
      <div className={style.activityCol} style={{ width: "53%" }}>
        {formatActivityHash(node.id)}
      </div>
      <div className={style.activityCol} style={{ width: "7%" }}>
        <img src={getStatusIcon(node.status)} alt={node.status} />
      </div>
    </div>
  );
};
