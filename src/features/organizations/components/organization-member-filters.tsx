import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorNotice } from "@/components/feedback";
import { rolesApi } from "@/features/roles/api/roles.api";
import type { OrganizationRole } from "@/features/roles/types";
import { useOrganizationAccess } from "../hooks/use-organization-access";
import type { OrganizationMemberFilters } from "../types";

export function OrganizationMemberFiltersForm({
  organizationId,
  disabled,
  onApply,
}: {
  organizationId: string;
  disabled: boolean;
  onApply: (filters: OrganizationMemberFilters) => void;
}) {
  const access = useOrganizationAccess();
  const canReadRoles = access.can("ORGANIZATION_ROLE", "read");
  const roles = useQuery({
    queryKey: ["organizations", "roles", organizationId, "filter-options"],
    enabled: canReadRoles,
    queryFn: async ({ signal }) => {
      const items: OrganizationRole[] = [];
      for (let page = 1; page <= 1_000_000; page += 1) {
        const result = await rolesApi.list(organizationId, page, signal);
        items.push(...result.items);
        if (!result.items.length || page * result.limit >= result.total) break;
      }
      return items;
    },
    staleTime: 0,
  });
  return (
    <form
      className="panel space-y-4"
      onReset={() => onApply({})}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const search = String(data.get("search") ?? "").trim();
        const roleId = canReadRoles && roles.isSuccess
          ? String(data.get("roleId") ?? "") : "";
        onApply({ ...(search ? { search } : {}), ...(roleId ? { roleId } : {}) });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Tìm thành viên</span>
          <Input name="search" maxLength={100} placeholder="Tên hoặc tên người dùng…" />
        </label>
        {canReadRoles && (
          <label className="space-y-2 text-sm">
            <span>Vai trò</span>
            <select name="roleId" disabled={!roles.isSuccess}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm disabled:opacity-50">
              <option value="">{roles.isPending ? "Đang tải vai trò…" : "Tất cả vai trò"}</option>
              {roles.data?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </label>
        )}
      </div>
      {canReadRoles && roles.isError && <ErrorNotice error={roles.error} retry={() => { void roles.refetch(); }} />}
      <div className="flex gap-2">
        <Button type="submit" disabled={disabled}>Tìm kiếm</Button>
        <Button type="reset" variant="outline" disabled={disabled}>Xóa bộ lọc</Button>
      </div>
    </form>
  );
}
