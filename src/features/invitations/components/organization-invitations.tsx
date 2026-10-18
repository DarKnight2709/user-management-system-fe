import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useCreateInvitation, useInvitations } from "../api/invitations.api";
import { CreateInvitationForm } from "./create-invitation-form";
import { InvitationRow } from "./invitation-row";

export function OrganizationInvitations({
  organizationId,
}: {
  organizationId: string;
}) {
  const [page, setPage] = useState(1);
  const [now, setNow] = useState(Date.now);
  const invitations = useInvitations(organizationId, page);
  const create = useCreateInvitation(organizationId);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (invitations.isPending) return <Skeleton />;
  if (invitations.isError)
    return (
      <ErrorNotice
        error={invitations.error}
        retry={() => {
          void invitations.refetch();
        }}
      />
    );
  return (
    <div className="space-y-6">
      <section className="panel">
        <h2 className="mb-5 text-lg font-semibold">Mời thành viên</h2>
        <CreateInvitationForm
          pending={create.isPending}
          onSubmit={async (email) => {
            try {
              await create.mutateAsync(email);
              setPage(1);
              return true;
            } catch {
              return false;
            }
          }}
        />
        {create.data && (
          <p role="status" className="mt-4 text-sm text-slate-600">
            {create.data.emailQueued
              ? "Đã tạo lời mời và xếp hàng email. Chưa xác nhận email đã đến hộp thư."
              : "Đã tạo lời mời nhưng chưa xác nhận xếp hàng email. Sao chép liên kết bên dưới hoặc gửi lại sau thời gian chờ."}
          </p>
        )}
        {create.isError && <ErrorNotice error={create.error} />}
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <h2 className="font-semibold">Lời mời ({invitations.data.total})</h2>
          <Button
            variant="outline"
            disabled={invitations.isFetching}
            onClick={() => {
              void invitations.refetch();
            }}
          >
            Làm mới
          </Button>
        </div>
        {invitations.data.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Danh sách lời mời tham gia tổ chức
              </caption>
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {["Email", "Trạng thái", "Hết hạn", "Thao tác"].map(
                    (label) => (
                      <th
                        scope="col"
                        key={label}
                        className="px-5 py-4 font-medium"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {invitations.data.items.map((invitation) => (
                  <InvitationRow
                    key={invitation.id}
                    invitation={invitation}
                    now={now}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-slate-500">
            Không có lời mời trên trang này.
          </p>
        )}
        <nav
          aria-label="Phân trang lời mời"
          className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-5"
        >
          <p className="text-sm text-slate-500">
            Trang {page} /{" "}
            {Math.max(
              1,
              Math.ceil(invitations.data.total / invitations.data.limit),
            )}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || invitations.isFetching}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              disabled={
                page >= 1_000_000 ||
                page * invitations.data.limit >= invitations.data.total ||
                invitations.isFetching
              }
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        </nav>
      </section>
    </div>
  );
}
