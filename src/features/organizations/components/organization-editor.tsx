import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ErrorNotice } from "@/components/feedback";
import { useUpdateOrganization } from "../api/organizations.api";
import type { Organization } from "../types";
import { UpdateOrganizationForm } from "./update-organization-form";

export function OrganizationEditor({
  organization,
}: {
  organization: Organization;
}) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateOrganization(organization.id);
  return (
    <section className="panel">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Thông tin tổ chức</h2>
          <p className="subtitle">
            Đổi tên tổ chức với quyền cập nhật. Slug của tổ chức được giữ
            nguyên.
          </p>
        </div>
        {!editing && (
          <Button
            variant="outline"
            onClick={() => {
              update.reset();
              setEditing(true);
            }}
          >
            <Pencil size={16} aria-hidden="true" />
            Chỉnh sửa tên
          </Button>
        )}
      </div>
      {editing && (
        <>
          <UpdateOrganizationForm
            name={organization.name}
            pending={update.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={async (input) => {
              try {
                await update.mutateAsync(input);
                toast.success("Đã cập nhật tên tổ chức.");
                setEditing(false);
              } catch {
                return;
              }
            }}
          />
          {update.isError && <ErrorNotice error={update.error} />}
        </>
      )}
    </section>
  );
}
