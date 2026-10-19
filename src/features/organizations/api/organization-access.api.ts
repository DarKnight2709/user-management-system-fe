import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { EffectivePermission } from "../types/access";

export const organizationAccessApi = {
  permissions: async (id: string, signal?: AbortSignal) =>
    (
      await api.get<ApiResponse<EffectivePermission[]>>(
        `/organizations/${id}/me/permissions`,
        { signal },
      )
    ).data.data,
};

export function useOrganizationPermissions(
  organizationId: string,
  userId?: string,
) {
  return useQuery({
    queryKey: ["organizations", "access", organizationId, userId],
    queryFn: ({ signal }) =>
      organizationAccessApi.permissions(organizationId, signal),
    enabled: Boolean(userId),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
  });
}
