import { useState } from "react";
import { toast } from "sonner";
import { useMe } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import type { OrganizationMember } from "@/features/organizations/types";
import { useRoles, useRoleChange } from "../api/roles.api";
import { useOrganizationAccess } from "@/features/organizations/hooks/use-organization-access";
import { canManageRolePermissions } from "@/features/organizations/lib/organization-access";

export function MemberRoleEditor({
  organizationId,
  ownerId,
  member,
  onClose,
}: {
  organizationId: string;
  ownerId: string;
  member: OrganizationMember;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const roles = useRoles(organizationId, page);
  const me = useMe();
  const change = useRoleChange(organizationId);
  const isOwner = me.data?.id === ownerId;
  const access = useOrganizationAccess();
  return (
    <section className="panel">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Vai trò của @{member.user.username}
          </h2>
          <p className="subtitle">
            Có thể gán nhiều vai trò. Chỉ chủ sở hữu được gán hoặc thu hồi
            ADMIN.
          </p>
        </div>
        <Button variant="outline" disabled={change.isPending} onClick={onClose}>
          Đóng
        </Button>
      </header>
      {roles.isPending || me.isPending ? (
        <Skeleton />
      ) : roles.isError ? (
        <ErrorNotice
          error={roles.error}
          retry={() => {
            void roles.refetch();
          }}
        />
      ) : me.isError ? (
        <ErrorNotice
          error={me.error}
          retry={() => {
            void me.refetch();
          }}
        />
      ) : (
        <>
          <div className="space-y-3">
            {roles.data.items
              .filter((role) => role.name.toUpperCase() !== "OWNER")
              .map((role) => {
                const assigned = member.roles.some(
                  (current) => current.id === role.id,
                );
                const blocked =
                  change.isPending ||
                  (role.name.toUpperCase() === "ADMIN" && !isOwner);
                const permitted =
                  access.can(
                    "ORGANIZATION_ROLE",
                    assigned ? "revoke" : "assign",
                  ) &&
                  (isOwner ||
                    (role.name.toUpperCase() !== "ADMIN" &&
                      canManageRolePermissions(access, role.permissions)));
                return (
                  <div
                    key={role.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {assigned ? "Đã gán" : "Chưa gán"}
                        {role.name.toUpperCase() === "ADMIN" && !isOwner
                          ? " · Chỉ chủ sở hữu có thể thay đổi"
                          : ""}
                      </p>
                    </div>
                    {permitted &&
                      (assigned ? (
                        <ConfirmDialog
                          title="Thu hồi vai trò"
                          description={`Thu hồi ${role.name} của @${member.user.username}? Thành viên có thể mất quyền truy cập tương ứng.`}
                          pending={blocked}
                          onConfirm={() =>
                            change.mutate(
                              {
                                action: "revoke",
                                memberId: member.id,
                                roleId: role.id,
                              },
                              {
                                onSuccess: () =>
                                  toast.success("Đã thu hồi vai trò."),
                              },
                            )
                          }
                        />
                      ) : (
                        <Button
                          variant="outline"
                          disabled={blocked}
                          onClick={() =>
                            change.mutate(
                              {
                                action: "assign",
                                memberId: member.id,
                                roleId: role.id,
                              },
                              {
                                onSuccess: () =>
                                  toast.success("Đã gán vai trò."),
                              },
                            )
                          }
                        >
                          Gán vai trò
                        </Button>
                      ))}
                  </div>
                );
              })}
            {!roles.data.items.length && (
              <p className="text-sm text-slate-500">
                Không có vai trò trên trang này.
              </p>
            )}
          </div>
          <nav
            aria-label="Chọn trang vai trò để gán"
            className="mt-5 flex items-center justify-between gap-3"
          >
            <p className="text-sm text-slate-500">
              Trang {page} /{" "}
              {Math.max(1, Math.ceil(roles.data.total / roles.data.limit))}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1 || roles.isFetching || change.isPending}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                disabled={
                  page >= 1_000_000 ||
                  page * roles.data.limit >= roles.data.total ||
                  roles.isFetching ||
                  change.isPending
                }
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          </nav>
        </>
      )}
      {change.isError && <ErrorNotice error={change.error} />}
    </section>
  );
}
