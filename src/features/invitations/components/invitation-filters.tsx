import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InvitationFilters, InvitationStatus } from "../types";

const statusLabels: Record<InvitationStatus, string> = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã chấp nhận",
  REVOKED: "Đã thu hồi",
  EXPIRED: "Đã hết hạn",
};

export function InvitationFiltersForm({ onApply }: {
  onApply: (filters: InvitationFilters) => void;
}) {
  return (
    <form className="panel space-y-4" onReset={() => onApply({})}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = String(data.get("email") ?? "").trim().toLowerCase();
        const status = String(data.get("status") ?? "") as InvitationStatus | "";
        onApply({ ...(email ? { email } : {}), ...(status ? { status } : {}) });
      }}>
      <h2 className="font-semibold">Lọc lời mời</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Email</span>
          <Input name="email" maxLength={254} placeholder="Nhập một phần hoặc toàn bộ email…" />
        </label>
        <label className="space-y-2 text-sm">
          <span>Trạng thái</span>
          <select name="status" className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Áp dụng</Button>
        <Button type="reset" variant="outline">Xóa bộ lọc</Button>
      </div>
    </form>
  );
}
