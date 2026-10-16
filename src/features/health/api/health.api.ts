import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Liveness, Readiness } from "../types";
export function useHealth() {
  const live = useQuery({
    queryKey: ["health", "live"],
    queryFn: async () =>
      (await api.get<ApiResponse<Liveness>>("/health/live")).data.data,
  });
  const ready = useQuery({
    queryKey: ["health", "ready"],
    queryFn: async () =>
      (await api.get<ApiResponse<Readiness>>("/health/ready")).data.data,
  });
  const greeting = useQuery({
    queryKey: ["health", "greeting"],
    queryFn: async () => (await api.get<ApiResponse<string>>("/")).data.data,
  });
  return { live, ready, greeting };
}
