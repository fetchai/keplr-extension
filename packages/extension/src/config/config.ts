export const ACCESS_TOKEN = localStorage.getItem("access_token");
export const MESSAGING_SERVER =
  "https://messaging-server.sandbox-london-b.fetch-ai.com/graphql";
export const AUTH_SERVER = "https://auth-attila.sandbox-london-b.fetch-ai.com";
export const CHAIN_ID_DORADO = "dorado-1";
export const CHAIN_ID_FETCHHUB = "fetchhub-4";

const USER_DATA = {
  user1 : {
    SENDER_ADDRESS:"fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
    SENDER_MNEMONIC_DATA:"essay coconut track analyst cup remind social gorilla turkey forum hub minor",
  },
  user2 : {
    SENDER_ADDRESS:"fetch10u3ejwentkkv4c83yccy3t7syj3rgdc9kl4lsc",
    SENDER_MNEMONIC_DATA:"man season major festival action scale inhale shuffle rhythm case fragile capital",
  }
} 
const selectedUser = process.env.USER_ENV === "1" ? USER_DATA.user1 :  USER_DATA.user2;
export const SENDER_ADDRESS = selectedUser.SENDER_ADDRESS;
export const SENDER_MNEMONIC_DATA =selectedUser.SENDER_MNEMONIC_DATA;
