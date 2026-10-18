import type { Invitation } from "../types";

export function invitationState(invitation: Invitation, now = Date.now()) {
  const pending =
    invitation.status === "PENDING" && Date.parse(invitation.expiresAt) > now;
  const cooldown = Math.max(
    0,
    Math.ceil((Date.parse(invitation.lastRequestedAt) + 60_000 - now) / 1000),
  );
  return {
    pending,
    cooldown,
    canResend: pending && cooldown === 0 && invitation.resendCount < 5,
  };
}
