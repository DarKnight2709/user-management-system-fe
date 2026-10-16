import { useState } from "react";
import { toast } from "sonner";
import { useUsers, useDeleteUser } from "../api/users.api";
import { endSession, useMe } from "@/features/auth/api/auth.api";
import { UsersTable } from "./users-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { Input } from "@/components/ui/input";
export function UsersPage() {
  const [search, setSearch] = useState("");
  const users = useUsers();
  const remove = useDeleteUser();
  const me = useMe();
  const visible =
    users.data?.filter((user) =>
      `${user.username} ${user.email} ${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ) || [];
  return (
    <div className="space-y-7">
      <header>
        <p className="eyebrow">Quản trị</p>
        <h1>Người dùng</h1>
        <p className="subtitle">
          Danh sách tài khoản trong hệ thống. Yêu cầu quyền USER:read.
        </p>
      </header>
      {users.isPending ? (
        <Skeleton />
      ) : users.isError ? (
        <ErrorNotice
          error={users.error}
          retry={() => {
            void users.refetch();
          }}
        />
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <h2 className="font-semibold">
              Tất cả người dùng{" "}
              <span className="ml-2 rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
                {users.data.length}
              </span>
            </h2>
            <Input
              aria-label="Tìm người dùng"
              placeholder="Tìm tên hoặc email…"
              className="max-w-xs"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <UsersTable
            users={visible}
            pending={remove.isPending}
            onDelete={(id) =>
              remove.mutate(id, {
                onSuccess: () => {
                  toast.success("Đã xóa tài khoản.");
                  if (id === me.data?.id) endSession();
                },
              })
            }
          />
        </section>
      )}
    </div>
  );
}
