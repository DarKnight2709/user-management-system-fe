import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { CreateOrganizationInput, Organization } from "../types";

export const organizationsApi = {
  create: async (input: CreateOrganizationInput) =>
    (await api.post<ApiResponse<Organization>>("/organizations", input)).data
      .data,
};

export function useCreateOrganization() {
  return useMutation({ mutationFn: organizationsApi.create });
}
