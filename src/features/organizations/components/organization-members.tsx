import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import {
  useOrganizationMembers,
  useRemoveOrganizationMember,
} from "../api/organization-members.api";
import { OrganizationMembersTable } from "./organization-members-table";
import { MemberRoleEditor } from "@/features/roles/components/member-role-editor";

export function OrganizationMembers({
  organizationId,
  name,
  ownerId,
}: {
  organizationId: string;
  name: string;
  ownerId: string;
}) {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const members = useOrganizationMembers(organizationId, page);
  const remove = useRemoveOrganizationMember(organizationId);
  const selected = members.data?.items.find(
    (member) => member.id === selectedId,
  );
  return (
    <section className="space-y-5">
      <header>
        <h2 className="break-words text-xl font-semibold">
          Thành viên của {name}
        </h2>
        <p className="subtitle">
          Danh sách thành viên đang hoạt động trong tổ chức.
        </p>
      </header>
      {remove.isError && <ErrorNotice error={remove.error} />}
      {selected && !members.isError && (
        <MemberRoleEditor
          key={selected.id}
          organizationId={organizationId}
          ownerId={ownerId}
          member={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
      {members.isPending ? (
        <Skeleton />
      ) : members.isError ? (
        <ErrorNotice
          error={members.error}
          retry={() => {
            void members.refetch();
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-medium">
              {members.data.total} thành viên
            </p>
          </div>
          {members.data.items.length ? (
            <OrganizationMembersTable
              members={members.data.items}
              onManageRoles={setSelectedId}
              pending={remove.isPending}
              onRemove={(memberId) => {
                const lastOnPage = members.data.items.length === 1 && page > 1;
                remove.mutate(memberId, {
                  onSuccess: () => {
                    if (selectedId === memberId) setSelectedId(null);
                    if (lastOnPage) setPage(page - 1);
                  },
                });
              }}
            />
          ) : (
            <div className="p-10 text-center">
              <Users
                size={32}
                className="mx-auto mb-4 text-slate-400"
                aria-hidden="true"
              />
              <p className="text-sm text-slate-500">
                {members.data.total === 0
                  ? "Chưa có thành viên đang hoạt động."
                  : "Trang này không có thành viên."}
              </p>
              {page > 1 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  disabled={remove.isPending}
                  onClick={() => setPage(1)}
                >
                  Về trang đầu
                </Button>
              )}
            </div>
          )}
          {members.data.items.length > 0 && (
            <nav
              aria-label="Phân trang thành viên"
              className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-5"
            >
              <p className="text-sm text-slate-500">
                Trang {members.data.page} /{" "}
                {Math.max(
                  1,
                  Math.ceil(members.data.total / members.data.limit),
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1 || members.isFetching || remove.isPending}
                  onClick={() => {
                    setSelectedId(null);
                    setPage(page - 1);
                  }}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  disabled={
                    page >= 1_000_000 ||
                    page * members.data.limit >= members.data.total ||
                    members.isFetching ||
                    remove.isPending
                  }
                  onClick={() => {
                    setSelectedId(null);
                    setPage(page + 1);
                  }}
                >
                  Sau
                </Button>
              </div>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}
