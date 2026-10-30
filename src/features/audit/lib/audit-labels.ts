import type { auditActions, auditTargetTypes } from "../types";

const actionLabels: Record<(typeof auditActions)[number], string> = {
  "audit.log.viewed": "Xem nhật ký hoạt động",
  "user.registered": "Đăng ký tài khoản",
  "user.profile.updated": "Cập nhật hồ sơ",
  "user.deleted": "Xóa tài khoản",
  "user.password.changed": "Đổi mật khẩu",
  "user.avatar.updated": "Cập nhật ảnh đại diện",
  "organization.member_role.assigned": "Gán vai trò cho thành viên",
  "organization.member_role.revoked": "Thu hồi vai trò của thành viên",
  "organization.role.created": "Tạo vai trò",
  "organization.role.updated": "Cập nhật vai trò",
  "organization.role.deleted": "Xóa vai trò",
  "organization.created": "Tạo tổ chức",
  "organization.updated": "Cập nhật tổ chức",
  "organization.deleted": "Xóa tổ chức",
  "organization.ownership.transferred": "Chuyển quyền sở hữu tổ chức",
  "organization.member.removed": "Xóa thành viên khỏi tổ chức",
  "organization.member.left": "Rời tổ chức",
  "organization.invitation.created": "Tạo lời mời",
  "organization.invitation.resend_requested": "Yêu cầu gửi lại lời mời",
  "organization.invitation.revoked": "Thu hồi lời mời",
  "organization.invitation.accepted": "Chấp nhận lời mời",
};

const targetLabels: Record<(typeof auditTargetTypes)[number], string> = {
  USER: "Người dùng",
  ORGANIZATION: "Tổ chức",
  ORGANIZATION_MEMBER: "Thành viên tổ chức",
  ROLE: "Vai trò",
  ORGANIZATION_INVITATION: "Lời mời tổ chức",
  AUDIT_LOG: "Nhật ký hoạt động",
};

// Preserve unknown codes so events added by newer backend versions stay readable.
export const auditActionLabel = (code: string): string =>
  Object.hasOwn(actionLabels, code) ? actionLabels[code as keyof typeof actionLabels] : code;

export const auditTargetLabel = (code: string): string =>
  Object.hasOwn(targetLabels, code) ? targetLabels[code as keyof typeof targetLabels] : code;

export const auditActorLabel = (code: string): string =>
  code === "USER" ? "Người dùng" : code === "ANONYMOUS" ? "Ẩn danh" : code;
