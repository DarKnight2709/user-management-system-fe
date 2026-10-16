import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schema";
import type { LoginInput } from "../types";
import { FormFields } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
export function LoginForm({
  onSubmit,
  pending,
}: {
  onSubmit: (input: LoginInput) => Promise<void>;
  pending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormFields
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            autoComplete: "email",
          },
          {
            name: "password",
            label: "Mật khẩu",
            type: "password",
            autoComplete: "current-password",
          },
        ]}
        register={register}
        errors={errors}
        disabled={pending}
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>
    </form>
  );
}
