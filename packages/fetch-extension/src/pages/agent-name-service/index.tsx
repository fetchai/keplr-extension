import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ANS_CONFIG } from "../../config.ui.var";
import { HeaderLayout } from "../../new-layouts";
import { useStore } from "../../stores";
import style from "./style.module.scss";

export const AgentNameService = observer(() => {
  const navigate = useNavigate();
  const { chainStore, queriesStore } = useStore();
  const current = chainStore.current;
  const { queryPublicDomains } = queriesStore.get(current.chainId).ans;
  const { isFetching, publicDomains } = queryPublicDomains.getQueryContract(
    ANS_CONFIG[current.chainId].contractAddress
  );

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"Domains"}
      rightRenderer={
        <div className={style["rightRenderer"]}>
          <i
            className="fas fa-plus"
            onClick={() => navigate("/agent-name-service/register-new")}
          />
        </div>
      }
      onBackButton={() => {
        navigate("/");
      }}
      showBottomMenu={true}
    >
      <div className={style["allDomains"]}>
        {isFetching ? (
          <div className={style["loader"]}>
            Loading Agent Domains
            <i className="fas fa-spinner fa-spin ml-2" />
          </div>
        ) : publicDomains?.length === 0 ? (
          <div className={style["loader"]}>No Domains Available</div>
        ) : (
          publicDomains?.map((domain: string, index: any) => (
            <Link
              to={`/agent-name-service/domain-details/${domain}`}
              className={style["domainCard"]}
              key={index}
            >
              <div className={style["domainDetails"]}>
                <div>{domain}</div>
                <img
                  className={style["arrowIcon"]}
                  src={require("@assets/svg/arrow-right-outline.svg")}
                  alt=""
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </HeaderLayout>
  );
});
