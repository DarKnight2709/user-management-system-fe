import { Link } from "react-router-dom";
import { UserRound, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useMe } from "@/features/auth/api/auth.api";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";

export function UserDashboard() {
  const me = useMe();
  if (me.isPending) return <Skeleton />;
  if (me.isError)
    return (
      <ErrorNotice
        error={me.error}
        retry={() => {
          void me.refetch();
        }}
      />
    );
  return (
    <div className="space-y-7">
      <header>
        <p className="eyebrow">Dashboard cá nhân</p>
        <h1>Chào {me.data.username}!</h1>
        <p className="subtitle">
          Không gian làm việc và quản lý tài khoản của bạn.
        </p>
      </header>
      <section className="rounded-2xl bg-indigo-600 p-8 text-white">
        <p className="text-sm text-indigo-100">Tài khoản đang đăng nhập</p>
        <h2 className="mt-3 text-2xl font-semibold">{me.data.email}</h2>
        <p className="mt-3 text-sm text-indigo-100">
          Cập nhật thông tin cá nhân và kiểm soát bảo mật ngay tại đây.
        </p>
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          {
            to: "/user/profile",
            title: "Hồ sơ của tôi",
            description: "Cập nhật thông tin và ảnh đại diện.",
            icon: UserRound,
          },
          {
            to: "/user/security",
            title: "Bảo mật tài khoản",
            description: "Đổi mật khẩu và quản lý phiên đăng nhập.",
            icon: ShieldCheck,
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
