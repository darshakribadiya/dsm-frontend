import api from "@/lib/api";

export const getAcademicSessions = () => api.get("/admin/academic-sessions");
export const createAcademicSession = (data) => api.post("/admin/academic-sessions", data);
export const updateAcademicSession = (id, data) => api.put(`/admin/academic-sessions/${id}`, data);
export const deleteAcademicSession = (id) => api.delete(`/admin/academic-sessions/${id}`);
