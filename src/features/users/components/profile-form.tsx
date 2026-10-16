import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../schemas/user.schema";
import type { User, UpdateUserInput } from "../types";
import { FormFields } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
export function ProfileForm({
  user,
  pending,
  onSubmit,
}: {
  user: User;
  pending: boolean;
  onSubmit: (input: UpdateUserInput) => Promise<void>;
}) {
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate.slice(0, 10),
    },
  });
  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <FormFields
        fields={[
          { name: "firstName", label: "Tên" },
          { name: "lastName", label: "Họ" },
          { name: "username", label: "Tên đăng nhập" },
          { name: "email", label: "Email", type: "email" },
          { name: "birthDate", label: "Ngày sinh", type: "date" },
        ]}
        register={form.register}
        errors={form.formState.errors}
        disabled={pending}
      />
      <div className="flex items-end sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang lưu…" : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
