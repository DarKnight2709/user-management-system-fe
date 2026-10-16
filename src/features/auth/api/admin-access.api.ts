import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usersApi } from "@/features/users/api/users.api";

export function useAdminAccess() {
  return useQuery({
    queryKey: ["auth", "admin-access"],
    queryFn: async () => {
      try {
        await usersApi.list(1, 1);
        return true;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 403)
          return false;
        throw error;
      }
    },
    staleTime: 0,
    retry: false,
  });
}
