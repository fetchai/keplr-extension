import axios from "axios";

export const fetchOrganisations = async () => {
  return await axios
    .get("https://api-staging.notyphi.com/v1/organisations?page=1&size=50")
    .then((res) => res.data);
};

export const fetchFollowedOrganisations = async (walletAddress: string) => {
  const headers = {
    "x-wallet-address": walletAddress,
  };
  return await axios
    .get("https://api-staging.notyphi.com/v1/profile/following", {
      headers: headers,
    })
    .then((res) => res.data);
};

export const followOrganisation = async (
  walletAddress: string,
  orgId: string
) => {
  const headers = {
    "x-wallet-address": walletAddress,
  };

  return await axios
    .post(
      `https://api-staging.notyphi.com/v1/notifications/${orgId}/follow`,
      "",
      { headers: headers }
    )
    .then((response) => response.data);
};

export const fetchTopics = async () => {
  return await axios
    .get("https://api-staging.notyphi.com/v1/tags?page=1&size=50")
    .then((res) => res.data);
};
