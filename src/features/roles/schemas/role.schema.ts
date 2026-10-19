import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z][A-Z0-9_]{0,49}$/,
      "Tên bắt đầu bằng chữ cái, tối đa 50 chữ cái, số hoặc dấu gạch dưới.",
    )
    .refine(
      (name) => !["OWNER", "ADMIN", "MEMBER"].includes(name),
      "Không sử dụng tên vai trò mặc định OWNER, ADMIN hoặc MEMBER.",
    ),
  permissionIds: z
    .array(z.uuid())
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Không chọn quyền trùng lặp.",
    ),
});
