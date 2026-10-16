import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../api/users.api";
import type { User } from "../types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";

export function UserProfilePage() {
  const { id } = useParams();
  const parsed = z.uuid().safeParse(id);
  return (
    <div className="space-y-7">
      <Button asChild variant="outline">
        <Link to="/admin/users">
          <ArrowLeft size={16} />
          Danh sách người dùng
        </Link>
      </Button>
      <header>
        <p className="eyebrow">Quản trị / Người dùng</p>
        <h1>Hồ sơ người dùng</h1>
        <p className="subtitle">Xem thông tin tài khoản.</p>
      </header>
      {parsed.success ? (
        <UserProfileDetail id={parsed.data} />
      ) : (
        <ErrorNotice error={new Error("ID người dùng không hợp lệ.")} />
      )}
    </div>
  );
}

function UserProfileDetail({ id }: { id: string }) {
  const user = useUser(id);
  if (user.isPending) return <Skeleton />;
  if (user.isError)
    return (
      <ErrorNotice
        error={user.error}
        retry={() => {
          void user.refetch();
        }}
      />
    );
  return <UserProfile user={user.data} />;
}

function UserProfile({ user }: { user: User }) {
  const fields = [
    { label: "ID", value: user.id },
    { label: "Tên đăng nhập", value: user.username },
    { label: "Tên", value: user.firstName },
    { label: "Họ", value: user.lastName },
    { label: "Email", value: user.email },
    {
      label: "Ngày sinh",
      value: new Date(user.birthDate).toLocaleDateString("vi-VN", {
        timeZone: "UTC",
      }),
    },
    {
      label: "Ngày tạo",
      value: new Date(user.createdAt).toLocaleString("vi-VN"),
    },
    {
      label: "Cập nhật gần nhất",
      value: new Date(user.updatedAt).toLocaleString("vi-VN"),
    },
  ];
  return (
    <section className="panel">
      <div className="mb-7 flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-600">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`Ảnh đại diện của ${user.username}`}
              className="size-full object-cover"
            />
          ) : (
            user.username.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="mt-1 break-words text-sm text-slate-500">
            @{user.username}
          </p>
        </div>
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="mt-2 break-words text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
