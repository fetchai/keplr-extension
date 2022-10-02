export const sendMessages = `mutation Mutation($messages: [InputMessage!]!) {
    dispatchMessages(messages: $messages) {
      id
      sender
      target
      contents
      expiryTimestamp
      commitTimestamp
    }
  }`;

// TODO(!!!): I expect these also need types associated for all of the queries
//            here
export const receiveMessages = `query Query {
  mailbox {
    messages {
      id
      sender
      target
      contents
      expiryTimestamp
      commitTimestamp
    }
  }
}`;

export interface Message {
  id: string;
  sender: string;
  target: string;
  contents: string;
  expiryTimestamp: string;
  commitTimestamp: string;
}

export interface NewMessageUpdate {
  type: string;
  message: Message;
}

export const listenMessages = `subscription NewMessageUpdate {
    newMessageUpdate {
      type
      message {
        id
        sender
        target
        contents
        expiryTimestamp
        commitTimestamp
      }
    }
  }`;
