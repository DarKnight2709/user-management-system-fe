import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { usePermissionCatalog, useRoleChange } from "../api/roles.api";
import type { OrganizationRole } from "../types";
import { RoleForm } from "./role-form";

export function RoleEditor({
  organizationId,
  role,
  onClose,
}: {
  organizationId: string;
  role: OrganizationRole | null;
  onClose: () => void;
}) {
  const catalog = usePermissionCatalog(organizationId);
  const change = useRoleChange(organizationId);
  return (
    <section className="panel">
      <h2 className="mb-5 text-lg font-semibold">
        {role ? `Sửa ${role.name}` : "Tạo vai trò mới"}
      </h2>
      {catalog.isPending ? (
        <Skeleton />
      ) : catalog.isError ? (
        <ErrorNotice
          error={catalog.error}
          retry={() => {
            void catalog.refetch();
          }}
        />
      ) : (
        <RoleForm
          role={role}
          permissions={catalog.data}
          pending={change.isPending}
          onCancel={onClose}
          onSubmit={async (input) => {
            try {
              await change.mutateAsync(
                role
                  ? { action: "update", id: role.id, input }
                  : { action: "create", input },
              );
              toast.success("Đã lưu vai trò.");
              onClose();
            } catch {
              return;
            }
          }}
        />
      )}
      {change.isError && <ErrorNotice error={change.error} />}
    </section>
  );
}
