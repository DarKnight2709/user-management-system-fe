import { z } from "zod";

export const transferOwnershipSchema = z.object({
  memberId: z.uuid("Vui lòng chọn một thành viên hợp lệ."),
});
