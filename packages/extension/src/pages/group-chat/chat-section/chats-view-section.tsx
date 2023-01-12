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
import { Chats, Group, Groups } from "@chatTypes";
import { userChatGroups, userMessages } from "@chatStore/messages-slice";
import { userDetails } from "@chatStore/user-slice";
import { CHAT_PAGE_COUNT } from "../../../config.ui.var";
import { deliverGroupMessages } from "@graphQL/messages-api";
import { recieveGroups, recieveMessages } from "@graphQL/recieve-messages";
import { useOnScreen } from "@hooks/use-on-screen";
import paperAirplaneIcon from "@assets/icon/paper-airplane.png";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
import { GroupMessageType } from "../../../utils/encrypt-group";
import { GroupChatMessage } from "@components/group-chat-message";

export const GroupChatsViewSection = ({}: {
  setLoadingChats: any;
  handleClick: any;
}) => {
  const history = useHistory();
  const groupId = history.location.pathname.split("/")[3];

  let enterKeyCount = 0;
  const user = useSelector(userDetails);
  const userGroups: Groups = useSelector(userChatGroups);
  const userChats: Chats = useSelector(userMessages);

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const preLoadedChats = useMemo(() => {
    return (
      userChats[groupId] || {
        messages: {},
        pagination: { lastPage: 0, page: -1, pageCount: CHAT_PAGE_COUNT },
      }
    );
  }, [Object.values(userChats[groupId]?.messages || []).length]);
  const [messages, setMessages] = useState<any[]>(
    Object.values(preLoadedChats?.messages) || []
  );

  const [pagination, setPagination] = useState(preLoadedChats?.pagination);
  const [group, setGroup] = useState<Group | undefined>(
    Object.values(userGroups).find((group) => group.id.includes(groupId))
  );

  const [loadingMessages, setLoadingMessages] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  //Scrolling Logic
  // const messagesEndRef: any = useRef();
  const messagesStartRef: any = createRef();
  const messagesScrollRef: any = useRef(null);
  const isOnScreen = useOnScreen(messagesStartRef);

  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) messagesEndRef.current.scrollIntoView(true);
  // };

  useEffect(() => {
    const updatedMessages = Object.values(preLoadedChats?.messages).sort(
      (a, b) => {
        return parseInt(a.commitTimestamp) - parseInt(b.commitTimestamp);
      }
    );

    setMessages(updatedMessages);
    if (preLoadedChats && preLoadedChats.pagination)
      setPagination(preLoadedChats.pagination);

    // const lastMessage =
    //   updatedMessages && updatedMessages.length > 0
    //     ? updatedMessages[updatedMessages.length - 1]
    //     : null;

    // if (
    //   group?.id &&
    //   lastMessage &&
    //   lastMessage.sender !== accountInfo.bech32Address
    // ) {
    //   setTimeout(() => {
    //     updateGroupTimestamp(
    //       group?.id,
    //       user.accessToken,
    //       current.chainId,
    //       accountInfo.bech32Address,
    //       groupId,
    //       new Date(lastMessage.commitTimestamp),
    //       new Date(lastMessage.commitTimestamp)
    //     );
    //   }, 500);
    // }
  }, [preLoadedChats]);

  useEffect(() => {
    setGroup(
      Object.values(userGroups).find((group) => group.id.includes(groupId))
    );
  }, [userGroups]);

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

  useEffect(() => {
    const getChats = async () => {
      await loadUserList();
      // if (pagination.page < 0) scrollToBottom();
      // else messagesScrollRef.current.scrollIntoView(true);
      if (pagination.page >= 0) messagesScrollRef.current.scrollIntoView(true);
    };
    if (isOnScreen) getChats();
  }, [isOnScreen]);

  const loadUserList = async () => {
    if (loadingMessages) return;
    if (group) {
      const page = pagination?.page + 1 || 0;
      setLoadingMessages(true);
      await recieveMessages(groupId, null, page, group.isDm, groupId);
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

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (newMessage.trim().length)
      try {
        const message = await deliverGroupMessages(
          user.accessToken,
          current.chainId,
          newMessage,
          GroupMessageType.message,
          accountInfo.bech32Address,
          groupId
        );

        if (message) {
          const updatedMessagesList = [...messages, message];
          setMessages(updatedMessagesList);
          setNewMessage("");
        }
        // scrollToBottom();
        recieveGroups(0, accountInfo.bech32Address);
      } catch (error) {
        console.log("failed to send : ", error);
      } finally {
        enterKeyCount = 0;
      }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //it triggers by pressing the enter key
    const { key } = e as React.KeyboardEvent<HTMLTextAreaElement>;
    if (key === "Enter" && enterKeyCount == 0) {
      enterKeyCount = 1;
      handleSendMessage(e);
    }
  };

  return (
    <div className={style.chatArea}>
      <div className={style.messages}>
        {pagination?.lastPage > pagination?.page && (
          <div ref={messagesStartRef} className={style.loader}>
            Fetching older Chats <i className="fas fa-spinner fa-spin ml-2" />
          </div>
        )}
        {pagination?.lastPage <= pagination?.page && (
          <p>
            Messages are end to end encrypted. Nobody else can read them except
            you and the recipient.
          </p>
        )}
        {messages?.map((message: any, index) => {
          const check = showDateFunction(message?.commitTimestamp);
          return (
            <div key={message.id}>
              {group !== undefined && (
                <GroupChatMessage
                  chainId={current.chainId}
                  showDate={check}
                  message={message?.contents}
                  isSender={message?.sender === accountInfo.bech32Address} // if I am the sender of this message
                  timestamp={message?.commitTimestamp || 1549312452}
                  groupLastSeenTimestamp={0}
                />
              )}
              {index === CHAT_PAGE_COUNT && <div ref={messagesScrollRef} />}
              {/* {message?.commitTimestamp &&
                receiver?.lastSeenTimestamp &&
                Number(message?.commitTimestamp) >
                  Number(receiver?.lastSeenTimestamp) &&
                message?.sender === targetAddress && (
                  <div ref={messagesEndRef} className={messagesEndRef} />
                )} */}
            </div>
          );
        })}
        <div ref={messagesEndRef} className={"AAAAA"} />
      </div>

      <InputGroup className={style.inputText}>
        {
          <ReactTextareaAutosize
            maxRows={3}
            className={`${style.inputArea} ${style["send-message-inputArea"]}`}
            placeholder={"Type a new message..."}
            value={newMessage}
            onChange={(event) => {
              setNewMessage(event.target.value.substring(0, 499));
            }}
            onKeyDown={handleKeydown}
          />
        }
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
