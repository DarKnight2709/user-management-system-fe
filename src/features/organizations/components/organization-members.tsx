import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useOrganizationMembers } from "../api/organization-members.api";
import { OrganizationMembersTable } from "./organization-members-table";

export function OrganizationMembers({
  organizationId,
  name,
}: {
  organizationId: string;
  name: string;
}) {
  const [page, setPage] = useState(1);
  const members = useOrganizationMembers(organizationId, page);
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
            <OrganizationMembersTable members={members.data.items} />
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
                  disabled={page <= 1 || members.isFetching}
                  onClick={() => setPage(page - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  disabled={
                    page >= 1_000_000 ||
                    page * members.data.limit >= members.data.total ||
                    members.isFetching
                  }
                  onClick={() => setPage(page + 1)}
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
