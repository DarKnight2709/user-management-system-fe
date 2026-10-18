import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useSession } from "@/lib/session";
import { useMe, useLogout } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import {
  readPendingInvitation,
  capturePendingInvitation,
  clearPendingInvitation,
} from "../lib/pending-invitation";
import { useAcceptInvitation } from "../api/invitations.api";

export function AcceptInvitationPage() {
  const current = useSession();
  const [token, setToken] = useState(readPendingInvitation);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    function capture() {
      const hash = window.location.hash;
      setToken(capturePendingInvitation(hash));
      if (new URLSearchParams(hash.slice(1)).has("token")) {
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.search,
        );
      }
      setReady(true);
    }
    capture();
    window.addEventListener("hashchange", capture);
    return () => window.removeEventListener("hashchange", capture);
  }, []);
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-14">
      <header>
        <MailCheck
          className="mb-5 text-indigo-600"
          size={36}
          aria-hidden="true"
        />
        <p className="eyebrow">Lời mời tổ chức</p>
        <h1>Tham gia tổ chức</h1>
        <p className="subtitle">
          Đăng nhập bằng đúng email được mời để tham gia với vai trò MEMBER.
        </p>
      </header>
      {!ready ? (
        <Skeleton />
      ) : !token ? (
        <ErrorNotice
          error={
            new Error(
              "Liên kết lời mời không hợp lệ hoặc bị thiếu. Vui lòng mở lại liên kết đầy đủ từ email hoặc người mời.",
            )
          }
        />
      ) : current && current.portal !== "admin" ? (
        <AcceptInvitationAccount key={token} token={token} />
      ) : (
        <section className="panel">
          <p className="mb-5 text-sm text-slate-600">
            Vui lòng đăng nhập hoặc tạo tài khoản bằng email nhận lời mời. Lời
            mời sẽ được giữ để bạn tiếp tục sau đó.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">Tạo tài khoản</Link>
            </Button>
          </div>
        </section>
      )}
      <Button asChild variant="ghost">
        <Link to="/user">Về dashboard</Link>
      </Button>
    </main>
  );
}

function AcceptInvitationAccount({ token }: { token: string }) {
  const me = useMe();
  const accept = useAcceptInvitation(token);
  const logout = useLogout();
  if (accept.isSuccess)
    return (
      <section className="panel">
        <h2 className="text-lg font-semibold text-emerald-700">
          Đã tham gia tổ chức
        </h2>
        <p className="my-4 text-sm text-slate-600">
          Bạn đã trở thành thành viên. Tổ chức sẽ xuất hiện trong danh sách của
          bạn.
        </p>
        <Button asChild>
          <Link to="/organization">Xem tổ chức của tôi</Link>
        </Button>
      </section>
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
  return (
    <section className="panel">
      <h2 className="text-lg font-semibold">Xác nhận tham gia</h2>
      <p className="my-4 break-words text-sm text-slate-600">
        Tài khoản đang đăng nhập: <strong>{me.data.email}</strong>. Email này
        phải trùng email được mời.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          disabled={accept.isPending || logout.isPending}
          onClick={() =>
            accept.mutate(undefined, { onSuccess: clearPendingInvitation })
          }
        >
          {accept.isPending ? "Đang tham gia…" : "Chấp nhận lời mời"}
        </Button>
        <Button
          variant="outline"
          disabled={accept.isPending || logout.isPending}
          onClick={() => logout.mutate(false)}
        >
          Đăng nhập tài khoản khác
        </Button>
      </div>
      {accept.isError && <ErrorNotice error={accept.error} />}
      {logout.isError && <ErrorNotice error={logout.error} />}
    </section>
  );
}
