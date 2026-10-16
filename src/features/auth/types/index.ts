import type { z } from "zod";
import type {
  loginSchema,
  registerSchema,
  changePasswordSchema,
} from "../schemas/auth.schema";
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
