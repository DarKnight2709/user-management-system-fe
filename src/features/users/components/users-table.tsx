import type { User } from "../types";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export function UsersTable({
  users,
  pending,
  onDelete,
}: {
  users: User[];
  pending: boolean;
  onDelete: (id: string) => void;
}) {
  if (!users.length)
    return (
      <p className="p-8 text-center text-slate-500">
        Không tìm thấy người dùng.
      </p>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {["Người dùng", "Email", "Ngày tạo", "Thao tác"].map((title) => (
              <th
                key={title}
                className="whitespace-nowrap px-5 py-4 font-medium"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-100">
              <td className="px-5 py-4">
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-1 text-xs text-slate-500">@{user.username}</p>
              </td>
              <td className="px-5 py-4">{user.email}</td>
              <td className="whitespace-nowrap px-5 py-4">
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-5 py-4">
                <ConfirmDialog
                  title="Xóa"
                  description={`Xác nhận xóa tài khoản ${user.email}? Backend kiểm tra quyền USER:delete và bảo vệ quản trị viên cuối cùng.`}
                  pending={pending}
                  onConfirm={() => onDelete(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
