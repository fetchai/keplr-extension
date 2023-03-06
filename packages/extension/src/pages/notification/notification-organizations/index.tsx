import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "reactstrap";
import { observer } from "mobx-react-lite";
import { HeaderLayout } from "@layouts/header-layout";
import { useHistory, useParams } from "react-router";
import newstyle from "./style.module.scss";
import { PageTitle } from "@components/page-title/page-title";
import { NotificationOrg } from "@components/notification-org/notification-org";
import {
  fetchFollowedOrganisations,
  fetchOrganisations,
  followOrganisation,
} from "@utils/fetch-notification";
import { useStore } from "../../../stores";
import { NotyphiOrganisation } from "@notificationTypes";
import { NotiSearchInput } from "@components/page-title/noti-search-input";

const pageOptions = {
  edit: "edit",
  add: "add",
};
export const NotificationOrganizations: FunctionComponent = observer(() => {
  const { type } = useParams<{ type?: string }>();
  const history = useHistory();
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

  const [inputVal, setInputVal] = useState("");
  const [mainOrgList, setMainOrgList] = useState<NotyphiOrganisation[]>([]);
  const [orgList, setOrgList] = useState<NotyphiOrganisation[]>([]);

  const [checkBoxState, setCheckBoxState] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingData, setIsSendingData] = useState(false);

  useEffect(() => {
    fetchOrganisations().then((res) => {
      setIsLoading(false);
      setMainOrgList(res.items);
      setOrgList(res.items);

      if (type === pageOptions.edit) {
        fetchFollowedOrganisations(accountInfo.bech32Address).then(
          (followOrganisationList: NotyphiOrganisation[]) => {
            const selectedArray: string[] = [];
            res.items.forEach((element: NotyphiOrganisation) => {
              const data = followOrganisationList.find(
                (item) => item.id === element.id
              );

              if (data) {
                selectedArray.push(element.id);
              }
            });
            setCheckBoxState(selectedArray);
          }
        );
      }
    });
  }, [accountInfo.bech32Address, type]);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    let arr = [...checkBoxState];
    if (arr.includes(e.target.id)) {
      arr = arr.filter((elem) => elem != e.target.id);
    } else {
      arr.push(e.target.id);
    }
    setCheckBoxState(arr);
  };

  const handleNextPage = async () => {
    setIsSendingData(true);
    const allPromises = [];

    for (let i = 0; i < checkBoxState.length; i++) {
      allPromises.push(
        followOrganisation(accountInfo.bech32Address, checkBoxState[i])
      );
    }

    /// Todo optimise the api call when no changes done by user in edit case
    Promise.allSettled(allPromises).then((_) => {
      if (type === pageOptions.edit) {
        history.goBack();
      } else {
        history.push({ pathname: "/notification/topics/add" });
      }
    });
  };

  const handleSearch = () => {
    const searchString = inputVal.trim();
    if (searchString.length == 0) {
      setOrgList(mainOrgList);
    } else {
      const filteredOrg: NotyphiOrganisation[] = mainOrgList.filter(
        (org: NotyphiOrganisation) =>
          org.name.toLowerCase().includes(searchString.toLowerCase())
      );
      setOrgList(filteredOrg);
    }
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"Organisations"}
      showBottomMenu={false}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <PageTitle headingValue="Select atleast one organization you want notifications from:" />

      <NotiSearchInput
        handleSearch={handleSearch}
        inputVal={inputVal}
        setInputVal={setInputVal}
      />

      <div className={newstyle.listContainer}>
        {isLoading ? (
          <div className={newstyle.isLoading}>
            <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
          </div>
        ) : (
          orgList.map((elem: NotyphiOrganisation) => (
            <NotificationOrg
              handleCheck={handleCheck}
              checkBoxState={checkBoxState}
              elem={elem}
              key={elem.id}
            />
          ))
        )}
      </div>
      <div className={newstyle.buttonContainer}>
        <p>{checkBoxState.length} selected</p>
        <Button
          className={newstyle.button}
          color="primary"
          disabled={checkBoxState.length == 0}
          onClick={handleNextPage}
        >
          {isSendingData ? (
            <i className="fa fa-spinner fa-spin fa-fw" />
          ) : type === pageOptions.edit ? (
            "Update Notification Preferences"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </HeaderLayout>
  );
});
