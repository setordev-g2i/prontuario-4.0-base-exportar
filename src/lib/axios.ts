import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
      } else if (status === 403) {
        toast.error("Você não tem permissão para esta ação.");
      } else if (status === 404) {
        toast.error("Recurso não encontrado.");
      } else if (status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else if (data?.error?.message) {
        toast.error(data.error.message);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
