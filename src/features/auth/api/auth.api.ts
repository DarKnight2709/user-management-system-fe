import { useMutation, useQuery } from "@tanstack/react-query";
import { api, refreshSession } from "@/lib/axios";
import { session } from "@/lib/session";
import { queryClient } from "@/lib/query-client";
import type { ApiResponse } from "@/types/api";
import type { CurrentUser, Session } from "@/types/session";
import type { ChangePasswordInput, LoginInput, RegisterInput } from "../types";
export const authApi = {
  login: async (input: LoginInput) =>
    (await api.post<ApiResponse<Session>>("/auth/login", input)).data.data,
  register: async (input: RegisterInput) => {
    await api.post<ApiResponse<null>>("/auth/register", input);
  },
  me: async () =>
    (await api.get<ApiResponse<CurrentUser>>("/auth/me")).data.data,
  changePassword: async (input: ChangePasswordInput) => {
    await api.post<void>("/auth/change-password", input);
  },
  logout: async (all: boolean) => {
    if (all) await api.post<void>("/auth/logout-all");
    else {
      await refreshSession();
      await api.post<void>("/auth/logout", {
        refreshToken: session.get()?.refreshToken,
      });
    }
  },
};
export function endSession() {
  session.set(null);
  queryClient.clear();
}
export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => {
      queryClient.clear();
      session.set(tokens);
    },
  });
}
export function useRegister() {
  return useMutation({ mutationFn: authApi.register });
}
export function useMe() {
  return useQuery({ queryKey: ["auth", "me"], queryFn: authApi.me });
}
export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: endSession,
  });
}
export function useLogout() {
  return useMutation({ mutationFn: authApi.logout, onSuccess: endSession });
}
