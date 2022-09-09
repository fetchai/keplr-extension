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

export const receiveMessages = `query Query($address: String) {
  mailbox(address: $address) {
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
