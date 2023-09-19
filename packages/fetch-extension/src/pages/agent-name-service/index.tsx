import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { HeaderLayout } from "../../new-layouts";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { getAllDomainsbyAddress } from "../../name-service/ans-api";

interface FetchedDomain {
  domain_name: string;
  permissions: string;
}

export const AgentNameService = observer(() => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);
  const [fetchedDomains, setFetchedDomains] = useState<FetchedDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await getAllDomainsbyAddress(
          current.chainId,
          account.bech32Address
        );
        setFetchedDomains(
          response.filter((domain: any) => domain.permissions !== "none")
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [account.bech32Address, current.chainId]);

  // Filter out domains with "none" permissions
  const filteredDomains = fetchedDomains.filter(
    (domain) => domain.permissions !== "none"
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
      {state?.disclaimer && (
        <div className={style["beneficiaryHelp"]}>
          &#128161; {state.disclaimer}
        </div>
      )}
      <div className={style["allDomains"]}>
        {isLoading ? (
          <div className={style["loader"]}>
            Loading domains <i className="fas fa-spinner fa-spin ml-2" />
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className={style["loader"]}>No Domains Available</div>
        ) : (
          filteredDomains.map((domain, index) => (
            <Link
              to={`/agent-name-service/domain-details/${domain.domain_name}/owner`}
              className={style["domainCard"]}
              key={index}
            >
              <div className={style["domainDetails"]}>
                <div>{domain.domain_name}</div>
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
