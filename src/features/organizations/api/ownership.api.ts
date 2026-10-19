import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { transferOwnershipSchema } from "../schemas/ownership.schema";

export interface OwnershipTransfer {
  id: string;
  ownerId: string;
  previousOwnerId: string;
}
export const ownershipApi = {
  transfer: async (organizationId: string, memberId: string) =>
    (
      await api.post<ApiResponse<OwnershipTransfer>>(
        `/organizations/${organizationId}/transfer-ownership`,
        transferOwnershipSchema.parse({ memberId }),
      )
    ).data.data,
};

export function useTransferOwnership(organizationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      ownershipApi.transfer(organizationId, memberId),
    onSuccess: async () => {
      toast.success("Đã chuyển quyền sở hữu tổ chức.");
      await Promise.all([
        client.invalidateQueries({ queryKey: ["organizations"] }),
        client.invalidateQueries({ queryKey: ["invitations", organizationId] }),
      ]);
    },
  });
}
