import { NavLink, Outlet } from "react-router-dom";
import {
  Users,
  UserRound,
  ShieldCheck,
  Activity,
  LogOut,
  PanelsTopLeft,
  LayoutDashboard,
  Building2,
} from "lucide-react";
import { useLogout, useMe, endSession } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { ErrorNotice } from "@/components/feedback";
export function AppLayout({ area }: { area: "admin" | "user" }) {
  const me = useMe();
  const logout = useLogout();
  const admin = area === "admin";
  const home = admin ? "/admin" : "/user";
  const links = admin
    ? [
        { to: "/admin", label: "Dashboard quản trị", icon: LayoutDashboard },
        { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
        { to: "/admin/health", label: "Trạng thái API", icon: Activity },
        { to: "/admin/profile", label: "Hồ sơ quản trị viên", icon: UserRound },
        { to: "/admin/security", label: "Bảo mật", icon: ShieldCheck },
      ]
    : [
        { to: "/user", label: "Dashboard cá nhân", icon: LayoutDashboard },
        { to: "/organization", label: "Tổ chức", icon: Building2 },
        { to: "/user/profile", label: "Hồ sơ cá nhân", icon: UserRound },
        { to: "/user/security", label: "Bảo mật", icon: ShieldCheck },
      ];
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-slate-200 bg-white p-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <LinkBrand home={home} />
        <p className="mb-3 mt-10 text-xs font-medium uppercase tracking-wider text-slate-400">
          {admin ? "Khu vực quản trị" : "Khu vực người dùng"}
        </p>
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === home}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-10 text-xs leading-6 text-slate-400">
          user management
          <br />
          {admin ? "Quản trị hệ thống" : "Không gian cá nhân"}
        </p>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:px-10">
          <p className="text-sm text-slate-500">
            Xin chào,{" "}
            <span className="font-medium text-slate-900">
              {me.data?.username || "bạn"}
            </span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={logout.isPending}
              onClick={() => logout.mutate(false)}
            >
              <LogOut size={16} />
              {logout.isPending ? "Đang thoát…" : "Đăng xuất"}
            </Button>
            {logout.isError && (
              <Button variant="outline" onClick={endSession}>
                Thoát cục bộ
              </Button>
            )}
          </div>
        </header>
        {logout.isError && (
          <div className="px-6">
            <ErrorNotice error={logout.error} />
          </div>
        )}
        <main className="mx-auto max-w-6xl p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function LinkBrand({ home }: { home: string }) {
  return (
    <NavLink to={home} className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
        <PanelsTopLeft size={24} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="font-semibold tracking-tight">user management</span>
    </NavLink>
  );
}
