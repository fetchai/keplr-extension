import { NotyphiNotification } from "@notificationTypes";
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

export const unfollowOrganisation = async (
  walletAddress: string,
  orgId: string
) => {
  const headers = {
    "x-wallet-address": walletAddress,
  };

  return await axios
    .get(`https://api-staging.notyphi.com/v1/notifications/${orgId}/unfollow`, {
      headers: headers,
    })
    .then((response) => response.data);
};

export const fetchTopics = async () => {
  return await axios
    .get("https://api-staging.notyphi.com/v1/tags?page=1&size=50")
    .then((res) => res.data);
};

export const fetchAllNotifications = async () => {
  const notificationList: NotyphiNotification[] = [
    {
      delivery_id: "df4db5fc-b474-41cf-b532-c0e5779d3d57",
      title: "cheeky-ultramarine-hornet",
      content:
        "Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content ",
      cta_title: "titles",
      cta_url: "www.flimsy-amethyst-termite.com",
      delivered_at: "2023-03-13T10:46:01.111826+00:00",
      read_at: "",
      clicked_at: "",
      rejected_at: "",
    },
    {
      delivery_id: "45af2f93-fd42-49e7-8e03-b72e5e8c3ea2",
      title: "skanky-smalt-liger",
      content:
        "Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content ",
      cta_title: "titles",
      cta_url: "www.silly-smalt-orangutan.com",
      delivered_at: "2023-03-13T10:46:01.114166+00:00",
      read_at: "",
      clicked_at: "",
      rejected_at: "",
    },
    {
      delivery_id: "f9b66694-24fa-48c6-8e41-ecf4ab885ec5",
      title: "sleazy-buff-newt",
      content:
        "Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content Lots of content ",
      cta_title: "titles",
      cta_url: "www.scanty-celadon-mongoose.com",
      delivered_at: "2023-03-13T10:46:01.115960+00:00",
      read_at: "",
      clicked_at: "",
      rejected_at: "",
    },
  ];

  return notificationList;
};

export const markDeliveryAsRead = async (
  deliveryId: string,
  walletAddress: string
) => {
  const headers = {
    "x-wallet-address": walletAddress,
  };

  return await axios
    .post(
      `https://api-staging.notyphi.com/v1/notifications/${deliveryId}/read`,
      "",
      { headers: headers }
    )
    .then((response) => response.data);
};

export const markDeliveryAsRejected = async (
  deliveryId: string,
  walletAddress: string
) => {
  const headers = {
    "x-wallet-address": walletAddress,
  };

  return await axios
    .post(
      `https://api-staging.notyphi.com/v1/notifications/${deliveryId}/rejected`,
      "",
      { headers: headers }
    )
    .then((response) => response.data);
};
