/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import ReactTextareaAutosize from "react-textarea-autosize";
import { InputGroup } from "reactstrap";
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
import {
  deliverMessages,
  updateGroupTimestamp,
} from "../../graphQL/messages-api";
import { recieveGroups, recieveMessages } from "../../graphQL/recieve-messages";
import { useOnScreen } from "../../hooks/use-on-screen";
import paperAirplaneIcon from "../../public/assets/icon/paper-airplane.png";
import { useStore } from "../../stores";
import { NewUserSection } from "./new-user-section";
import style from "./style.module.scss";
export const ChatsViewSection = ({
  isNewUser,
  isBlocked,
  targetPubKey,
  handleClick,
}: {
  isNewUser: boolean;
  isBlocked: boolean;
  targetPubKey: string;
  setLoadingChats: any;
  handleClick: any;
}) => {
  const history = useHistory();
  const userName = history.location.pathname.split("/")[2];

  const user = useSelector(userDetails);
  const userGroups: Groups = useSelector(userChatGroups);
  const userChats: MessagesState = useSelector(userMessages);

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const preLoadedChats = useMemo(() => {
    return (
      userChats[userName] || {
        messages: {},
        pagination: { lastPage: 0, page: -1, pageCount: CHAT_PAGE_COUNT },
      }
    );
  }, [Object.values(userChats[userName]?.messages || []).length]);
  const [messages, setMessages] = useState<any[]>(
    Object.values(preLoadedChats?.messages) || []
  );

  const [pagination, setPagination] = useState(preLoadedChats?.pagination);
  const [group, setGroup] = useState<Group | undefined>(
    Object.values(userGroups).find((group) => group.id.includes(userName))
  );

  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    console.log("New message received");

    const updatedMessages = Object.values(preLoadedChats?.messages).sort(
      (a, b) => {
        return parseInt(a.commitTimestamp) - parseInt(b.commitTimestamp);
      }
    );

    setMessages(updatedMessages);

    setPagination(preLoadedChats?.pagination);
    console.log("Sending my last seen status from new message");

    const lastMessage =
      updatedMessages && updatedMessages.length > 0
        ? updatedMessages[updatedMessages.length - 1]
        : null;

    if (
      group?.id &&
      lastMessage &&
      lastMessage.sender !== accountInfo.bech32Address
    ) {
      updateGroupTimestamp({
        groupId: group?.id,
        lastSeenTimestamp: new Date(lastMessage.commitTimestamp),
      });
    }
  }, [preLoadedChats]);

  useEffect(() => {
    console.log(
      "Hello from set group update",
      Number(
        Object.values(userGroups)
          .find((group) => group.id.includes(userName))
          ?.addresses.filter(
            (val: { address: string }) => val.address === userName
          )[0].lastSeenTimestamp
      ) >=
        Number(
          group?.addresses.filter(
            (val: { address: string }) => val.address === userName
          )[0].lastSeenTimestamp
        )
    );

    if (
      Number(
        Object.values(userGroups)
          .find((group) => group.id.includes(userName))
          ?.addresses.filter(
            (val: { address: string }) => val.address === userName
          )[0].lastSeenTimestamp
      ) >=
      Number(
        group?.addresses.filter(
          (val: { address: string }) => val.address === userName
        )[0].lastSeenTimestamp
      )
    )
      setGroup(
        Object.values(userGroups).find((group) => group.id.includes(userName))
      );
  }, [userGroups]);

  //Scrolling Logic
  // const messagesEndRef: any = useRef();
  const messagesStartRef: any = createRef();
  const messagesScrollRef: any = useRef(null);
  const isOnScreen = useOnScreen(messagesStartRef);

  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) messagesEndRef.current.scrollIntoView(true);
  // };
  const reciever = group?.addresses.find((val) => val.address !== userName);

  const messagesEndRef: any = useCallback(
    (node: any) => {
      if (node) node.scrollIntoView({ block: "end" });
    },
    [messages]
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView(true);
    }
  }, [messagesEndRef.current]);

  // useEffect(() => {
  //   console.log("Hello from group timestamp update");

  //   getUpdatedTime();
  // }, [group]);

  useEffect(() => {
    const getChats = async () => {
      await loadUserList();
      // if (pagination.page < 0) scrollToBottom();
      // else messagesScrollRef.current.scrollIntoView(true);
    };
    if (isOnScreen) getChats();
  }, [isOnScreen]);

  const loadUserList = async () => {
    if (loadingMessages) return;
    if (group) {
      const page = pagination?.page + 1 || 0;
      setLoadingMessages(true);
      await recieveMessages(userName, page, group.id);
      setLoadingMessages(false);
    } else {
      const newPagination = pagination;
      newPagination.page = pagination.lastPage;
      setPagination(newPagination);
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
        if (message) {
          setNewMessage("");
        }
        // scrollToBottom();
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
      <div className={style.messages}>
        {pagination?.lastPage > pagination?.page && (
          <div ref={messagesStartRef} className={style.loader}>
            Fetching older Chats <i className="fas fa-spinner fa-spin ml-2" />
          </div>
        )}
        {pagination?.lastPage <= pagination?.page && (
          <>
            {isNewUser && (
              <NewUserSection userName={userName} handleClick={handleClick} />
            )}
            <p>
              Messages are end to end encrypted. Nobody else can read them
              except you and the recipient.
            </p>
          </>
        )}
        {messages?.map((message: any, index) => {
          const check = showDateFunction(message?.commitTimestamp);
          function getLastSeen(): string | undefined {
            return group?.addresses.filter((val) => val.address === userName)[0]
              .lastSeenTimestamp;
          }

          return (
            <>
              {group !== undefined && (
                <ChatMessage
                  key={index}
                  chainId={current.chainId}
                  showDate={check}
                  message={message?.contents}
                  isSender={message?.target === userName} // if target was the user we are chatting with
                  timestamp={message?.commitTimestamp || 1549312452}
                  lastTimeStamp={getLastSeen()}
                />
              )}
              {index === CHAT_PAGE_COUNT && <div ref={messagesScrollRef} />}
              {Number(message.commitTimestamp) >
                Number(reciever?.lastSeenTimestamp) &&
                message?.sender === userName && (
                  <div ref={messagesEndRef} className={messagesEndRef} />
                )}
            </>
          );
        })}
        <div ref={messagesEndRef} className={"AAAAA"} />
      </div>

      <InputGroup className={style.inputText}>
        {targetPubKey.length ? (
          <ReactTextareaAutosize
            maxRows={3}
            className={`${style.inputArea} ${style["send-message-inputArea"]}`}
            placeholder={
              isBlocked ? "This contact is blocked" : "Type a new message..."
            }
            value={newMessage}
            onChange={(event) => {
              if (event.target.value.length < 500)
                setNewMessage(event.target.value);
            }}
            onKeyDown={handleKeydown}
            disabled={isBlocked}
          />
        ) : (
          <ToolTip
            trigger="hover"
            options={{ placement: "top" }}
            tooltip={<div>No transaction history found for this user</div>}
          >
            <ReactTextareaAutosize
              maxRows={3}
              className={`${style.inputArea} ${style["send-message-inputArea"]}`}
              placeholder={
                isBlocked ? "This contact is blocked" : "Type a new message..."
              }
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
