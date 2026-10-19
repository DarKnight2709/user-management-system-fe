import type { OrganizationMember } from "../types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function OrganizationMembersTable({
  members,
  onManageRoles,
  onRemove,
  pending,
  canManageRoles,
  canRemove,
}: {
  members: OrganizationMember[];
  onManageRoles: (memberId: string) => void;
  onRemove: (memberId: string) => void;
  pending: boolean;
  canManageRoles: boolean;
  canRemove: (member: OrganizationMember) => boolean;
}) {
  const showActions = canManageRoles || members.some(canRemove);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Thành viên đang hoạt động trong tổ chức
        </caption>
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {[
              "Thành viên",
              "Vai trò",
              "Trạng thái",
              "Ngày tham gia",
              ...(showActions ? ["Thao tác"] : []),
            ].map((title) => (
              <th
                key={title}
                scope="col"
                className="whitespace-nowrap px-5 py-4 font-medium"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-t border-slate-100">
              <td className="px-5 py-4">
                <p className="font-medium">
                  {member.user.firstName} {member.user.lastName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  @{member.user.username}
                </p>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {member.isOwner && (
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      Chủ sở hữu
                    </span>
                  )}
                  {member.roles.map((role) => (
                    <span
                      key={role.id}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                    >
                      {role.name}
                    </span>
                  ))}
                  {!member.isOwner && !member.roles.length && (
                    <span className="text-slate-500">Chưa gán vai trò</span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  Đang hoạt động
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <time dateTime={member.createdAt}>
                  {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                </time>
              </td>
              {showActions && (
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {canManageRoles && (
                      <Button
                        variant="outline"
                        disabled={pending}
                        onClick={() => onManageRoles(member.id)}
                      >
                        Quản lý vai trò
                      </Button>
                    )}
                    {canRemove(member) && (
                      <ConfirmDialog
                        title="Xóa thành viên"
                        description={`Xóa @${member.user.username} khỏi tổ chức? Thành viên sẽ mất quyền truy cập tổ chức; tài khoản người dùng vẫn được giữ.`}
                        pending={pending}
                        onConfirm={() => onRemove(member.id)}
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
