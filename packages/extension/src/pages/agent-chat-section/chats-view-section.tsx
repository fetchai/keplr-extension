/* eslint-disable react-hooks/exhaustive-deps */
import agentCommandIcon from "@assets/icon/agent-command.png";
import paperAirplaneIcon from "@assets/icon/paper-airplane.png";
import { store } from "@chatStore/index";
import {
  setMessageError,
  userChatAgents,
  userMessages,
} from "@chatStore/messages-slice";
import { userDetails } from "@chatStore/user-slice";
import { Chats, Group, GroupAddress, Groups } from "@chatTypes";
import { AgentActionsDropdown } from "@components/agent-actions-dropdown";
import { ChatMessage } from "@components/chat-message";
import { AgentInitPopup } from "@components/chat/agent-init-popup";
import { ToolTip } from "@components/tooltip";
import { deliverMessages, updateGroupTimestamp } from "@graphQL/messages-api";
import { recieveGroups, recieveMessages } from "@graphQL/recieve-messages";
import { useOnScreen } from "@hooks/use-on-screen";
import { decryptGroupTimestamp } from "@utils/decrypt-group";
import { signTransaction } from "@utils/sign-transaction";
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
import { AGENT_COMMANDS, CHAT_PAGE_COUNT } from "../../config.ui.var";
import { useStore } from "../../stores";
import style from "./style.module.scss";

