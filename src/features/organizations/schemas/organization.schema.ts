import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên tổ chức.")
    .max(100, "Tên tổ chức tối đa 100 ký tự."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug phải có ít nhất 3 ký tự.")
    .max(63, "Slug tối đa 63 ký tự.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ gồm chữ cái a–z, số và dấu gạch nối đơn giữa các nhóm.",
    )
    .refine(
      (slug) => slug !== "create",
      "Slug 'create' được dành cho trang tạo tổ chức. Vui lòng chọn slug khác.",
    ),
});

export const updateOrganizationSchema = createOrganizationSchema.pick({
  name: true,
});
