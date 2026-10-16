import { z } from "zod";
export { profileSchema as userSchema } from "@/features/auth/schemas/auth.schema";
export const avatarSchema = z
  .instanceof(File)
  .refine((file) => file.type === "image/jpeg", "Chỉ chấp nhận ảnh JPEG.")
  .refine((file) => file.size <= 2 * 1024 * 1024, "Ảnh tối đa 2 MB.");
