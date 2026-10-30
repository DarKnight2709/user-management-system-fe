import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useMe } from "@/features/auth/api/auth.api";
import type { ApiResponse } from "@/types/api";
import type { AuditPage, AuditQuery } from "../types";

export function useAuditLogs(query: AuditQuery, organizationId?: string) {
  const me = useMe();
  return useQuery({
    queryKey: ["audit-logs", me.data?.id, organizationId ?? "platform", query],
    enabled: me.isSuccess,
    queryFn: async ({ signal }) => {
      // Organization scope is set by the URL, never by a filter.
      const { organizationId: filterOrganization, ...shared } = query;
      return (await api.get<ApiResponse<AuditPage>>(
        organizationId ? `/organizations/${encodeURIComponent(organizationId)}/audit-logs` : "/audit-logs",
        { signal, params: organizationId ? shared : { ...shared, organizationId: filterOrganization } },
      )).data.data;
    },
    gcTime: 0,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
