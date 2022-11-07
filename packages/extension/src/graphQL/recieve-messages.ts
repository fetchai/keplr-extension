import { store } from "../chatStore";
import { addMessageList } from "../chatStore/messages-slice";
import { fetchMessages } from "./messages-api";
import { data } from "../../src/dummy-data.json";

export const recieveMessages = async (userAddress: string) => {
  console.log("fetch messages called");
  const messagesArray = await fetchMessages();
  console.log("messagesArray", messagesArray);

  // // receiveDummyMessages(userAddress);
  // const messageStore: any = {};
  // messagesArray.map((message: any) => {
  //   const contactAddress =
  //     message.sender === userAddress ? message.target : message.sender;
  //   // const contactAddress = message.target
  //   if (!messageStore[contactAddress])
  //     messageStore[contactAddress] = {
  //       messages: {},
  //       lastMessage: { commitTimestamp: 0 },
  //     };
  //   messageStore[contactAddress].messages[message.id] = message;
  //   messageStore[contactAddress].lastMessage = findLastMessage(
  //     message,
  //     messageStore[contactAddress].lastMessage
  //   );
  // });
  // const messageStore = data[0];
  // store.dispatch(addMessageList(messageStore));
  // const messageStore: any = {};
  // messagesArray.map((message: any) => {
  //   const contactAddress =
  //     message.sender === userAddress ? message.target : message.sender;

  //   if (!messageStore[contactAddress]) {
  //     messageStore[`${message.sender}-${message.target}`] = {
  //       messages: {},
  //       lastMessage: { commitTimestamp: 0 },
  //       senderTimeStamp: 1232435435,
  //       targetTimeStamp: 1232435435,
  //     };
  //     messageStore[`${message.sender}-${message.target}`].messages[
  //       message.id
  //     ] = message;
  //     messageStore[
  //       `${message.sender}-${message.target}`
  //     ].lastMessage = findLastMessage(
  //       message,
  //       messageStore[`${message.sender}-${message.target}`].lastMessage
  //     );
  //     messageStore[
  //       `${message.sender}-${message.target}`
  //     ].senderTimeStamp = 1667478351645;
  //   }
  //   console.log("messageStore", messageStore);

  const messageStore = data[0];
  store.dispatch(addMessageList(messageStore));
  // });
};
// for testing
export const receiveDummyMessages = async (userAddress: string) => {
  const dummyMessages = await fetchMessages();

  const dummyStore: any = {};
  dummyMessages.map((message: any) => {
    const contactAddress =
      message.sender === userAddress ? message.target : message.sender;

    if (!dummyStore[contactAddress]) {
      dummyStore[`${message.sender}-${message.target}`] = {
        messages: {},
        lastMessage: { commitTimestamp: 0 },
        senderTimeStamp: 1232435435,
        targetTimeStamp: 1232435435,
      };
      dummyStore[`${message.sender}-${message.target}`].messages[
        message.id
      ] = message;
      dummyStore[
        `${message.sender}-${message.target}`
      ].lastMessage = findLastMessage(
        message,
        dummyStore[`${message.sender}-${message.target}`].lastMessage
      );
      dummyStore[
        `${message.sender}-${message.target}`
      ].senderTimeStamp = 1667478351645;
    }
    // store.dispatch(addDummyMessageList(dummyStore));
    // console.log(dummyStore);
  });
};

export const findLastMessage = (newMessage: any, lastMessage: any) => {
  if (newMessage.commitTimestamp > lastMessage.commitTimestamp)
    return newMessage;
  return lastMessage;
};
