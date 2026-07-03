import axiosInstance from "./axiosInstance";

export const getCompanies = async () => {
  const response = await axiosInstance.get("/companies");
  return response.data;
};

export const createCompany = async (name: string) => {
  const response = await axiosInstance.post("/companies", { name });
  return response.data;
};
