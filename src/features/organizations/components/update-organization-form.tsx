import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/form-fields";
import { updateOrganizationSchema } from "../schemas/organization.schema";
import type { UpdateOrganizationInput } from "../types";

export function UpdateOrganizationForm({
  name,
  pending,
  onSubmit,
  onCancel,
}: {
  name: string;
  pending: boolean;
  onSubmit: (input: UpdateOrganizationInput) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: { name },
  });
  return (
    <form
      className="max-w-xl space-y-5"
      noValidate
      onSubmit={form.handleSubmit(async (input) => {
        if (!pending) await onSubmit(input);
      })}
    >
      <FormFields
        fields={[
          { name: "name", label: "Tên tổ chức", autoComplete: "organization" },
        ]}
        register={form.register}
        errors={form.formState.errors}
        disabled={pending}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending || !form.formState.isDirty}>
          {pending ? "Đang lưu…" : "Lưu thay đổi"}
        </Button>
        <Button variant="outline" disabled={pending} onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
