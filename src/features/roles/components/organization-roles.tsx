import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useRoles, useRoleChange } from "../api/roles.api";
import type { OrganizationRole } from "../types";
import { RoleEditor } from "./role-editor";

export function OrganizationRoles({
  organizationId,
}: {
  organizationId: string;
}) {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<OrganizationRole | null | undefined>(
    undefined,
  );
  const roles = useRoles(organizationId, page);
  const change = useRoleChange(organizationId);
  if (roles.isPending) return <Skeleton />;
  if (roles.isError)
    return (
      <ErrorNotice
        error={roles.error}
        retry={() => {
          void roles.refetch();
        }}
      />
    );
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Vai trò ({roles.data.total})
          </h2>
          <p className="subtitle">Quản lý vai trò và quyền trong tổ chức.</p>
        </div>
        <Button
          disabled={editing !== undefined || change.isPending}
          onClick={() => setEditing(null)}
        >
          <Plus size={16} aria-hidden="true" />
          Tạo vai trò
        </Button>
      </header>
      {editing !== undefined && (
        <RoleEditor
          key={editing?.id || "new"}
          organizationId={organizationId}
          role={editing}
          onClose={() => setEditing(undefined)}
        />
      )}
      {change.isError && <ErrorNotice error={change.error} />}
      <div className="space-y-4">
        {roles.data.items.map((role) => (
          <section key={role.id} className="panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="break-words text-lg font-semibold">
                  {role.name}
                </h3>
                {role.isBuiltIn && (
                  <p className="mt-1 text-xs text-slate-500">
                    Vai trò mặc định · Chỉ xem
                  </p>
                )}
              </div>
              {!role.isBuiltIn && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={editing !== undefined || change.isPending}
                    onClick={() => setEditing(role)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                    Sửa
                  </Button>
                  <ConfirmDialog
                    title="Xóa vai trò"
                    description={`Xóa vai trò ${role.name}? Thành viên sẽ mất quyền do vai trò này cung cấp.`}
                    pending={change.isPending || editing !== undefined}
                    onConfirm={() =>
                      change.mutate(
                        { action: "delete", id: role.id },
                        {
                          onSuccess: () => {
                            toast.success("Đã xóa vai trò.");
                            if (roles.data.items.length === 1 && page > 1)
                              setPage(page - 1);
                          },
                        },
                      )
                    }
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.permissions.length ? (
                role.permissions.map((permission) => (
                  <span
                    key={permission.id}
                    className="break-all rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    title={permission.description || undefined}
                  >
                    {permission.resource}:{permission.action}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">Chưa có quyền.</p>
              )}
            </div>
          </section>
        ))}
        {!roles.data.items.length && (
          <section className="panel text-sm text-slate-500">
            Không có vai trò trên trang này.
          </section>
        )}
      </div>
      <nav
        aria-label="Phân trang vai trò"
        className="flex items-center justify-between gap-3"
      >
        <p className="text-sm text-slate-500">
          Trang {page} /{" "}
          {Math.max(1, Math.ceil(roles.data.total / roles.data.limit))}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1 || roles.isFetching || editing !== undefined}
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
              editing !== undefined
            }
            onClick={() => setPage(page + 1)}
          >
            Sau
          </Button>
        </div>
      </nav>
    </div>
  );
}
