import { Link } from "react-router-dom";
import { Users, Activity, ArrowUpRight } from "lucide-react";
import { useUsers } from "@/features/users/api/users.api";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";

export function AdminDashboard() {
  const users = useUsers();
  return (
    <div className="space-y-7">
      <header>
        <p className="eyebrow">Dashboard quản trị</p>
        <h1>Tổng quan hệ thống</h1>
        <p className="subtitle">
          Theo dõi tài khoản và truy cập các công cụ vận hành.
        </p>
      </header>
      <section className="panel">
        <div className="flex items-center gap-3 text-slate-500">
          <Users size={20} />
          <h2>Tổng người dùng đang hoạt động</h2>
        </div>
        {users.isPending ? (
          <div className="mt-5">
            <Skeleton />
          </div>
        ) : users.isError ? (
          <ErrorNotice
            error={users.error}
            retry={() => {
              void users.refetch();
            }}
          />
        ) : (
          <p className="mt-5 text-4xl font-semibold tracking-tight">
            {users.data.total}
          </p>
        )}
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          {
            to: "/admin/users",
            title: "Quản lý người dùng",
            description: "Xem danh sách, phân trang và quản lý tài khoản.",
            icon: Users,
          },
          {
            to: "/admin/health",
            title: "Giám sát hệ thống",
            description: "Kiểm tra kết nối ứng dụng và PostgreSQL.",
            icon: Activity,
          },
        ].map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="panel transition-colors hover:border-indigo-300"
          >
            <div className="flex items-center justify-between text-indigo-600">
              <Icon size={24} />
              <ArrowUpRight size={20} />
            </div>
            <h2 className="mt-5 font-semibold">{title}</h2>
            <p className="subtitle">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
