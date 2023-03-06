import { NotiSearchInput } from "@components/page-title/noti-search-input";
import { PageTitle } from "@components/page-title/page-title";
import { Chip } from "@components/select-notifications/topic-chip";
import { HeaderLayout } from "@layouts/header-layout";
import { fetchTopics } from "@utils/fetch-notification";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button } from "reactstrap";
import style from "./style.module.scss";
const pageOptions = {
  edit: "edit",
  add: "add",
};
export const NotificationTopics: FunctionComponent = () => {
  const history = useHistory();
  const [inputVal, setInputVal] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicsList, setTopicsList] = useState<any[]>([]);
  const [mainTopicsList, setMainTopicsList] = useState<any[]>([]);

  const { type } = useParams<{ type?: string }>();

  const handleNextPage = () => {
    if (type === pageOptions.edit) {
      history.goBack();
      return;
    }

    history.push("/notification/review");
  };

  const handleSearch = () => {
    const searchString = inputVal.trim();
    const filteredTopics = mainTopicsList
      .map((topic: any) => topic)
      .filter((topic: any) =>
        topic.name.toLowerCase().includes(searchString.toLowerCase())
      );

    setTopicsList(filteredTopics);
  };

  useEffect(() => {
    fetchTopics().then((res) => {
      setTopicsList(res.items);
      setMainTopicsList(res.items);
    });
  }, []);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    let arr = [...selectedTopics];
    if (arr.includes(e.target.id)) {
      arr = arr.filter((elem) => elem != e.target.id);
    } else {
      arr.push(e.target.id);
    }
    setSelectedTopics(arr);
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"Topics"}
      showBottomMenu={false}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.topicsContainer}>
        <PageTitle headingValue="Select the topics you are interested in receiving notifications for" />
        <NotiSearchInput
          inputVal={inputVal}
          handleSearch={handleSearch}
          setInputVal={setInputVal}
        />
        <div className={style.topicChipsContainer}>
          {topicsList.map((topic) => (
            <Chip
              key={topic.name}
              topic={topic}
              checked={selectedTopics.indexOf(topic.name) === -1 ? false : true}
              handleCheck={handleCheck}
            />
          ))}
        </div>

        <p className={style.selectedTopics}>
          {selectedTopics.length} topics selected
        </p>

        <div className={style.topicButton}>
          <Button
            className={style.button}
            color="primary"
            onClick={handleNextPage}
          >
            {type === pageOptions.add
              ? "Finish"
              : "Update Notification Preferences"}
          </Button>
        </div>
      </div>
    </HeaderLayout>
  );
};
