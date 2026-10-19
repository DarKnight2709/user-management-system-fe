import { useCurrentOrganizationMember } from "../api/organization-members.api";
import { canRemoveMember } from "../lib/organization-access";
import type { OrganizationMember } from "../types";
import { useOrganizationAccess } from "./use-organization-access";

export function useMemberActions(organizationId: string, ownerId: string) {
  const access = useOrganizationAccess();
  const actor = useCurrentOrganizationMember(
    organizationId,
    access.userId,
    !access.isOwner && access.can("ORGANIZATION_MEMBER", "remove"),
  );
  return {
    actor,
    canManageRoles:
      access.can("ORGANIZATION_ROLE", "read") &&
      (access.can("ORGANIZATION_ROLE", "assign") ||
        access.can("ORGANIZATION_ROLE", "revoke")),
    canRemove: (target: OrganizationMember) =>
      canRemoveMember(
        access,
        !actor.isFetching && !actor.isError ? actor.data || null : null,
        target,
        ownerId,
      ),
  };
}
