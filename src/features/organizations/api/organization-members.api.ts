import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Organization, PaginatedOrganizationMembers } from "../types";

export const organizationMembersApi = {
  leave: async (organizationId: string) => {
    await api.post<void>(`/organizations/${organizationId}/members/leave`);
  },
  remove: async (organizationId: string, memberId: string) => {
    await api.delete<void>(
      `/organizations/${organizationId}/members/${memberId}`,
    );
  },
  list: async (
    organizationId: string,
    page = 1,
    limit = 20,
    signal?: AbortSignal,
  ) =>
    (
      await api.get<ApiResponse<PaginatedOrganizationMembers>>(
        `/organizations/${organizationId}/members`,
        { params: { page, limit }, signal },
      )
    ).data.data,
};

export function useLeaveOrganization(
  organization: Organization,
  onLeft: () => void,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => organizationMembersApi.leave(organization.id),
    onSuccess: async () => {
      await Promise.all([
        client.cancelQueries({ queryKey: ["organizations"] }),
        client.cancelQueries({ queryKey: ["invitations", organization.id] }),
      ]);
      onLeft();
      client.removeQueries({
        queryKey: ["organizations", "detail", organization.slug],
      });
      for (const key of ["members", "roles", "permission-catalog"])
        client.removeQueries({
          queryKey: ["organizations", key, organization.id],
        });
      client.removeQueries({ queryKey: ["invitations", organization.id] });
      toast.success("Đã rời tổ chức.");
      await client.invalidateQueries({ queryKey: ["organizations", "list"] });
    },
  });
}

export function useRemoveOrganizationMember(organizationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      organizationMembersApi.remove(organizationId, memberId),
    onSuccess: async () => {
      toast.success("Đã xóa thành viên khỏi tổ chức.");
      await client.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useOrganizationMembers(organizationId: string, page: number) {
  return useQuery({
    queryKey: ["organizations", "members", organizationId, page],
    queryFn: ({ signal }) =>
      organizationMembersApi.list(organizationId, page, 20, signal),
    staleTime: 0,
  });
}
