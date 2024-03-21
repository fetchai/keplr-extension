import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate, useParams } from "react-router";
import style from "./style.module.scss";
import { NotificationOrg } from "@components/notification-org/notification-org";
import {
  fetchFollowedOrganisations,
  fetchOrganisations,
  followOrganisation,
  unfollowOrganisation,
} from "@utils/fetch-notification";
import { useStore } from "../../../../../stores";
import {
  NotificationSetup,
  NotyphiOrganisation,
  NotyphiOrganisations,
} from "@notificationTypes";
import { notificationsDetails, setNotifications } from "@chatStore/user-slice";
import { store } from "@chatStore/index";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { HeaderLayout } from "@layouts-v2/header-layout";
import { ButtonV2 } from "@components-v2/buttons/button";
import { SearchBar } from "@components-v2/search-bar";
const pageOptions = {
  edit: "edit",
  add: "add",
};

export const NotificationOrganizations: FunctionComponent = observer(() => {
  // Getting page type edit or add
  const { type } = useParams<{ type?: string }>();

  const navigate = useNavigate();
  // Extracting org id from url
  const newOrg = useLocation().search.split("?")[1]?.split("&");

  const { chainStore, accountStore, analyticsStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

  const [inputVal, setInputVal] = useState("");

  const [orgList, setOrgList] = useState<NotyphiOrganisation[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<NotyphiOrganisation[]>([]);

  const notificationInfo: NotificationSetup = useSelector(notificationsDetails);

  const [isLoading, setIsLoading] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const followUnfollowObj = useRef<NotyphiOrganisations>({});

  useEffect(() => {
    fetchOrganisations().then((res) => {
      setIsLoading(false);
      setOrgList(res.items);

      if (type === pageOptions.edit) {
        const organisations = Object.values(notificationInfo.organisations);
        if (organisations.length == 0) {
          /// Updating the pre-selected orgs.
          fetchFollowedOrganisations(accountInfo.bech32Address).then(
            (followOrganisationList: NotyphiOrganisation[]) => {
              setSelectedOrg(followOrganisationList);

              /// Updating followed orgs in redux
              store.dispatch(
                setNotifications({
                  organisations: followOrganisationList,
                })
              );
            }
          );
        } else {
          setSelectedOrg(organisations);
        }
      }
    });
  }, [accountInfo.bech32Address, type]);

  const handleCheck = (isChecked: boolean, index: number) => {
    const item = orgList[index];

    if (isChecked) {
      setSelectedOrg([...selectedOrg, item]);
      followUnfollowObj.current[item.id] = {
        ...item,
        follow: isChecked,
      };
    } else {
      setSelectedOrg(selectedOrg.filter((element) => element.id != item.id));

      /// Unfollow is available in edit section only
      if (
        type === pageOptions.edit &&
        Object.values(notificationInfo.organisations).find(
          (element) => element.id === item.id
        )
      ) {
        followUnfollowObj.current[item.id] = {
          ...item,
          follow: isChecked,
        };
      } else {
        delete followUnfollowObj.current[item.id];
      }
    }
  };

  const handleNextPage = async () => {
    setIsBtnLoading(true);
    const allPromises: any = [];

    Object.values(followUnfollowObj.current).map((element) => {
      if (element.follow) {
        allPromises.push(
          followOrganisation(accountInfo.bech32Address, element.id)
        );
      } else {
        allPromises.push(
          unfollowOrganisation(accountInfo.bech32Address, element.id)
        );
      }
    });

    Promise.allSettled(allPromises).then((_) => {
      store.dispatch(
        setNotifications({
          organisations: selectedOrg,
        })
      );

      if (type === pageOptions.edit) {
        analyticsStore.logEvent("update_notification_preferences_click", {
          pageName: "Organisations",
        });
        navigate(-1);
      } else {
        navigate("/notification/topics/add");
      }
    });
  };
  return (
    <HeaderLayout
      showTopMenu={true}
      smallTitle={true}
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"Organisations"}
      showBottomMenu={false}
      onBackButton={() => {
        analyticsStore.logEvent("back_click", {
          pageName: "Organisations",
        });
        navigate(-1);
      }}
    >
      <SearchBar
        onSearchTermChange={setInputVal}
        searchTerm={inputVal}
        valuesArray={orgList}
        renderResult={(orgList, i) => {
          <div className={style["listContainer"]}>
            {isLoading ? (
              <div className={style["isLoading"]}>
                <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
              </div>
            ) : (
              <React.Fragment>
                {!orgList.length && (
                  <div key={i} className={style["resultText"]}>
                    <p>
                      <FormattedMessage id="search.no-result-found" />
                      {inputVal !== "" && (
                        <React.Fragment>
                          <br />
                          <FormattedMessage id="search.refine.search" />
                        </React.Fragment>
                      )}
                    </p>
                  </div>
                )}

                {orgList.map((elem: NotyphiOrganisation, index: number) => {
                  return (
                    <NotificationOrg
                      handleCheck={(isChecked) => handleCheck(isChecked, index)}
                      isChecked={
                        !!selectedOrg.find((item) => item.id === elem.id)
                      }
                      elem={elem}
                      key={elem.id}
                      isNew={newOrg && newOrg.indexOf(elem.id) != -1}
                    />
                  );
                })}
              </React.Fragment>
            )}
          </div>;
        }}
      />

      <div className={style["buttonContainer"]}>
        <p>{selectedOrg.length} selected</p>
        <ButtonV2
          text=""
          disabled={
            selectedOrg.length === 0 ||
            Object.keys(followUnfollowObj.current).length === 0
          }
          onClick={handleNextPage}
        >
          {isBtnLoading ? (
            <i className="fa fa-spinner fa-spin fa-fw" />
          ) : type === pageOptions.edit ? (
            "Save"
          ) : (
            "Next"
          )}
        </ButtonV2>
      </div>
    </HeaderLayout>
  );
});
