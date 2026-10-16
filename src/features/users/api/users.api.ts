import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  User,
  UpdateUserInput,
  AvatarResponse,
  PaginatedUsers,
} from "../types";
export const usersApi = {
  list: async (page = 1, limit = 20) =>
    (
      await api.get<ApiResponse<PaginatedUsers>>("/users", {
        params: { page, limit },
      })
    ).data.data,
  get: async (id: string) =>
    (await api.get<ApiResponse<User>>(`/users/${id}`)).data.data,
  update: async (input: UpdateUserInput) =>
    (await api.put<ApiResponse<User>>("/users", input)).data.data,
  delete: async (id: string) => {
    await api.delete<void>(`/users/${id}`);
  },
  avatar: async (file: File) => {
    const body = new FormData();
    body.append("avatar", file);
    return (await api.post<ApiResponse<AvatarResponse>>("/users/avatar", body))
      .data.data;
  },
};
export function useUsers(page = 1) {
  return useQuery({
    queryKey: ["users", "list", page],
    queryFn: () => usersApi.list(page),
  });
}
export function useUser(id: string) {
  return useQuery({ queryKey: ["users", id], queryFn: () => usersApi.get(id) });
}
export function useUpdateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: usersApi.update,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["users"] }),
        client.invalidateQueries({ queryKey: ["auth", "me"] }),
      ]);
    },
  });
}
export function useDeleteUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
export function useUploadAvatar() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: usersApi.avatar,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
