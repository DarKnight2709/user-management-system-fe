import { useNavigate } from "react-router-dom";
import { useMe } from "@/features/auth/api/auth.api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorNotice } from "@/components/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaveOrganization } from "../api/organization-members.api";
import type { Organization } from "../types";

export function LeaveOrganization({
  organization,
}: {
  organization: Organization;
}) {
  const me = useMe();
  const navigate = useNavigate();
  const leave = useLeaveOrganization(organization, () =>
    navigate("/organization", { replace: true }),
  );
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
  const isOwner = me.data.id === organization.ownerId;
  return (
    <section className="panel border-red-200">
      <h2 className="text-lg font-semibold">Rời tổ chức</h2>
      <p className="my-4 text-sm leading-6 text-slate-600">
        {isOwner
          ? "Bạn đang là chủ sở hữu. Hãy chuyển quyền sở hữu cho thành viên khác trước khi rời tổ chức."
          : "Bạn sẽ mất quyền truy cập tổ chức. Tài khoản cá nhân vẫn được giữ nguyên."}
      </p>
      {!isOwner && (
        <ConfirmDialog
          title="Rời tổ chức"
          description={`Xác nhận rời tổ chức ${organization.name}? Bạn sẽ mất quyền truy cập và cần lời mời mới để tham gia lại.`}
          pending={leave.isPending}
          onConfirm={() => leave.mutate()}
        />
      )}
      {leave.isPending && (
        <p role="status" className="mt-3 text-sm text-slate-500">
          Đang rời tổ chức…
        </p>
      )}
      {leave.isError && <ErrorNotice error={leave.error} />}
    </section>
  );
}
