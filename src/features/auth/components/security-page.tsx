import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changePasswordSchema } from "../schemas/auth.schema";
import type { ChangePasswordInput } from "../types";
import { useChangePassword, useLogout } from "../api/auth.api";
import { FormFields } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorNotice } from "@/components/feedback";
export function SecurityPage() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });
  const change = useChangePassword();
  const logout = useLogout();
  return (
    <div className="space-y-7">
      <header>
        <p className="eyebrow">Tài khoản</p>
        <h1>Bảo mật</h1>
        <p className="subtitle">Quản lý mật khẩu và phiên đăng nhập của bạn.</p>
      </header>
      <section className="panel">
        <h2 className="mb-2 text-lg font-semibold">Đổi mật khẩu</h2>
        <p className="mb-6 text-sm text-slate-500">
          Ít nhất 15 ký tự, tối đa 72 byte UTF-8. Sau khi đổi, vui lòng đăng
          nhập lại.
        </p>
        <form
          className="max-w-md space-y-5"
          noValidate
          onSubmit={form.handleSubmit(async (input) => {
            try {
              await change.mutateAsync(input);
              toast.success("Đã đổi mật khẩu. Vui lòng đăng nhập lại.");
            } catch {
              return;
            }
          })}
        >
          <FormFields
            fields={[
              {
                name: "currentPassword",
                label: "Mật khẩu hiện tại",
                type: "password",
                autoComplete: "current-password",
              },
              {
                name: "newPassword",
                label: "Mật khẩu mới",
                type: "password",
                autoComplete: "new-password",
              },
            ]}
            register={form.register}
            errors={form.formState.errors}
            disabled={change.isPending}
          />
          <Button type="submit" disabled={change.isPending}>
            {change.isPending ? "Đang cập nhật…" : "Đổi mật khẩu"}
          </Button>
          {change.isError && <ErrorNotice error={change.error} />}
        </form>
      </section>
      <section className="panel">
        <h2 className="text-lg font-semibold">Phiên đăng nhập</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <ConfirmDialog
            title="Đăng xuất tất cả"
            description="Thu hồi tất cả phiên refresh của tài khoản và trở về trang đăng nhập?"
            pending={logout.isPending}
            onConfirm={() => logout.mutate(true)}
          />
        </div>
      </section>
    </div>
  );
}
