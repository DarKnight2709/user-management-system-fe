import { MutationCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { errorMessage } from "./errors";
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => toast.error(errorMessage(error)),
  }),
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: (count, error) =>
        count < 1 &&
        !(
          axios.isAxiosError(error) &&
          (error.response?.status || 0) >= 400 &&
          (error.response?.status || 0) < 500
        ),
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
