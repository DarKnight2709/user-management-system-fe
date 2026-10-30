import { useState } from "react";
import { z } from "zod";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useAuditLogs } from "../api/audit.api";
import { auditActionLabel, auditActorLabel, auditTargetLabel } from "../lib/audit-labels";
import { auditActions, auditTargetTypes, organizationAuditActions, type AuditFilters, type AuditEvent } from "../types";

const selectClass = "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm";
const date = (value: string) => new Date(value).toLocaleString("vi-VN");

export function AuditLogsPage() {
  return <div className="space-y-7">
    <header><p className="eyebrow">Quản trị</p><h1>Nhật ký hệ thống</h1>
      <p className="subtitle">Theo dõi các sự kiện và thay đổi trên toàn hệ thống.</p></header>
    <AuditLogs />
  </div>;
}

export function AuditLogs({ organizationId }: { organizationId?: string }) {
  const [filters, setFilters] = useState<AuditFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const logs = useAuditLogs({ ...filters, page, limit }, organizationId);
  return <section className="mt-6 space-y-5">
    <AuditFilterForm platform={!organizationId} onApply={(next, size) => {
      setFilters(next); setLimit(size); setPage(1);
    }} />
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">Mới nhất trước · Mỗi lần xem nhật ký đều được ghi nhận.</p>
      <Button variant="outline" disabled={logs.isFetching} onClick={() => { void logs.refetch(); }}>
        <RefreshCw size={16} aria-hidden="true" /> Làm mới
      </Button>
    </div>
    {logs.isPending ? <Skeleton /> : logs.isError ? <ErrorNotice error={logs.error} retry={() => { void logs.refetch(); }} /> :
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" aria-busy={logs.isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Nhật ký hoạt động</caption>
            <thead className="bg-slate-50 text-slate-500"><tr>
              {["Thời gian", "Hành động", "Người thực hiện", "Đối tượng", "Chi tiết"].map((label) => <th key={label} scope="col" className="p-4 font-medium">{label}</th>)}
            </tr></thead>
            <tbody>{logs.data.items.length === 0 ? <tr><td colSpan={5} className="p-10 text-center text-slate-500">Không có sự kiện phù hợp với bộ lọc.</td></tr> : logs.data.items.map((event) => <AuditRow key={event.eventId} event={event} />)}</tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
          <p className="text-sm text-slate-500">{logs.data.total} sự kiện · Trang {page} / {Math.max(1, Math.ceil(logs.data.total / limit))}</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || logs.isFetching} onClick={() => setPage(page - 1)}>Trước</Button>
            <Button variant="outline" disabled={page >= 1_000_000 || page * limit >= logs.data.total || logs.isFetching} onClick={() => setPage(page + 1)}>Sau</Button>
          </div>
        </div>
      </div>}
  </section>;
}

function AuditFilterForm({ platform, onApply }: { platform: boolean; onApply: (filters: AuditFilters, limit: number) => void }) {
  const actions = platform ? auditActions : organizationAuditActions;
  const [error, setError] = useState("");
  return <form className="panel space-y-4" onReset={() => { setError(""); onApply({}, 20); }} onSubmit={(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filters: AuditFilters = {};
    for (const key of ["action", "actorId", "targetId", "targetType", ...(platform ? ["organizationId"] as const : [])] as (keyof AuditFilters)[]) {
      const value = String(data.get(key) ?? "").trim();
      if (value) filters[key] = value;
    }
    for (const key of ["actorId", "targetId", "organizationId"] as const) {
      if (filters[key] && !z.uuid().safeParse(filters[key]).success) {
        setError("ID người thực hiện, đối tượng và tổ chức phải là UUID hợp lệ."); return;
      }
    }
    setError(""); onApply(filters, Number(data.get("limit")));
  }}>
    <h2 className="font-semibold">Lọc sự kiện</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="space-y-2 text-sm"><span>Hành động</span><select name="action" className={selectClass}><option value="">Tất cả hành động</option>{actions.map((action) => <option key={action} value={action}>{auditActionLabel(action)}</option>)}</select></label>
      <label className="space-y-2 text-sm"><span>Loại đối tượng</span><select name="targetType" className={selectClass}><option value="">Tất cả loại đối tượng</option>{auditTargetTypes.map((type) => <option key={type} value={type}>{auditTargetLabel(type)}</option>)}</select></label>
      <label className="space-y-2 text-sm"><span>ID người thực hiện</span><Input name="actorId" placeholder="UUID" /></label>
      <label className="space-y-2 text-sm"><span>ID đối tượng</span><Input name="targetId" placeholder="UUID" /></label>
      {platform && <label className="space-y-2 text-sm"><span>ID tổ chức</span><Input name="organizationId" placeholder="UUID" /></label>}
      <label className="space-y-2 text-sm"><span>Số sự kiện mỗi trang</span><select name="limit" defaultValue="20" className={selectClass}>{[10, 20, 50, 100].map((size) => <option key={size}>{size}</option>)}</select></label>
    </div>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <div className="flex gap-2"><Button type="submit">Áp dụng</Button><Button type="reset" variant="outline">Xóa bộ lọc</Button></div>
  </form>;
}

function AuditRow({ event }: { event: AuditEvent }) {
  return <tr className="border-t border-slate-100 align-top">
    <td className="whitespace-nowrap p-4"><time dateTime={event.occurredAt}>{date(event.occurredAt)}</time></td>
    <td className="p-4 font-medium text-indigo-700">{auditActionLabel(event.action)}</td>
    <td className="p-4"><p>{auditActorLabel(event.actorType)}</p><p className="mt-1 break-all font-mono text-xs text-slate-500">{event.actorId ?? "—"}</p></td>
    <td className="p-4"><p>{auditTargetLabel(event.targetType)}</p><p className="mt-1 break-all font-mono text-xs text-slate-500">{event.targetId}</p></td>
    <td className="min-w-60 p-4"><details><summary className="cursor-pointer text-indigo-600">Xem chi tiết</summary>
      <dl className="mt-3 space-y-2 break-all text-xs">
        <dt className="font-medium">Mã hành động</dt><dd>{event.action}</dd>
        <dt className="font-medium">Mã loại đối tượng</dt><dd>{event.targetType}</dd>
        <dt className="font-medium">ID sự kiện</dt><dd>{event.eventId}</dd>
        <dt className="font-medium">ID yêu cầu</dt><dd>{event.requestId}</dd>
        <dt className="font-medium">ID tổ chức</dt><dd>{event.organizationId ?? "—"}</dd>
        <dt className="font-medium">Thời gian ghi nhận</dt><dd>{date(event.recordedAt)}</dd>
        <dt className="font-medium">Phiên bản</dt><dd>{event.schemaVersion}</dd>
        <dt className="font-medium">Dữ liệu sự kiện</dt><dd><pre className="max-h-80 max-w-lg overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3">{JSON.stringify(event.payload, null, 2)}</pre></dd>
      </dl>
    </details></td>
  </tr>;
}
