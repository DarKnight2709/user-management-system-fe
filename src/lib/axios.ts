import axios, { AxiosHeaders } from "axios";
import { session } from "./session";
import type { ApiResponse } from "@/types/api";
import type { Session } from "@/types/session";

const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
};
export const api = axios.create(config);
const tokenApi = axios.create(config);
let refreshPromise: Promise<Session> | null = null;
export function refreshSession(): Promise<Session> {
  if (refreshPromise) return refreshPromise;
  const original = session.get();
  if (!original) return Promise.reject(new Error("Vui lòng đăng nhập lại."));
  refreshPromise = tokenApi
    .post<ApiResponse<Session>>("/auth/refresh-token", {
      refreshToken: original.refreshToken,
    })
    .then(({ data }) => {
      if (session.get() !== original)
        throw new Error("Phiên đăng nhập đã thay đổi.");
      session.set(data.data);
      return data.data;
    })
    .catch((error: unknown) => {
      if (session.get() === original) session.set(null);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}
api.interceptors.request.use((request) => {
  const token = session.get()?.accessToken;
  if (token) request.headers.set("Authorization", `Bearer ${token}`);
  return request;
});
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) throw error;
    const request = error.config;
    const isPublic = [
      "/auth/login",
      "/auth/register",
      "/health/live",
      "/health/ready",
      "/",
    ].includes(request.url || "");
    const retried = request.headers.get("X-Auth-Retry") === "1";
    if (
      error.response?.status !== 401 ||
      isPublic ||
      request.url === "/auth/change-password"
    )
      throw error;
    const latest = session.get();
    if (!latest) throw error;
    if (retried) {
      if (request.headers.get("Authorization") === `Bearer ${latest.accessToken}`)
        session.set(null);
      throw error;
    }
    const sentToken = request.headers.get("Authorization");
    const tokens =
      sentToken !== `Bearer ${latest.accessToken}`
        ? latest
        : await refreshSession();
    request.headers = AxiosHeaders.from(request.headers);
    request.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    request.headers.set("X-Auth-Retry", "1");
    return api(request);
  },
);
