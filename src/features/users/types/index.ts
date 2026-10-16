import type { z } from "zod";
import type { profileSchema } from "@/features/auth/schemas/auth.schema";
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
export type UpdateUserInput = z.infer<typeof profileSchema>;
export interface AvatarResponse {
  key: string;
  avatarUrl: string | null;
}
export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
}
