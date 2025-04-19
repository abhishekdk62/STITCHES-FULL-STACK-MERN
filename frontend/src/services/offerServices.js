import apiClient from "./apiClient";

export const applyProdOfferApi = async (of, selectedId) => {
  try {
    let offer=Number(of)
    const response = apiClient.post("/admin/applyProdOffer", {
      offer,
      selectedId,
    });
    return response
  } catch (error) {
    throw error;
  }
};
export const applyCatOffer = async (cid,off) => {
  try {
    let offer=Number(off)
    const response = apiClient.post("/admin/applyCatOffer", {
      offer,
      cid,
    });
    return response
  } catch (error) {
    throw error;
  }
};
