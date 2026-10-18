import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Email tối đa 254 ký tự.")
    .pipe(z.email("Email không hợp lệ.")),
});
export const invitationTokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
