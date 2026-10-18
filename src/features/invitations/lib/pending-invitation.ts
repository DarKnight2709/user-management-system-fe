import { invitationTokenSchema } from "../schemas/invitation.schema";

const key = "pm.pending-invitation";
let memoryToken: string | null = null;
export function readPendingInvitation(): string | null {
  try {
    const parsed = invitationTokenSchema.safeParse(sessionStorage.getItem(key));
    return parsed.success ? parsed.data : memoryToken;
  } catch {
    return memoryToken;
  }
}
export function savePendingInvitation(token: string) {
  memoryToken = invitationTokenSchema.parse(token);
  try {
    sessionStorage.setItem(key, memoryToken);
  } catch {}
}
export function clearPendingInvitation() {
  memoryToken = null;
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

export function capturePendingInvitation(hash: string): string | null {
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  if (fragment.has("token")) {
    const parsed = invitationTokenSchema.safeParse(fragment.get("token"));
    if (parsed.success) savePendingInvitation(parsed.data);
    else clearPendingInvitation();
  }
  return readPendingInvitation();
}
