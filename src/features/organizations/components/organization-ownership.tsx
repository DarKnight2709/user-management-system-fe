import { useState } from "react";
import { useMe } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useOrganizationMembers } from "../api/organization-members.api";
import { useTransferOwnership } from "../api/ownership.api";
import type { Organization, OrganizationMember } from "../types";

export function OrganizationOwnership({
  organization,
}: {
  organization: Organization;
}) {
  const me = useMe();
  const [open, setOpen] = useState(false);
  if (me.isPending) return <Skeleton />;
  if (me.isError)
    return (
      <ErrorNotice
        error={me.error}
        retry={() => {
          void me.refetch();
        }}
      />
    );
  if (me.data.id !== organization.ownerId) return null;
  return (
    <section className="panel border-amber-200">
      <h2 className="text-lg font-semibold">Chuyển quyền sở hữu</h2>
      <p className="my-4 text-sm leading-6 text-slate-600">
        Chuyển tổ chức cho một thành viên đang hoạt động khác. Bạn sẽ mất quyền
        dành riêng cho chủ sở hữu, vẫn là thành viên và được giữ các vai trò
        hiện có.
      </p>
      {open ? (
        <OwnershipRecipient
          key={organization.id}
          organizationId={organization.id}
          ownerId={organization.ownerId}
          name={organization.name}
          onCancel={() => setOpen(false)}
        />
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Chọn chủ sở hữu mới
        </Button>
      )}
    </section>
  );
}

function OwnershipRecipient({
  organizationId,
  ownerId,
  name,
  onCancel,
}: {
  organizationId: string;
  ownerId: string;
  name: string;
  onCancel: () => void;
}) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<OrganizationMember | null>(null);
  const members = useOrganizationMembers(organizationId, page);
  const transfer = useTransferOwnership(organizationId);
  const eligible =
    members.data?.items.filter(
      (member) => member.user.id !== ownerId && member.status === "ACTIVE",
    ) || [];
  return (
    <div className="space-y-5">
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
        <>
          <fieldset disabled={transfer.isPending} className="space-y-3">
            <legend className="mb-3 text-sm font-medium">
              Chọn thành viên nhận quyền sở hữu
            </legend>
            {eligible.map((member) => (
              <label
                key={member.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm"
              >
                <input
                  type="radio"
                  name="new-owner"
                  value={member.id}
                  checked={selected?.id === member.id}
                  onChange={() => setSelected(member)}
                  className="mt-1 accent-indigo-600"
                />
                <span>
                  <span className="font-medium">
                    {member.user.firstName} {member.user.lastName}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    @{member.user.username}
                  </span>
                </span>
              </label>
            ))}
            {!eligible.length && (
              <p className="text-sm text-slate-500">
                Không có thành viên phù hợp trên trang này. Chỉ có thể chọn
                thành viên đang hoạt động khác bạn.
              </p>
            )}
          </fieldset>
          <nav
            aria-label="Chọn trang thành viên để chuyển quyền"
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <p className="text-sm text-slate-500">
              Trang {page} /{" "}
              {Math.max(1, Math.ceil(members.data.total / members.data.limit))}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1 || members.isFetching || transfer.isPending}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                disabled={
                  page >= 1_000_000 ||
                  page * members.data.limit >= members.data.total ||
                  members.isFetching ||
                  transfer.isPending
                }
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          </nav>
        </>
      )}
      {selected && (
        <p className="break-words text-sm font-medium">
          Người nhận: @{selected.user.username}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <ConfirmDialog
          title="Chuyển quyền sở hữu"
          description={`Xác nhận chuyển quyền sở hữu tổ chức ${name} cho @${selected?.user.username || ""}? Bạn sẽ không còn quyền dành riêng cho chủ sở hữu. Chỉ chủ sở hữu mới có thể chuyển lại quyền cho bạn.`}
          pending={
            !selected ||
            transfer.isPending ||
            members.isError ||
            members.isPending ||
            members.isFetching
          }
          onConfirm={() => {
            if (selected) transfer.mutate(selected.id);
          }}
        />
        <Button
          variant="outline"
          disabled={transfer.isPending}
          onClick={onCancel}
        >
          Hủy
        </Button>
      </div>
      {transfer.isError && <ErrorNotice error={transfer.error} />}
    </div>
  );
}
