import { api } from "@/lib/axios.ts";

export const getUser = async () => {
  const response = await api.get("/me");

  return response.data.data;
};
