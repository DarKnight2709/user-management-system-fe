export const auditActions = [
  "audit.log.viewed", "user.registered", "user.profile.updated", "user.deleted",
  "user.password.changed", "user.avatar.updated", "organization.member_role.assigned",
  "organization.member_role.revoked", "organization.role.created", "organization.role.updated",
  "organization.role.deleted", "organization.created", "organization.updated", "organization.deleted",
  "organization.ownership.transferred", "organization.member.removed", "organization.member.left",
  "organization.invitation.created", "organization.invitation.resend_requested",
  "organization.invitation.revoked", "organization.invitation.accepted",
] as const;

export const auditTargetTypes = ["USER", "ORGANIZATION", "ORGANIZATION_MEMBER", "ROLE", "ORGANIZATION_INVITATION", "AUDIT_LOG"] as const;

export const organizationAuditActions = auditActions.filter(
  (action) => action === "audit.log.viewed" || action.startsWith("organization."),
);

export interface AuditFilters {
  action?: string;
  actorId?: string;
  targetId?: string;
  targetType?: string;
  organizationId?: string;
}

export interface AuditQuery extends AuditFilters { page: number; limit: number }

export interface AuditEvent {
  eventId: string;
  schemaVersion: number;
  action: string;
  actorId: string | null;
  actorType: string;
  targetId: string;
  targetType: string;
  organizationId: string | null;
  requestId: string;
  occurredAt: string;
  recordedAt: string;
  payload: unknown;
}

export interface AuditPage {
  items: AuditEvent[];
  total: number;
  page: number;
  limit: number;
}
