import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  OrganizationPermission,
  OrganizationRole,
  PaginatedRoles,
  RoleInput,
  UpdateRoleInput,
} from "../types";

const base = (organizationId: string) =>
  `/organizations/${organizationId}/roles`;
export const rolesApi = {
  list: async (organizationId: string, page: number, signal?: AbortSignal) =>
    (
      await api.get<ApiResponse<PaginatedRoles>>(base(organizationId), {
        params: { page, limit: 20 },
        signal,
      })
    ).data.data,
  catalog: async (organizationId: string, signal?: AbortSignal) =>
    (
      await api.get<ApiResponse<OrganizationPermission[]>>(
        `${base(organizationId)}/permissions`,
        { signal },
      )
    ).data.data,
  create: async (organizationId: string, input: RoleInput) =>
    (await api.post<ApiResponse<OrganizationRole>>(base(organizationId), input))
      .data.data,
  update: async (organizationId: string, id: string, input: UpdateRoleInput) =>
    (
      await api.patch<ApiResponse<OrganizationRole>>(
        `${base(organizationId)}/${id}`,
        input,
      )
    ).data.data,
  delete: async (organizationId: string, id: string) => {
    await api.delete<void>(`${base(organizationId)}/${id}`);
  },
  assign: async (organizationId: string, memberId: string, roleId: string) => {
    await api.put<void>(
      `/organizations/${organizationId}/members/${memberId}/roles/${roleId}`,
    );
  },
  revoke: async (organizationId: string, memberId: string, roleId: string) => {
    await api.delete<void>(
      `/organizations/${organizationId}/members/${memberId}/roles/${roleId}`,
    );
  },
};
export function useRoles(organizationId: string, page: number) {
  return useQuery({
    queryKey: ["organizations", "roles", organizationId, page],
    queryFn: ({ signal }) => rolesApi.list(organizationId, page, signal),
    staleTime: 0,
  });
}
export function usePermissionCatalog(organizationId: string) {
  return useQuery({
    queryKey: ["organizations", "permission-catalog", organizationId],
    queryFn: ({ signal }) => rolesApi.catalog(organizationId, signal),
    staleTime: 0,
  });
}
type RoleChange =
  | { action: "create"; input: RoleInput }
  | { action: "update"; id: string; input: UpdateRoleInput }
  | { action: "delete"; id: string }
  | { action: "assign" | "revoke"; memberId: string; roleId: string };
export function useRoleChange(organizationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (change: RoleChange) => {
      switch (change.action) {
        case "create":
          await rolesApi.create(organizationId, change.input);
          break;
        case "update":
          await rolesApi.update(organizationId, change.id, change.input);
          break;
        case "delete":
          await rolesApi.delete(organizationId, change.id);
          break;
        case "assign":
          await rolesApi.assign(organizationId, change.memberId, change.roleId);
          break;
        case "revoke":
          await rolesApi.revoke(organizationId, change.memberId, change.roleId);
          break;
      }
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
