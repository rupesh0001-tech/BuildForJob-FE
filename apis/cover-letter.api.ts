import api from "./axiosInstance";

export const createCoverLetter = async (data: any) => {
  const response = await api.post("/cover-letters", data);
  return response.data;
};

export const getAllCoverLetters = async () => {
  const response = await api.get("/cover-letters");
  return response.data;
};

export const getCoverLetterById = async (id: string) => {
  const response = await api.get(`/cover-letters/${id}`);
  return response.data;
};

export const updateCoverLetter = async (id: string, data: any) => {
  const response = await api.put(`/cover-letters/${id}`, data);
  return response.data;
};

export const deleteCoverLetter = async (id: string) => {
  const response = await api.delete(`/cover-letters/${id}`);
  return response.data;
};
