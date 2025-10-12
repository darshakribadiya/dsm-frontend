import api from "@/lib/api";

export const acceptInvitation = (payload) => api.post("/accept-invitation",payload);
export const sendInvitation = (payload) => api.post("/send-invitation",payload);
