import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { FormFields } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { createOrganizationSchema } from "../schemas/organization.schema";
import type { CreateOrganizationInput } from "../types";

export function CreateOrganizationForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (input: CreateOrganizationInput) => Promise<boolean>;
}) {
  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: "", slug: "" },
  });
  return (
    <form
      className="max-w-xl space-y-5"
      noValidate
      onSubmit={form.handleSubmit(async (input) => {
        if (pending) return;
        if (await onSubmit(input)) form.reset();
      })}
    >
      <FormFields
        fields={[
          { name: "name", label: "Tên tổ chức", autoComplete: "organization" },
          { name: "slug", label: "Slug", autoComplete: "off" },
        ]}
        register={form.register}
        errors={form.formState.errors}
        disabled={pending}
      />
      <p className="text-sm leading-6 text-slate-500">
        Slug là định danh duy nhất, dài 3–63 ký tự. Sử dụng chữ cái không dấu,
        số và dấu gạch nối, ví dụ:{" "}
        <span className="font-medium text-slate-700">my-team</span>.
      </p>
      <Button type="submit" disabled={pending}>
        <Plus size={16} aria-hidden="true" />
        {pending ? "Đang tạo tổ chức…" : "Tạo tổ chức"}
      </Button>
    </form>
  );
}
