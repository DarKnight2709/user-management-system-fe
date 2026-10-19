import { Building2 } from "lucide-react";
import type { Organization } from "../types";
import { useOrganizationAccess } from "../hooks/use-organization-access";
import { OrganizationEditor } from "./organization-editor";
import { OrganizationOwnership } from "./organization-ownership";
import { LeaveOrganization } from "./leave-organization";

export function OrganizationOverview({
  organization,
}: {
  organization: Organization;
}) {
  const access = useOrganizationAccess();
  return (
    <>
      <OrganizationDetails organization={organization} />
      {access.can("ORGANIZATION", "update") && (
        <OrganizationEditor key={organization.id} organization={organization} />
      )}
      {access.isOwner && (
        <OrganizationOwnership
          key={organization.ownerId}
          organization={organization}
        />
      )}
      <LeaveOrganization
        key={organization.ownerId}
        organization={organization}
      />
    </>
  );
}

function OrganizationDetails({ organization }: { organization: Organization }) {
  const fields = [
    { label: "ID tổ chức", value: organization.id },
    { label: "Slug", value: organization.slug },
    { label: "ID chủ sở hữu", value: organization.ownerId },
    {
      label: "Trạng thái",
      value: organization.isActive ? "Đang hoạt động" : "Không hoạt động",
    },
    {
      label: "Ngày tạo",
      value: new Date(organization.createdAt).toLocaleString("vi-VN"),
    },
    {
      label: "Cập nhật gần nhất",
      value: new Date(organization.updatedAt).toLocaleString("vi-VN"),
    },
  ];
  return (
    <section className="panel">
      <div className="mb-7 flex items-center gap-4 border-b border-slate-100 pb-6">
        <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Building2 size={28} aria-hidden="true" />
        </span>
        <h2 className="min-w-0 break-words text-xl font-semibold">
          {organization.name}
        </h2>
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="mt-2 break-words text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
