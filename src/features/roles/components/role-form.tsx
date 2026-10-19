import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/form-fields";
import { roleSchema } from "../schemas/role.schema";
import type {
  OrganizationPermission,
  OrganizationRole,
  RoleInput,
} from "../types";

export function RoleForm({
  role,
  permissions,
  pending,
  onSubmit,
  onCancel,
}: {
  role: OrganizationRole | null;
  permissions: OrganizationPermission[];
  pending: boolean;
  onSubmit: (input: RoleInput) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm<RoleInput>({
    resolver: zodResolver(
      roleSchema.extend({
        permissionIds: roleSchema.shape.permissionIds.refine(
          (ids) =>
            ids.every((id) =>
              permissions.some((permission) => permission.id === id),
            ),
          "Danh sách quyền đã thay đổi. Vui lòng mở lại biểu mẫu.",
        ),
      }),
    ),
    defaultValues: {
      name: role?.name || "",
      permissionIds: role?.permissions.map((permission) => permission.id) || [],
    },
  });
  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={form.handleSubmit(async (input) => {
        if (!pending) await onSubmit(input);
      })}
    >
      <FormFields
        fields={[{ name: "name", label: "Tên vai trò", autoComplete: "off" }]}
        register={form.register}
        errors={form.formState.errors}
        disabled={pending}
      />
      <fieldset disabled={pending} className="space-y-3">
        <legend className="mb-3 text-sm font-semibold">
          Quyền của vai trò
        </legend>
        <p className="mb-4 text-sm text-slate-500">
          Danh sách được lưu sẽ thay thế toàn bộ quyền của vai trò. Bỏ chọn tất
          cả để xóa mọi quyền.
        </p>
        {permissions.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm"
              >
                <input
                  type="checkbox"
                  value={permission.id}
                  {...form.register("permissionIds")}
                  className="mt-1 accent-indigo-600"
                />
                <span>
                  <span className="break-all font-medium">
                    {permission.resource}:{permission.action}
                  </span>
                  {permission.description && (
                    <span className="mt-1 block text-xs text-slate-500">
                      {permission.description}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Chưa có quyền khả dụng.</p>
        )}
        {form.formState.errors.permissionIds?.message && (
          <p role="alert" className="text-sm text-red-600">
            {form.formState.errors.permissionIds.message}
          </p>
        )}
      </fieldset>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang lưu…" : "Lưu vai trò"}
        </Button>
        <Button variant="outline" disabled={pending} onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
