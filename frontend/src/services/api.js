import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 15000,
});

export const fetchHealth = () => API.get("/health");
export const fetchDashboardSummary = () => API.get("/dashboard/summary");
export const fetchRecentCalls = () => API.get("/calls");
export const fetchConversation = (callSid) =>
  API.get(`/conversation/${callSid}`);
export const makeOutboundCall = (phoneNumber) =>
  API.post("/make-call", { phone_number: phoneNumber });

export default API;
