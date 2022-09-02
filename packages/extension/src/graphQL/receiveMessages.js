import { store } from "../chatStore";
import { addMessageList } from "../chatStore/messages-slice";
import { fetchMessages } from "../graphQL/messagesAPI";

export const recieveMessages = async () => {
  const state = store.getState();

  const { pubAddress, accessToken } = state.user;

  const messagesArray = await fetchMessages(accessToken);
  let messageStore = {};
  messagesArray.map((message) => {
    const contactAddress = message.sender === pubAddress ? message.target : message.sender;
    // const contactAddress = message.target
    if (!messageStore[contactAddress])
      messageStore[contactAddress] = { messages: {}, lastMessage: { commitTimestamp: 0 } };
    messageStore[contactAddress].messages[message.id] = message;
    messageStore[contactAddress].lastMessage = findLastMessage(message, messageStore[contactAddress].lastMessage);
  });
  store.dispatch(addMessageList(messageStore));
};

export const findLastMessage = (newMessage, lastMessage) => {
  if (newMessage.commitTimestamp > lastMessage.commitTimestamp) return newMessage;
  return lastMessage;
};
