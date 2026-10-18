import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  InvitationDelivery,
  InvitationLink,
  PaginatedInvitations,
  AcceptedInvitation,
} from "../types";

const base = (organizationId: string) =>
  `/organizations/${organizationId}/invitations`;
export const invitationsApi = {
  list: async (organizationId: string, page: number, signal?: AbortSignal) =>
    (
      await api.get<ApiResponse<PaginatedInvitations>>(base(organizationId), {
        params: { page, limit: 20 },
        signal,
      })
    ).data.data,
  create: async (organizationId: string, email: string) =>
    (
      await api.post<ApiResponse<InvitationDelivery>>(base(organizationId), {
        email,
      })
    ).data.data,
  resend: async (organizationId: string, id: string) =>
    (
      await api.post<ApiResponse<InvitationDelivery>>(
        `${base(organizationId)}/${id}/resend`,
      )
    ).data.data,
  link: async (organizationId: string, id: string) =>
    (
      await api.post<ApiResponse<InvitationLink>>(
        `${base(organizationId)}/${id}/link`,
      )
    ).data.data,
  revoke: async (organizationId: string, id: string) => {
    await api.delete<void>(`${base(organizationId)}/${id}`);
  },
  accept: async (token: string) =>
    (
      await api.post<ApiResponse<AcceptedInvitation>>("/invitations/accept", {
        token,
      })
    ).data.data,
};
export function useInvitations(organizationId: string, page: number) {
  return useQuery({
    queryKey: ["invitations", organizationId, page],
    queryFn: ({ signal }) => invitationsApi.list(organizationId, page, signal),
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}
export function useCreateInvitation(organizationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => invitationsApi.create(organizationId, email),
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ["invitations", organizationId],
      });
    },
  });
}
export function useAcceptInvitation(token: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => invitationsApi.accept(token),
    gcTime: 0,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["organizations"] }),
        client.invalidateQueries({ queryKey: ["invitations"] }),
      ]);
    },
  });
}
