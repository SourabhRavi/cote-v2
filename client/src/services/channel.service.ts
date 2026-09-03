import { api } from "@/lib/axios.ts";

export const getChannels = async () => {
  const response = await api.get("/channels");

  return response.data.data;
};
