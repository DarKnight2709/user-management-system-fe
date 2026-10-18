import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PanelsTopLeft } from "lucide-react";
import { useSession } from "@/lib/session";
import { useLogin, useRegister } from "../api/auth.api";
import { registerSchema } from "../schemas/auth.schema";
import type { RegisterInput } from "../types";
import { LoginForm } from "./login-form";
import { FormFields } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { ErrorNotice } from "@/components/feedback";
import { readPendingInvitation } from "@/features/invitations/lib/pending-invitation";
export function AuthPage({
  mode,
  portal = "user",
}: {
  mode: "login" | "register";
  portal?: "admin" | "user";
}) {
  const admin = portal === "admin";
  const destination = admin
    ? "/admin"
    : readPendingInvitation()
      ? "/invitations/accept"
      : "/user";
  const current = useSession();
  const login = useLogin(portal);
  const signup = useRegister();
  const navigate = useNavigate();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  if (current && (current.portal || "user") === portal)
    return <Navigate to={destination} replace />;
  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
      <section>
        <div className="mb-8 inline-flex rounded-xl bg-indigo-600 p-3 text-white">
          <PanelsTopLeft size={28} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Project management
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
          {admin ? "Không gian quản trị." : "Không gian của bạn."}
          <br />
          {admin ? "Vận hành trong tầm tay." : "Bắt đầu ngày làm việc."}
        </h1>
        <p className="mt-5 max-w-sm leading-7 text-slate-500">
          {admin
            ? "Dành cho quản trị viên: theo dõi hệ thống và quản lý người dùng tại một nơi."
            : "Đăng nhập để truy cập dashboard cá nhân, cập nhật hồ sơ và bảo mật tài khoản."}
        </p>
        <Link
          to="/health"
          className="mt-8 inline-block text-sm text-indigo-600 hover:underline"
        >
          Kiểm tra kết nối hệ thống →
        </Link>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <h2 className="text-2xl font-semibold">
          {admin
            ? "Đăng nhập quản trị viên"
            : mode === "login"
              ? "Đăng nhập người dùng"
              : "Tạo tài khoản"}
        </h2>
        <p className="mb-7 mt-2 text-sm text-slate-500">
          {mode === "login"
            ? "Đăng nhập để tiếp tục làm việc."
            : "Nhập thông tin để bắt đầu."}
        </p>
        {mode === "login" ? (
          <>
            <LoginForm
              pending={login.isPending}
              onSubmit={async (input) => {
                try {
                  await login.mutateAsync(input);
                  navigate(destination, { replace: true });
                } catch {
                  return;
                }
              }}
            />
            {login.isError && <ErrorNotice error={login.error} />}
          </>
        ) : (
          <form
            className="space-y-4"
            noValidate
            onSubmit={form.handleSubmit(async (input) => {
              try {
                await signup.mutateAsync(input);
                toast.success("Đã tạo tài khoản. Vui lòng đăng nhập.");
                navigate("/login");
              } catch {
                return;
              }
            })}
          >
            <FormFields
              fields={[
                {
                  name: "username",
                  label: "Tên đăng nhập",
                  autoComplete: "username",
                },
                { name: "firstName", label: "Tên", autoComplete: "given-name" },
                { name: "lastName", label: "Họ", autoComplete: "family-name" },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  autoComplete: "email",
                },
                { name: "birthDate", label: "Ngày sinh", type: "date" },
                {
                  name: "password",
                  label: "Mật khẩu (ít nhất 15 ký tự, tối đa 72 byte)",
                  type: "password",
                  autoComplete: "new-password",
                },
              ]}
              register={form.register}
              errors={form.formState.errors}
              disabled={signup.isPending}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={signup.isPending}
            >
              {signup.isPending ? "Đang tạo…" : "Tạo tài khoản"}
            </Button>
            {signup.isError && <ErrorNotice error={signup.error} />}
          </form>
        )}
        {!admin && (
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <Link
              className="font-medium text-indigo-600"
              to={mode === "login" ? "/register" : "/login"}
            >
              {mode === "login" ? "Đăng ký" : "Đăng nhập"}
            </Link>
          </p>
        )}
        {admin && (
          <p className="mt-5 text-center text-sm text-slate-500">
            <Link className="text-indigo-600 hover:underline" to="/login">
              Đến đăng nhập người dùng
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
