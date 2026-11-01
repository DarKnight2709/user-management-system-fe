import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorNotice } from "@/components/feedback";
import { useRoleFilterPermissions } from "../api/roles.api";
import type { OrganizationRoleFilters } from "../types";

const selectClass = "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm disabled:opacity-50";

export function RoleFiltersForm({ organizationId, disabled, onApply }: {
  organizationId: string;
  disabled: boolean;
  onApply: (filters: OrganizationRoleFilters) => void;
}) {
  const permissions = useRoleFilterPermissions(organizationId);
  return (
    <form className="panel space-y-4" onReset={() => onApply({})}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const search = String(data.get("search") ?? "").trim();
        const type = String(data.get("type") ?? "") as OrganizationRoleFilters["type"];
        const permissionId = String(data.get("permissionId") ?? "");
        onApply({ ...(search ? { search } : {}), ...(type ? { type } : {}), ...(permissionId ? { permissionId } : {}) });
      }}>
      <fieldset disabled={disabled} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <legend className="mb-4 font-semibold">Lọc vai trò</legend>
        <label className="space-y-2 text-sm"><span>Tên vai trò</span>
          <Input name="search" maxLength={100} placeholder="Nhập tên vai trò…" />
        </label>
        <label className="space-y-2 text-sm"><span>Loại vai trò</span>
          <select name="type" className={selectClass}>
            <option value="">Tất cả loại vai trò</option>
            <option value="BUILT_IN">Mặc định</option>
            <option value="CUSTOM">Tùy chỉnh</option>
          </select>
        </label>
        <label className="space-y-2 text-sm"><span>Quyền của vai trò</span>
          <select name="permissionId" disabled={!permissions.isSuccess} className={selectClass}>
            <option value="">{permissions.isPending ? "Đang tải quyền…" : "Tất cả quyền"}</option>
            {permissions.data?.map((permission) => <option key={permission.id} value={permission.id}>
              {permission.resource}:{permission.action}
            </option>)}
          </select>
        </label>
      </fieldset>
      {permissions.isError && <ErrorNotice error={permissions.error} retry={() => { void permissions.refetch(); }} />}
      <div className="flex gap-2">
        <Button type="submit" disabled={disabled}>Áp dụng</Button>
        <Button type="reset" variant="outline" disabled={disabled}>Xóa bộ lọc</Button>
      </div>
    </form>
  );
}
