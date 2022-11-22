/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import ReactTextareaAutosize from "react-textarea-autosize";
import { Input, InputGroup } from "reactstrap";
import {
  Group,
  Groups,
  MessagesState,
  userChatGroups,
  userMessages,
} from "../../chatStore/messages-slice";
import { userDetails } from "../../chatStore/user-slice";
import { ChatMessage } from "../../components/chatMessage";
import { ToolTip } from "../../components/tooltip";
import { CHAT_PAGE_COUNT } from "../../config.ui.var";
import { deliverMessages } from "../../graphQL/messages-api";
import { recieveGroups, recieveMessages } from "../../graphQL/recieve-messages";
import paperAirplaneIcon from "../../public/assets/icon/paper-airplane.png";
import { useStore } from "../../stores";
import style from "./style.module.scss";
export const ChatsViewSection = ({
  setLoadingChats,
  isNewUser,
  isBlocked,
  targetPubKey,
}: {
  setLoadingChats: any;
  isNewUser: boolean;
  isBlocked: boolean;
  targetPubKey: string;
}) => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];

  const user = useSelector(userDetails);
  const userGroups: Groups = useSelector(userChatGroups);
  const userChats: MessagesState = useSelector(userMessages);

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const preLoadedChats = useMemo(
    () =>
      userChats[userName] || {
        messages: {},
        pagination: { page: -1, pageCount: CHAT_PAGE_COUNT },
      },
    [Object.values(userChats[userName]?.messages || []).length]
  );
  const [messages, setMessages] = useState<any[]>(
    Object.values(preLoadedChats?.messages) || []
  );

  const [pagination, setPagination] = useState(preLoadedChats?.pagination);
  const [group] = useState<Group | undefined>(
    Object.values(userGroups).find((group) => group.id.includes(userName))
  );

  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const getFirstBatchofChats = async () => {
      setLoadingChats(true);
      console.log("getFirstBatchofChats");
      if (group) await loadUserList();
      setLoadingChats(false);
      scrollToBottom();
    };
    if (messages.length === 0) getFirstBatchofChats();
    scrollToBottom();
  }, []);

  useEffect(() => {
    setMessages(Object.values(preLoadedChats?.messages));
    setPagination(preLoadedChats?.pagination);
  }, [preLoadedChats]);

  const messagesEndRef: any = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView(true);
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView(true);
    }
  }, [messagesEndRef.current]);

  const loadUserList = async () => {
    if (group && !loadingMessages) {
      const page = pagination?.page + 1 || 0;
      setLoadingMessages(true);
      await recieveMessages(userName, page, group.id);
      setLoadingMessages(false);
    }
  };

  const getDateValue = (d: any) => {
    const date = new Date(d);
    return date.getDate();
  };
  let prevDate = 0;
  const showDateFunction = (d: any) => {
    const date = getDateValue(d);

    if (prevDate !== date) {
      prevDate = date;
      return true;
    }
    return false;
  };

  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (newMessage.trim().length)
      try {
        const message = await deliverMessages(
          user.accessToken,
          current.chainId,
          newMessage,
          accountInfo.bech32Address,
          userName
        );
        const updatedMessagesList = [...messages, message];
        setMessages(updatedMessagesList);
        if (message) setNewMessage("");
        scrollToBottom();
        recieveGroups(0, accountInfo.bech32Address);
      } catch (error) {
        console.log("failed to send : ", error);
      }
  };

  const handleKeydown = (e: { keyCode: number }) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleSendMessage(e);
    }
  };

  return (
    <div
      className={`${style.chatArea} ${
        isNewUser ? style.showButton : style.hideButton
      }`}
    >
      <InfiniteScroll
        className={style.messages}
        threshold={1}
        loadMore={loadUserList}
        useWindow={false}
        isReverse={true}
        hasMore={pagination?.lastPage > pagination?.page && !loadingMessages}
        loader={
          <div className={style.loader} key={0}>
            Loading More Chats ...
          </div>
        }
      >
        <p>
          Messages are end to end encrypted. Nobody else can read them except
          you and the recipient.
        </p>
        {messages
          ?.sort((a: any, b: any) => {
            return a.commitTimestamp - b.commitTimestamp;
          })
          ?.map((message: any, index) => {
            const check = showDateFunction(message?.commitTimestamp);
            return (
              <ChatMessage
                key={index}
                chainId={current.chainId}
                showDate={check}
                message={message?.contents}
                isSender={message?.target === userName} // if target was the user we are chatting with
                timestamp={message?.commitTimestamp || 1549312452}
              />
            );
          })}
        <div ref={messagesEndRef} className={style.messageRef} />
      </InfiniteScroll>

      <InputGroup className={style.inputText}>
        {targetPubKey.length ? (
          <ReactTextareaAutosize
            maxRows={3}
            className={`${style.inputArea} ${style["send-message-inputArea"]}`}
            placeholder={
              isBlocked ? "This contact is blocked" : "Type a new message..."
            }
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleKeydown}
            disabled={isBlocked}
          />
        ) : (
          <ToolTip
            trigger="hover"
            options={{ placement: "top" }}
            tooltip={<div>No transaction history found for this user</div>}
          >
            <Input
              className={`${style.inputArea} ${style["send-message-inputArea"]}`}
              placeholder="Type a new message..."
              disabled={true}
            />
          </ToolTip>
        )}
        {newMessage?.length && newMessage.trim() !== "" ? (
          <div
            className={style["send-message-icon"]}
            onClick={handleSendMessage}
          >
            <img src={paperAirplaneIcon} alt="" />
          </div>
        ) : (
          ""
        )}
      </InputGroup>
    </div>
  );
};
