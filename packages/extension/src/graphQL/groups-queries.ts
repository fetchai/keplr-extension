export const UpdatePublicKey = `mutation UpdatePublicKey($publicKeyDetails: InputPublicKey!) {
  updatePublicKey(publicKeyDetails: $publicKeyDetails) {
    address
    channelId
    createdAt
    id
    privacySetting
    publicKey
    updatedAt
  }
}`;

export const Group = `mutation Mutation($groupDetails: GroupDetails!) {
  group(groupDetails: $groupDetails) {
    addresses {
      address
      encryptedSymmetricKey
      isAdmin
      lastSeenTimestamp
      pubKey
    }
    createdAt
    description
    id
    isDm
    lastMessageContents
    lastMessageSender
    lastMessageTimestamp
    lastSeenTimestamp
    name
  }
}`;

export const UpdateGroupLastSeen = `mutation Mutation($groupId: String!, $lastSeenTimestamp: Date!) {
  updateGroupLastSeen(groupId: $groupId, lastSeenTimestamp: $lastSeenTimestamp) {
    addresses {
      address
      encryptedSymmetricKey
      isAdmin
      lastSeenTimestamp
      pubKey
    }
    createdAt
    description
    id
    isDm
    lastMessageContents
    lastMessageSender
    lastMessageTimestamp
    lastSeenTimestamp
    name
  }
}`;

export const listenGroups = `subscription Subscription {
  groupUpdate {
    group {
      addresses {
        address
        encryptedSymmetricKey
        isAdmin
        lastSeenTimestamp
        pubKey
      }
      createdAt
      description
      id
      isDm
      lastMessageContents
      lastMessageSender
      lastMessageTimestamp
      lastSeenTimestamp
      name
    }
  }
}`;
