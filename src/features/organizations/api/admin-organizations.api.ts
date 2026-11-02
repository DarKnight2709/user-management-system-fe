import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AdminOrganizationStatus, ManageableOrganizationStatus, PaginatedAdminOrganizations } from "../types/admin";

export interface AdminOrganizationFilters {
  search?: string;
  status?: AdminOrganizationStatus;
}

export const adminOrganizationsApi = {
  list: async (page: number, filters: AdminOrganizationFilters, signal?: AbortSignal) =>
    (await api.get<ApiResponse<PaginatedAdminOrganizations>>("/admin/organizations", {
      params: { page, limit: 20, ...filters }, signal,
    })).data.data,
  updateStatus: async (id: string, status: ManageableOrganizationStatus) =>
    (await api.patch<ApiResponse<unknown>>(`/admin/organizations/${id}/status`, { status })).data.data,
  delete: async (id: string) => {
    await api.delete<void>(`/organizations/${id}`);
  },
};

export function useAdminOrganizations(page: number, filters: AdminOrganizationFilters) {
  return useQuery({
    queryKey: ["admin", "organizations", page, filters],
    queryFn: ({ signal }) => adminOrganizationsApi.list(page, filters, signal),
    staleTime: 0,
  });
}

export function useUpdateAdminOrganizationStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ManageableOrganizationStatus }) =>
      adminOrganizationsApi.updateStatus(id, status),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["admin", "organizations"] });
      await client.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useDeleteAdminOrganization() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminOrganizationsApi.delete(id),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["admin", "organizations"] });
      await client.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
