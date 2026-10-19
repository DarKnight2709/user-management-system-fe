import type { OrganizationMember } from "../types";
import { Button } from "@/components/ui/button";

export function OrganizationMembersTable({
  members,
  onManageRoles,
}: {
  members: OrganizationMember[];
  onManageRoles: (memberId: string) => void;
}) {
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
              "Thao tác",
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
              <td className="px-5 py-4">
                <Button
                  variant="outline"
                  onClick={() => onManageRoles(member.id)}
                >
                  Quản lý vai trò
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
