import { Outlet } from "react-router-dom";
import { useAdminAccess } from "@/features/auth/api/admin-access.api";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { endSession } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";

export function AccessRoute() {
  const access = useAdminAccess();
  if (access.isPending)
    return (
      <main className="mx-auto max-w-3xl p-10">
        <Skeleton />
      </main>
    );
  if (access.isError)
    return (
      <main className="mx-auto max-w-3xl p-10">
        <ErrorNotice
          error={access.error}
          retry={() => {
            void access.refetch();
          }}
        />
      </main>
    );
  return access.data ? (
    <Outlet />
  ) : (
    <main className="mx-auto max-w-xl p-10">
      <h1>Không có quyền quản trị</h1>
      <p className="my-4 text-slate-500">
        Tài khoản cần quyền quản lý người dùng để vào khu vực này.
      </p>
      <Button onClick={endSession}>Đăng nhập tài khoản khác</Button>
    </main>
  );
}
