/* eslint-disable react-hooks/exhaustive-deps */
import { userChatAgents, userMessages } from "@chatStore/messages-slice";
import { userDetails } from "@chatStore/user-slice";
import { Chats, Group, GroupAddress, Groups } from "@chatTypes";
import { ChatMessage } from "@components/chat-message";
import { deliverMessages, updateGroupTimestamp } from "@graphQL/messages-api";
import { recieveGroups, recieveMessages } from "@graphQL/recieve-messages";
import { useOnScreen } from "@hooks/use-on-screen";
import { decryptGroupTimestamp } from "@utils/decrypt-group";
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
import {
  AGENT_COMMANDS,
  CHAT_PAGE_COUNT,
  TRANSACTION_FAILED,
  AGENT_ADDRESS,
} from "../../config.ui.var";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { AgentDisclaimer } from "@components/agents/agents-disclaimer";
import { executeTxn } from "@utils/sign-transaction";
import { useNotification } from "@components/notification";
import {
  InactiveAgentMessage,
  InputField,
  ProcessingLastMessage,
} from "./input-section";

export const ChatsViewSection = ({
  targetPubKey,
}: {
  targetPubKey: string;
  setLoadingChats: any;
}) => {
  const history = useHistory();
  const targetAddress = history.location.pathname.split("/")[3];

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
  }, [
    Object.values(userChats[targetAddress]?.messages || []).length,
    userChats[targetAddress]?.pagination,
  ]);
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
  const [lastUnreadMesageId, setLastUnreadMesageId] = useState("");
  const [processingLastMessage, setProcessingLastMessage] = useState(false);
  const messagesStartRef: any = createRef();
  const messagesScrollRef: any = useRef(null);
  const isOnScreen = useOnScreen(messagesStartRef);
  const notification = useNotification();

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

  useEffect(() => {
    if (
      messages.length &&
      messages[messages.length - 1].sender !== accountInfo.bech32Address
    )
      setProcessingLastMessage(false);
  }, [messages]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (
      isCommand &&
      !AGENT_COMMANDS.find(
        (command) => command.command == newMessage && command.enabled
      )
    ) {
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: "Following Command is not Recognised by Fetchbot",
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      return;
    }

    if (isCommand && user.currentFET <= 0) {
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: "Not Enough balance to execute automation",
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
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
          setProcessingLastMessage(true);
        }
        // scrollToBottom();
        recieveGroups(0, accountInfo.bech32Address);
      } catch (error) {
        console.log("failed to send : ", error);
      }
  };

  useEffect(() => {
    if (processingLastMessage) {
      const timer = setTimeout(() => {
        notification.push({
          type: "warning",
          placement: "top-center",
          duration: 5,
          content: `Taking more time than expected to process your request, Please try Later`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
        setProcessingLastMessage(false);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [processingLastMessage]);

  const signTxn = async (data: string) => {
    const payload = JSON.parse(data);
    console.log(payload);
    const messagePayload = {
      chainId: current.chainId,
      accessToken: user.accessToken,
      targetAddress,
    };
    try {
      await executeTxn(accountInfo, notification, payload, messagePayload);
      history.goBack();
    } catch (e) {
      console.log(e);
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: `Failed to execute Transaction`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      await deliverMessages(
        user.accessToken,
        current.chainId,
        TRANSACTION_FAILED,
        accountInfo.bech32Address,
        targetAddress
      );
      history.push(`/chat/agent/${AGENT_ADDRESS[current.chainId]}`);
    }
  };

  return (
    <div className={style.chatArea}>
      <AgentDisclaimer />
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
                  onClickSignTxn={
                    messages.length - 1 > index ? undefined : signTxn
                  }
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
      {!targetPubKey.length ? (
        <InactiveAgentMessage />
      ) : processingLastMessage ? (
        <ProcessingLastMessage />
      ) : (
        <InputField
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setIsCommand={setIsCommand}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};
