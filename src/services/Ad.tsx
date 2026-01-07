// services/Ad.ts
import api from "./api";

/* CREATE */
export const createNewPost = async (formData: FormData) => {
  const res = await api.post("/ads/newAd", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* USER ADS (PAGINATED) */
export async function getUserAds(contentPerPage: number, currentPage: number) {
  const res = await api.get("/ads/getUserAd", {
    params: { contentPerPage, currentPage },
  });
  return res.data;
}

/* USER ALL ADS */
export async function getUserAllAds() {
  const res = await api.get("/ads/getUserAd");
  return res.data;
}

/* ALL ADS */
export async function getAllAds(page: number, limit: number) {
  const res = await api.get("/ads/getAll", {
    params: { page, limit },
  });
  return res.data;
}

/* DELETE AD */
export async function deleteAdById(id: string) {
  const res = await api.post(`/ads/delete/${id}`);
  return res.data;
}

/* UPDATE AD */
export async function updateAd(id: string, data: object) {
  const res = await api.post(`/ads/update/${id}`, data);
  return res.data;
}
