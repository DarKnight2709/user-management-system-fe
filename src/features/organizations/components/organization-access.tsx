import type { ReactNode } from "react";
import { useMe } from "@/features/auth/api/auth.api";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { hasPermission } from "../lib/organization-access";
import { useOrganizationPermissions } from "../api/organization-access.api";
import { OrganizationAccessContext } from "../context/organization-access.context";
import type { Organization } from "../types";

export function OrganizationAccessProvider({
  organization,
  children,
}: {
  organization: Organization;
  children: ReactNode;
}) {
  const me = useMe();
  const permissions = useOrganizationPermissions(
    organization.id,
    me.isSuccess ? me.data.id : undefined,
  );
  if (me.isError)
    return (
      <ErrorNotice
        error={me.error}
        retry={() => {
          void me.refetch();
        }}
      />
    );
  if (permissions.isError)
    return (
      <ErrorNotice
        error={permissions.error}
        retry={() => {
          void permissions.refetch();
        }}
      />
    );
  if (me.isPending || permissions.isPending) return <Skeleton />;
  const isOwner = me.data.id === organization.ownerId;
  return (
    <OrganizationAccessContext.Provider
      value={{
        userId: me.data.id,
        isOwner,
        can: (resource, action) =>
          isOwner || hasPermission(permissions.data, resource, action),
      }}
    >
      {permissions.isFetching && <Skeleton />}
      <div hidden={permissions.isFetching}>{children}</div>
    </OrganizationAccessContext.Provider>
  );
}
