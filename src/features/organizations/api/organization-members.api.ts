import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { PaginatedOrganizationMembers } from "../types";

export const organizationMembersApi = {
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

export function useOrganizationMembers(organizationId: string, page: number) {
  return useQuery({
    queryKey: ["organizations", "members", organizationId, page],
    queryFn: ({ signal }) =>
      organizationMembersApi.list(organizationId, page, 20, signal),
    staleTime: 0,
  });
}
