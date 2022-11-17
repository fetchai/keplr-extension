import { store } from "../chatStore";
import {
  setGroups,
  updateChatList,
  setIsChatGroupPopulated,
} from "../chatStore/messages-slice";
import { fetchGroups, fetchMessages } from "./messages-api";

export const recieveMessages = async (
  userAddress: string,
  page: number,
  _groupId: string
) => {
  const { messages, pagination } = await fetchMessages(_groupId, page);
  const messagesObj: any = {};

  if (messages) {
    console.log("Updating store for page :", page, messages);
    messages.map((message: any) => {
      messagesObj[message.id] = message;
    });
    store.dispatch(
      updateChatList({ userAddress, messages: messagesObj, pagination })
    );
  }
  return messagesObj;
};

export const recieveGroups = async (page: number, userAddress: string) => {
  const { groups, pagination } = await fetchGroups(page);
  const groupsObj: any = {};
  if (groups && groups.length) {
    console.log("recieveGroups", groups);
    groups.map((group: any) => {
      const contactAddress =
        group.id.split("-")[0] !== userAddress
          ? group.id.split("-")[0]
          : group.id.split("-")[1];
      groupsObj[contactAddress] = group;
    });
    store.dispatch(setGroups({ groups: groupsObj, pagination }));
    store.dispatch(setIsChatGroupPopulated(true));
  }
  return groupsObj;
};
