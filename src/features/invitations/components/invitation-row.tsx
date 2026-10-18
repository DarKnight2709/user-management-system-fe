import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { invitationsApi } from "../api/invitations.api";
import { invitationState } from "../lib/invitation-state";
import type { Invitation, InvitationStatus, DeliveryStatus } from "../types";

const statuses: Record<InvitationStatus, string> = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã chấp nhận",
  REVOKED: "Đã thu hồi",
  EXPIRED: "Hết hạn",
};
const deliveries: Record<DeliveryStatus, string> = {
  NOT_QUEUED: "Chưa xếp hàng",
  QUEUED: "Đã xếp hàng",
  SENT: "Gửi thành công",
  FAILED: "Gửi thất bại",
};

export function InvitationRow({
  invitation,
  now,
}: {
  invitation: Invitation;
  now: number;
}) {
  const client = useQueryClient();
  const [fallbackLink, setFallbackLink] = useState<string | null>(null);
  const [blockedUntil, setBlockedUntil] = useState(0);
  const state = invitationState(invitation, now);
  const cooldown = Math.max(
    state.cooldown,
    Math.ceil((blockedUntil - now) / 1000),
  );
  const refresh = () =>
    client.invalidateQueries({
      queryKey: ["invitations", invitation.organizationId],
    });
  const resend = useMutation({
    mutationFn: () =>
      invitationsApi.resend(invitation.organizationId, invitation.id),
    onSuccess: async (result) => {
      result.emailQueued
        ? toast.success(
            "Đã xếp hàng gửi email. Chưa xác nhận phát đến hộp thư.",
          )
        : toast.warning(
            "Chưa xác nhận xếp hàng email. Bạn có thể sao chép liên kết hoặc gửi lại sau.",
          );
      await refresh();
    },
    onError: (error) => {
      if (
        axios.isAxiosError<{ retryAfterSeconds?: number }>(error) &&
        typeof error.response?.data.retryAfterSeconds === "number"
      )
        setBlockedUntil(
          Date.now() + error.response.data.retryAfterSeconds * 1000,
        );
    },
  });
  const revoke = useMutation({
    mutationFn: () =>
      invitationsApi.revoke(invitation.organizationId, invitation.id),
    onSuccess: async () => {
      setFallbackLink(null);
      toast.success("Đã thu hồi lời mời.");
      await refresh();
    },
  });
  const copy = useMutation({
    gcTime: 0,
    mutationFn: async () => {
      setFallbackLink(null);
      const result = await invitationsApi.link(
        invitation.organizationId,
        invitation.id,
      );
      try {
        await navigator.clipboard.writeText(result.inviteLink);
        toast.success("Đã sao chép liên kết lời mời.");
      } catch {
        setFallbackLink(result.inviteLink);
        toast.info("Hãy sao chép liên kết bên dưới.");
      }
    },
  });
  const pending = resend.isPending || revoke.isPending || copy.isPending;
  const status =
    invitation.status === "PENDING" && !state.pending
      ? "EXPIRED"
      : invitation.status;
  return (
    <tr className="border-t border-slate-100">
      <td className="px-5 py-4">
        <p className="break-all font-medium">{invitation.email}</p>
        <p className="mt-1 text-xs text-slate-500">MEMBER</p>
      </td>
      <td className="px-5 py-4">
        <p className="whitespace-nowrap">{statuses[status]}</p>
        <p className="mt-1 text-xs text-slate-500">
          {deliveries[invitation.deliveryStatus]}
        </p>
      </td>
      <td className="whitespace-nowrap px-5 py-4">
        <time dateTime={invitation.expiresAt}>
          {new Date(invitation.expiresAt).toLocaleString("vi-VN")}
        </time>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={pending || !state.pending}
            onClick={() => copy.mutate()}
          >
            Sao chép link
          </Button>
          <Button
            variant="outline"
            disabled={pending || !state.canResend || cooldown > 0}
            onClick={() => resend.mutate()}
          >
            {cooldown > 0 && state.pending
              ? `Gửi lại (${cooldown}s)`
              : "Gửi lại"}
          </Button>
          {(status === "PENDING" || status === "EXPIRED") && (
            <ConfirmDialog
              title="Thu hồi"
              description={`Thu hồi lời mời dành cho ${invitation.email}?`}
              pending={pending}
              onConfirm={() => revoke.mutate()}
            />
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Đã gửi lại {invitation.resendCount}/5 lần
        </p>
        {fallbackLink && state.pending && (
          <div className="mt-3">
            <label className="sr-only" htmlFor={`invite-${invitation.id}`}>
              Liên kết lời mời
            </label>
            <Input
              id={`invite-${invitation.id}`}
              readOnly
              value={fallbackLink}
              onFocus={(event) => event.target.select()}
            />
            <Button variant="ghost" onClick={() => setFallbackLink(null)}>
              Ẩn liên kết
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
