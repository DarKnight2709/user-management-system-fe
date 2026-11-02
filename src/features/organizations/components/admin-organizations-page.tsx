import { useState } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useAdminOrganizations, useDeleteAdminOrganization, useUpdateAdminOrganizationStatus, type AdminOrganizationFilters } from "../api/admin-organizations.api";
import type { AdminOrganizationStatus } from "../types/admin";

const statusLabels: Record<AdminOrganizationStatus, string> = {
  ACTIVE: "Đang hoạt động",
  SUSPENDED: "Đã tạm ngưng",
  DELETED: "Đã xóa",
};
const statusStyles: Record<AdminOrganizationStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  SUSPENDED: "bg-amber-50 text-amber-800",
  DELETED: "bg-slate-100 text-slate-600",
};

export function AdminOrganizationsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminOrganizationFilters>({});
  const organizations = useAdminOrganizations(page, filters);
  const updateStatus = useUpdateAdminOrganizationStatus();
  const deleteOrganization = useDeleteAdminOrganization();

  return <div className="space-y-7">
    <header>
      <p className="eyebrow">Quản trị</p>
      <h1>Quản lý tổ chức</h1>
      <p className="subtitle">Xem toàn bộ tổ chức, tìm kiếm và quản lý trạng thái hoạt động.</p>
    </header>

    <form className="panel space-y-4" onReset={() => { setFilters({}); setPage(1); }} onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const search = String(data.get("search") ?? "").trim();
      const status = String(data.get("status") ?? "") as AdminOrganizationStatus | "";
      setFilters({ ...(search ? { search } : {}), ...(status ? { status } : {}) });
      setPage(1);
    }}>
      <h2 className="font-semibold">Tìm và lọc tổ chức</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Tên hoặc slug</span><Input name="search" maxLength={100} placeholder="Nhập tên hoặc slug…" /></label>
        <label className="space-y-2 text-sm"><span>Trạng thái</span>
          <select name="status" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <div className="flex gap-2"><Button type="submit">Áp dụng</Button><Button type="reset" variant="outline">Xóa bộ lọc</Button></div>
    </form>

    {updateStatus.isError && <ErrorNotice error={updateStatus.error} />}
    {deleteOrganization.isError && <ErrorNotice error={deleteOrganization.error} />}
    {organizations.isPending ? <Skeleton /> : organizations.isError ? (
      <ErrorNotice error={organizations.error} retry={() => { void organizations.refetch(); }} />
    ) : <section className="overflow-hidden rounded-xl border border-slate-200 bg-white" aria-busy={organizations.isFetching}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <h2 className="font-semibold">Tổ chức <span className="ml-2 rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">{organizations.data.total}</span></h2>
        <Button variant="outline" disabled={organizations.isFetching} onClick={() => { void organizations.refetch(); }}>Làm mới</Button>
      </div>
      {organizations.data.items.length ? <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Danh sách tổ chức trong hệ thống</caption>
          <thead className="bg-slate-50 text-slate-500"><tr>{["Tổ chức", "Chủ sở hữu", "Trạng thái", "Ngày tạo", "Thao tác"].map((label) => <th key={label} scope="col" className="whitespace-nowrap px-5 py-4 font-medium">{label}</th>)}</tr></thead>
          <tbody>{organizations.data.items.map((organization) => <tr key={organization.id} className="border-t border-slate-100 align-top">
            <td className="px-5 py-4"><div className="flex items-start gap-3"><Building2 size={18} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden="true"/><div><p className="font-medium">{organization.name}</p><p className="mt-1 text-xs text-slate-500">{organization.slug}</p></div></div></td>
            <td className="px-5 py-4"><p>{organization.owner.firstName} {organization.owner.lastName}</p><p className="mt-1 text-xs text-slate-500">@{organization.owner.username}</p></td>
            <td className="px-5 py-4"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${statusStyles[organization.status]}`}>{statusLabels[organization.status]}</span></td>
            <td className="whitespace-nowrap px-5 py-4"><time dateTime={organization.createdAt}>{new Date(organization.createdAt).toLocaleDateString("vi-VN")}</time></td>
            <td className="px-5 py-4"><div className="flex flex-wrap gap-2">{organization.status === "ACTIVE" ? <ConfirmDialog title="Tạm ngưng" description={`Tạm ngưng tổ chức ${organization.name}? Thành viên sẽ không thể sử dụng tổ chức trong thời gian này.`} pending={updateStatus.isPending || deleteOrganization.isPending} onConfirm={() => updateStatus.mutate({ id: organization.id, status: "SUSPENDED" })} /> : organization.status === "SUSPENDED" ? <Button variant="outline" disabled={updateStatus.isPending || deleteOrganization.isPending} onClick={() => updateStatus.mutate({ id: organization.id, status: "ACTIVE" })}>Kích hoạt lại</Button> : <span className="text-xs text-slate-500">Đã xóa</span>}{organization.status !== "DELETED" && <ConfirmDialog title="Xóa" description={`Xóa tổ chức ${organization.name}? Tổ chức sẽ bị xóa mềm, các lời mời đang chờ sẽ bị thu hồi và thao tác này không thể hoàn tác từ trang quản trị.`} pending={updateStatus.isPending || deleteOrganization.isPending} onConfirm={() => deleteOrganization.mutate(organization.id)} />}</div></td>
          </tr>)}</tbody>
        </table>
      </div> : <p className="p-10 text-center text-sm text-slate-500">{filters.search || filters.status ? "Không có tổ chức phù hợp với bộ lọc." : "Chưa có tổ chức trong hệ thống."}</p>}
      {(organizations.data.total > 0 || page > 1) && <nav aria-label="Phân trang tổ chức" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5">
        <p className="text-sm text-slate-500">Trang {page} / {Math.max(1, Math.ceil(organizations.data.total / organizations.data.limit))}</p>
        <div className="flex gap-2"><Button variant="outline" disabled={page <= 1 || organizations.isFetching} onClick={() => setPage(page - 1)}>Trước</Button><Button variant="outline" disabled={page * organizations.data.limit >= organizations.data.total || organizations.isFetching} onClick={() => setPage(page + 1)}>Sau</Button></div>
      </nav>}
    </section>}
  </div>;
}
