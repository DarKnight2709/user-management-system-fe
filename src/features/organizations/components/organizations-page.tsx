import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrganizationsPage() {
  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow">Không gian làm việc</p>
          <h1>Tổ chức của tôi</h1>
          <p className="subtitle">Các tổ chức bạn đang tham gia.</p>
        </div>
        <Button asChild>
          <Link to="/organization/create">
            <Plus size={18} aria-hidden="true" />
            <span>Tạo tổ chức</span>
          </Link>
        </Button>
      </header>
      <section className="panel">
        <p role="status" className="text-sm text-slate-500">
          Danh sách tổ chức hiện chưa khả dụng.
        </p>
      </section>
    </div>
  );
}
