import axios from "axios";
export const fetchProposals = async (chainId: string) => {
  if (chainId === "fetchhub-4")
    return await axios
      .get("https://rest-fetchhub.fetch.ai/cosmos/gov/v1beta1/proposals")
      .then((response) => response.data)
      .catch((e) => console.log(e));

  return await axios
    .get("https://rest-dorado.fetch.ai/cosmos/gov/v1beta1/proposals")
    .then((response) => response.data)
    .catch((e) => console.log(e));
};

export const fetchProposalWithId = async (id: string) => {
  return await axios
    .get(`https://rest-fetchhub.fetch.ai/cosmos/gov/v1beta1/proposals/${id}`)
    .then((response) => response.data)
    .catch((e) => console.log(e));
};
