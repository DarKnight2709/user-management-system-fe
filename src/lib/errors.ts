import axios from "axios";
import type { ApiError, ValidationIssue } from "@/types/api";
function issues(errors: ValidationIssue[]): string[] {
  return errors.flatMap((issue) => [
    ...Object.values(issue.messages || {}),
    ...issues(issue.nestedErrors || []),
  ]);
}
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (error.response?.status === 403)
      return "Bạn không có quyền thực hiện thao tác này.";
    const data = error.response?.data;
    if (data?.errors?.length) return issues(data.errors).join("\n");
    if (Array.isArray(data?.message)) return data.message.join("\n");
    if (typeof data?.message === "string") return data.message;
    return "Không kết nối được API. Kiểm tra backend và cấu hình môi trường.";
  }
  return error instanceof Error ? error.message : "Đã xảy ra lỗi.";
}
