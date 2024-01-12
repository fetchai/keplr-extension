import { makeAutoObservable } from "mobx";
import { GroupDetails, GroupMembers, NewGroupDetails } from "./types";

export class NewGroupStore {
  newGroup: NewGroupDetails = {
    isEditGroup: false,
    group: {
      contents: "",
      description: "",
      groupId: "",
      members: [] as GroupMembers[],
      name: "",
      onlyAdminMessages: false,
    } as GroupDetails,
  };

  constructor() {
    makeAutoObservable(this);
  }

  resetNewGroup() {
    this.newGroup = {
      isEditGroup: false,
      group: {
        contents: "",
        description: "",
        groupId: "",
        members: [] as GroupMembers[],
        name: "",
        onlyAdminMessages: false,
      } as GroupDetails,
    };
  }

  setNewGroupInfo(newGroupInfo: GroupDetails) {
    this.newGroup.group = { ...this.newGroup.group, ...newGroupInfo };
  }

  setIsGroupEdit(isEdit: boolean) {
    this.newGroup.isEditGroup = isEdit;
  }
}

export const newGroupStore = new NewGroupStore();
