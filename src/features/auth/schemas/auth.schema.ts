import { z } from "zod";
const required = z.string().min(1, "Vui lòng nhập thông tin.");
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Email không hợp lệ."));
export const passwordSchema = z
  .string()
  .min(15, "Mật khẩu phải có ít nhất 15 ký tự.")
  .refine(
    (value) => new TextEncoder().encode(value).length <= 72,
    "Mật khẩu tối đa 72 byte UTF-8.",
  );
export const profileSchema = z.object({
  username: required.trim().toLowerCase().pipe(required),
  firstName: required,
  lastName: required,
  email,
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ.")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Ngày sinh không hợp lệ.",
    ),
});
export const loginSchema = z.object({ email, password: required });
export const registerSchema = profileSchema.extend({
  password: passwordSchema,
});
export const changePasswordSchema = z
  .object({ currentPassword: required, newPassword: passwordSchema })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    path: ["newPassword"],
  });
