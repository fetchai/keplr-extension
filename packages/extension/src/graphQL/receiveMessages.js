import {store}  from "../chatStore";
import { addMessageList } from "../chatStore/messages-slice";
import { fetchMessages } from "../graphQL/messagesAPI";

export const recieveMessages = async () => {
  // const state = store.getState();

  const { pubAddress, accessToken } = state.user;

  console.log("recieveMessages");
  const messagesArray = await fetchMessages();
  let messageStore = {};
  messagesArray.map((message) => {
    console.log("textMessage",message);
    const contactAddress =
      message.sender === pubAddress ? message.target : message.sender;
    // const contactAddress = message.target
    if (!messageStore[contactAddress])
      messageStore[contactAddress] = {
        messages: {},
        lastMessage: { commitTimestamp: 0 },
      };
    messageStore[contactAddress].messages[message.id] = message;
    messageStore[contactAddress].lastMessage = findLastMessage(
      message,
      messageStore[contactAddress].lastMessage
    );
  });
  console.log("message store",messageStore);
  store.dispatch(addMessageList(messageStore));
};

export const findLastMessage = (newMessage, lastMessage) => {
  if (newMessage.commitTimestamp > lastMessage.commitTimestamp)
    return newMessage;
  return lastMessage;
};
