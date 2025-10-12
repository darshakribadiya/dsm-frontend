import api from "@/lib/api";

export const sendResetOtp = (payload) => api.post("/send-reset-otp",payload);
export const resetPasswordOtp = (payload) => api.post("/reset-password-otp",payload);
export const forgotPassword = (payload) => api.post("/forgot-password",payload);
export const resetPasswordLink = (payload) => api.post("/reset-password-link",payload);
