import axios from "axios";
import type { Bill, SummaryResponse, UserProfile } from "../types";

const api = axios.create({
  baseURL: "/api"
});

export const getBills = async (): Promise<Bill[]> => {
  const { data } = await api.get<Bill[]>("/bills");
  return data;
};

export const getBillById = async (id: string | number): Promise<Bill> => {
  const { data } = await api.get<Bill>(`/bills/${id}`);
  return data;
};

export const simplifyBill = async (bill: Bill): Promise<SummaryResponse> => {
  const { data } = await api.post<SummaryResponse>("/simplify", {
    billId: bill.id,
    text: bill.text,
    category: bill.category
  });
  return data;
};

export const getRecommendations = async (profile: UserProfile) => {
  const { data } = await api.post<{ recommendations: Bill[] }>("/recommend", profile);
  return data.recommendations;
};

export default api;
