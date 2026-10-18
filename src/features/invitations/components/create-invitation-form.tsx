import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FormFields } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { createInvitationSchema } from "../schemas/invitation.schema";

export function CreateInvitationForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (email: string) => Promise<boolean>;
}) {
  const form = useForm<z.infer<typeof createInvitationSchema>>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { email: "" },
  });
  return (
    <form
      className="max-w-lg space-y-4"
      noValidate
      onSubmit={form.handleSubmit(async ({ email }) => {
        if (!pending && (await onSubmit(email))) form.reset();
      })}
    >
      <FormFields
        fields={[
          {
            name: "email",
            label: "Email người được mời",
            type: "email",
            autoComplete: "off",
          },
        ]}
        register={form.register}
        errors={form.formState.errors}
        disabled={pending}
      />
      <p className="text-sm text-slate-500">
        Lời mời có hiệu lực 7 ngày và cấp vai trò MEMBER khi được chấp nhận.
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Đang tạo lời mời…" : "Gửi lời mời"}
      </Button>
    </form>
  );
}
