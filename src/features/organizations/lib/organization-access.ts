import type { EffectivePermission, OrganizationAccess } from "../types/access";
import type { OrganizationMember } from "../types";
export function hasPermission(
  permissions: EffectivePermission[],
  resource: string,
  action: string,
): boolean {
  return permissions.some(
    (permission) =>
      permission.resource === resource && permission.action === action,
  );
}
export function memberLevel(roles: { name: string }[]): number {
  return Math.max(
    0,
    ...roles.map((role) =>
      role.name === "ADMIN" ? 2 : role.name === "MEMBER" ? 0 : 1,
    ),
  );
}

export function canManageRolePermissions(
  access: OrganizationAccess,
  permissions: Pick<EffectivePermission, "resource" | "action">[],
): boolean {
  return (
    access.isOwner ||
    permissions.every((permission) =>
      access.can(permission.resource, permission.action),
    )
  );
}

export function canRemoveMember(
  access: OrganizationAccess,
  actor: OrganizationMember | null,
  target: OrganizationMember,
  ownerId: string,
): boolean {
  return (
    access.can("ORGANIZATION_MEMBER", "remove") &&
    !target.isOwner &&
    target.user.id !== ownerId &&
    (access.isOwner ||
      (actor !== null && memberLevel(actor.roles) > memberLevel(target.roles)))
  );
}