export const ChatsViewSection = ({
  targetPubKey,
}: {
  targetPubKey: string;
  setLoadingChats: any;
}) => {
  const history = useHistory();
  const targetAddress = history.location.pathname.split("/")[2];

  let enterKeyCount = 0;
  const user = useSelector(userDetails);
  const userAgents: Groups = useSelector(userChatAgents);
  const userChats: Chats = useSelector(userMessages);

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const preLoadedChats = useMemo(() => {
    return (
      userChats[targetAddress] || {
        messages: {},
        pagination: { lastPage: 0, page: -1, pageCount: CHAT_PAGE_COUNT },
      }
    );
  }, [Object.values(userChats[targetAddress]?.messages || []).length]);
  const [messages, setMessages] = useState<any[]>(
    Object.values(preLoadedChats?.messages) || []
  );

  const [pagination, setPagination] = useState(preLoadedChats?.pagination);
  const [group, setGroup] = useState<Group | undefined>(
    Object.values(userAgents).find((group) => group.id.includes(targetAddress))
  );

  const [loadingMessages, setLoadingMessages] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [isCommand, setIsCommand] = useState(false);
  const [showCommandDropdown, setShowCommandDropdown] = useState(false);
  const [lastUnreadMesageId, setLastUnreadMesageId] = useState("");

  const messagesStartRef: any = createRef();
  const messagesScrollRef: any = useRef(null);
  const isOnScreen = useOnScreen(messagesStartRef);

  useEffect(() => {
    const updatedMessages = Object.values(preLoadedChats?.messages).sort(
      (a, b) => {
        return parseInt(a.commitTimestamp) - parseInt(b.commitTimestamp);
      }
    );

    setMessages(updatedMessages);
    setPagination(preLoadedChats.pagination);

    const lastMessage =
      updatedMessages && updatedMessages.length > 0
        ? updatedMessages[updatedMessages.length - 1]
        : null;

    if (
      group?.id &&
      lastMessage &&
      lastMessage.sender !== accountInfo.bech32Address
    ) {
      setTimeout(() => {
        updateGroupTimestamp(
          group?.id,
          user.accessToken,
          current.chainId,
          accountInfo.bech32Address,
          targetAddress,
          new Date(lastMessage.commitTimestamp),
          new Date(lastMessage.commitTimestamp)
        );
      }, 500);
    }
  }, [preLoadedChats]);

  const decryptGrpAddresses = async (
    groupAddress: GroupAddress,
    isSender: boolean
  ) => {
    if (groupAddress && groupAddress.groupLastSeenTimestamp) {
      const data = await decryptGroupTimestamp(
        current.chainId,
        groupAddress.groupLastSeenTimestamp,
        isSender
      );

      Object.assign(groupAddress, {
        groupLastSeenTimestamp: new Date(data).getTime(),
      });
    }
    if (groupAddress && groupAddress.lastSeenTimestamp) {
      const data = await decryptGroupTimestamp(
        current.chainId,
        groupAddress.lastSeenTimestamp,
        isSender
      );
      Object.assign(groupAddress, {
        lastSeenTimestamp: new Date(data).getTime(),
      });
    }

    return groupAddress;
  };

  const decryptGrp = async (group: Group) => {
    const tempGroup = { ...group };
    let tempSenderAddress: GroupAddress | undefined;
    let tempReceiverAddress: GroupAddress | undefined;

    /// Shallow copy
    /// Decrypting sender data
    const senderAddress = {
      ...group.addresses?.find((val) => val.address !== targetAddress),
    };
    if (senderAddress)
      tempSenderAddress = await decryptGrpAddresses(
        senderAddress as GroupAddress,
        true
      );

    /// Decrypting receiver data
    const receiverAddress = {
      ...group.addresses?.find((val) => val.address === targetAddress),
    };
    if (receiverAddress)
      tempReceiverAddress = await decryptGrpAddresses(
        receiverAddress as GroupAddress,
        false
      );

    /// Storing decryptin address into the group object and updating the UI
    if (tempSenderAddress && tempReceiverAddress) {
      const tempGroupAddress = [tempSenderAddress, tempReceiverAddress];
      tempGroup.addresses = tempGroupAddress;
      setGroup(tempGroup);
    }
  };

  useEffect(() => {
    /// Shallow copy
    const tempGroup = {
      ...Object.values(userAgents).find((group) =>
        group.id.includes(targetAddress)
      ),
    };
    if (tempGroup) decryptGrp(tempGroup as Group);
  }, [userAgents]);

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
      if (pagination.page >= 0) messagesScrollRef.current.scrollIntoView(true);
    };
    if (isOnScreen) getChats();
  }, [isOnScreen]);

  const loadUserList = async () => {
    if (loadingMessages) return;
    if (group) {
      const page = pagination?.page + 1 || 0;
      setLoadingMessages(true);
      await recieveMessages(
        targetAddress,
        receiver?.lastSeenTimestamp &&
          Number(group.lastMessageTimestamp) >
            Number(receiver.lastSeenTimestamp) &&
          page == 0
          ? receiver?.lastSeenTimestamp
          : null,
        page,
        group.isDm,
        group.id
      );
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

  const receiver = group?.addresses.find(
    (val) => val.address === targetAddress
  );
  useEffect(() => {
    const time = group?.addresses.find((val) => val.address !== targetAddress)
      ?.lastSeenTimestamp;
    if (lastUnreadMesageId === "") {
      const firstMessageUnseen = messages
        .filter((message) => message.commitTimestamp > Number(time))
        .sort();
      if (firstMessageUnseen.length > 0) {
        setLastUnreadMesageId(firstMessageUnseen[0].id);
      }
    }
  }, [messages, group]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (
      isCommand &&
      !AGENT_COMMANDS.find(
        (command) => command.command == newMessage && command.enabled
      )
    ) {
      store.dispatch(
        setMessageError({
          type: "manual",
          message: "Following Command is not Recognised by Fetchbot",
          level: 1,
        })
      );
      return;
    }
    if (newMessage.trim().length)
      try {
        const message = await deliverMessages(
          user.accessToken,
          current.chainId,
          newMessage,
          accountInfo.bech32Address,
          targetAddress
        );

        if (message) {
          const updatedMessagesList = [...messages, message];
          setMessages(updatedMessagesList);
          setLastUnreadMesageId("");
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
    if (key === "Enter" && !e.shiftKey && enterKeyCount == 0) {
      enterKeyCount = 1;
      handleSendMessage(e);
    }
  };

  const handleCommand = (command: string) => {
    setIsCommand(true);
    setShowCommandDropdown(false);
    setNewMessage(command);
  };

  const signTxn = async (data: string) => {
    try {
      const signedMessage = await signTransaction(
        data,
        current.chainId,
        accountInfo.bech32Address
      );

      await deliverMessages(
        user.accessToken,
        current.chainId,
        signedMessage,
        accountInfo.bech32Address,
        targetAddress
      );
    } catch (e) {
      console.log(e);
      await deliverMessages(
        user.accessToken,
        current.chainId,
        "/cancel",
        accountInfo.bech32Address,
        targetAddress
      );
    } finally {
      history.goBack();
    }
  };

  return (
    <div className={style.chatArea}>
      {!loadingMessages && !messages.length && <AgentInitPopup />}
      <div className={style.messages}>
        {pagination?.lastPage <= pagination?.page && (
          <p>
            Messages are end to end encrypted. Nobody else can read them except
            you and the recipient.
          </p>
        )}
        {pagination?.lastPage > pagination?.page &&
          (pagination?.page === -1 ||
            messages.length === 30 ||
            messages.length == 0) && (
            <div ref={messagesStartRef} className={style.loader}>
              Fetching older Chats <i className="fas fa-spinner fa-spin ml-2" />
            </div>
          )}
        <AgentActionsDropdown
          showDropdown={showCommandDropdown}
          handleClick={handleCommand}
        />
        {messages?.map((message: any, index) => {
          const check = showDateFunction(message?.commitTimestamp);
          return (
            <div key={message.id}>
              {group !== undefined && (
                <ChatMessage
                  chainId={current.chainId}
                  showDate={check}
                  message={message?.contents}
                  isSender={message?.sender === accountInfo.bech32Address} // if I am the sender of this message
                  timestamp={message?.commitTimestamp || 1549312452}
                  groupLastSeenTimestamp={
                    receiver && receiver.groupLastSeenTimestamp
                      ? new Date(receiver.groupLastSeenTimestamp).getTime()
                      : 0
                  }
                  onClickSignTxn={signTxn}
                />
              )}
              {index === CHAT_PAGE_COUNT && <div ref={messagesScrollRef} />}
              {message?.commitTimestamp &&
                receiver?.lastSeenTimestamp &&
                Number(message?.commitTimestamp) >
                  Number(receiver?.lastSeenTimestamp) &&
                message?.sender === targetAddress && (
                  <div className={messagesEndRef} /> //ref={messagesEndRef}
                )}
              {lastUnreadMesageId === message.id && (
                <div ref={messagesEndRef} />
              )}
            </div>
          );
        })}

        {lastUnreadMesageId === "" && <div ref={messagesEndRef} />}
      </div>

      <InputGroup className={style.inputText}>
        {targetPubKey.length ? (
          <ReactTextareaAutosize
            maxRows={3}
            className={`${style.inputArea} ${style["send-message-inputArea"]}`}
            placeholder={"Ask a question or type / for commands"}
            value={newMessage}
            onChange={(event) => {
              if (
                event.target.value.length &&
                AGENT_COMMANDS.find((command: any) =>
                  command.command.includes(event.target.value)
                )
              ) {
                setIsCommand(true);
                setShowCommandDropdown(true);
              } else {
                setIsCommand(false);
                setShowCommandDropdown(false);
              }
              setNewMessage(event.target.value.substring(0, 100));
            }}
            onKeyDown={handleKeydown}
          />
        ) : (
          <ToolTip
            trigger="hover"
            options={{ placement: "top" }}
            tooltip={<div>The Agent is inactive</div>}
          >
            <ReactTextareaAutosize
              maxRows={3}
              className={`${style.inputArea} ${style["send-message-inputArea"]}`}
              placeholder={"Type a new message..."}
              disabled={true}
            />
          </ToolTip>
        )}
        <div className={style["send-message-icon"]}>
          {newMessage?.length && newMessage.trim() !== "" ? (
            <img
              src={paperAirplaneIcon}
              alt=""
              draggable="false"
              onClick={handleSendMessage}
            />
          ) : (
            <img
              src={agentCommandIcon}
              alt=""
              draggable="false"
              onClick={() => setShowCommandDropdown(!showCommandDropdown)}
            />
          )}
        </div>
      </InputGroup>
    </div>
  );
};
