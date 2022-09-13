import { store } from "../chatStore";
import { addMessageList } from "../chatStore/messages-slice";
import { SENDER_ADDRESS, SENDER_MNEMONIC_DATA } from "../config/config";
import { fetchMessages } from "../graphQL/messages-api";
import { getWalletKeys } from "../utils";

export const recieveMessages = async () => {
  const messagesArray = await fetchMessages();
  console.log("messagesArray", messagesArray);
  let messageStore = {};
  messagesArray.map((message) => {
    const contactAddress = message.sender === SENDER_ADDRESS ? message.target : message.sender;
    // const contactAddress = message.target
    if (!messageStore[contactAddress])
      messageStore[contactAddress] = { messages: {}, lastMessage: { commitTimestamp: 0 } };
    messageStore[contactAddress].messages[message.id] = message;
    messageStore[contactAddress].lastMessage = findLastMessage(message, messageStore[contactAddress].lastMessage);
  });
  store.dispatch(addMessageList(messageStore));
};

export const findLastMessage = (newMessage, lastMessage) => {
  if (newMessage.commitTimestamp > lastMessage.commitTimestamp)
    return newMessage;
  return lastMessage;
};
