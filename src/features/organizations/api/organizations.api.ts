import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  CreateOrganizationInput,
  CreatedOrganization,
  Organization,
  PaginatedOrganizations,
  UpdateOrganizationInput,
} from "../types";
import { resolveOrganizationId } from "./resolve-organization";

export const organizationsApi = {
  update: async (id: string, input: UpdateOrganizationInput) =>
    (await api.patch<ApiResponse<Organization>>(`/organizations/${id}`, input))
      .data.data,
  list: async (page = 1, limit = 20, signal?: AbortSignal) =>
    (
      await api.get<ApiResponse<PaginatedOrganizations>>("/organizations", {
        params: { page, limit },
        signal,
      })
    ).data.data,
  get: async (id: string, signal?: AbortSignal) =>
    (
      await api.get<ApiResponse<Organization>>(`/organizations/${id}`, {
        signal,
      })
    ).data.data,
  create: async (input: CreateOrganizationInput) =>
    (await api.post<ApiResponse<CreatedOrganization>>("/organizations", input))
      .data.data,
};

export function useCreateOrganization() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: organizationsApi.create,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useUpdateOrganization(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateOrganizationInput) =>
      organizationsApi.update(id, input),
    onSuccess: async (organization) => {
      const key = ["organizations", "detail", organization.slug];
      await client.cancelQueries({ queryKey: key });
      client.setQueryData<Organization>(key, organization);
      await client.invalidateQueries({ queryKey: ["organizations", "list"] });
    },
  });
}

export function useOrganizations(page: number) {
  return useQuery({
    queryKey: ["organizations", "list", page],
    queryFn: () => organizationsApi.list(page),
    staleTime: 0,
  });
}

export function useOrganization(slug: string) {
  const client = useQueryClient();
  return useQuery({
    queryKey: ["organizations", "detail", slug],
    queryFn: async ({ signal }) => {
      const cached = client
        .getQueriesData<PaginatedOrganizations>({
          queryKey: ["organizations", "list"],
        })
        .flatMap(([, data]) => data?.items || [])
        .find((organization) => organization.slug === slug);
      const id =
        cached?.id ||
        (await resolveOrganizationId(slug, (page) =>
          organizationsApi.list(page, 100, signal),
        ));
      const organization = await organizationsApi.get(id, signal);
      if (organization.slug !== slug)
        throw new Error(
          "Đường dẫn tổ chức đã thay đổi. Vui lòng mở lại từ danh sách tổ chức.",
        );
      return organization;
    },
    retry: false,
    staleTime: 0,
  });
}
