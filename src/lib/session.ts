import { useSyncExternalStore } from "react";
import { z } from "zod";
import type { Session } from "@/types/session";

const schema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});
const key = "ums.session";
const listeners = new Set<() => void>();
function read(): Session | null {
  try {
    const parsed = schema.safeParse(
      JSON.parse(sessionStorage.getItem(key) || "null"),
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
let current = read();
export const session = {
  get: () => current,
  set: (value: Session | null) => {
    current = value;
    try {
      if (value) sessionStorage.setItem(key, JSON.stringify(value));
      else sessionStorage.removeItem(key);
    } catch {}
    listeners.forEach((listener) => listener());
  },
};
export function useSession() {
  return useSyncExternalStore((listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, session.get);
}
