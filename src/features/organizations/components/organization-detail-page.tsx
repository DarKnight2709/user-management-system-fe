import { Link, NavLink, useParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useOrganization } from "../api/organizations.api";
import type { Organization } from "../types";
import { createOrganizationSchema } from "../schemas/organization.schema";
import { OrganizationEditor } from "./organization-editor";
import { OrganizationMembers } from "./organization-members";
import { OrganizationInvitations } from "@/features/invitations/components/organization-invitations";
import { OrganizationRoles } from "@/features/roles/components/organization-roles";

export function OrganizationDetailPage({
  view = "overview",
}: {
  view?: "overview" | "members" | "invitations" | "roles";
}) {
  const { slug } = useParams();
  const parsed = createOrganizationSchema.shape.slug.safeParse(slug);
  return (
    <div className="space-y-7">
      <Button asChild variant="outline">
        <Link to="/organization">
          <ArrowLeft size={16} aria-hidden="true" />
          Tổ chức của tôi
        </Link>
      </Button>
      <header>
        <p className="eyebrow">Không gian làm việc</p>
        <h1>
          {view === "members"
            ? "Thành viên tổ chức"
            : view === "invitations"
              ? "Lời mời tổ chức"
              : view === "roles"
                ? "Vai trò tổ chức"
                : "Chi tiết tổ chức"}
        </h1>
        <p className="subtitle">Thông tin tổ chức bạn có quyền truy cập.</p>
      </header>
      {parsed.success ? (
        <OrganizationDetail key={parsed.data} slug={parsed.data} view={view} />
      ) : (
        <ErrorNotice error={new Error("Slug tổ chức không hợp lệ.")} />
      )}
    </div>
  );
}

function OrganizationDetail({
  slug,
  view,
}: {
  slug: string;
  view: "overview" | "members" | "invitations" | "roles";
}) {
  const organization = useOrganization(slug);
  if (organization.isPending) return <Skeleton />;
  if (organization.isError)
    return (
      <ErrorNotice
        error={organization.error}
        retry={() => {
          void organization.refetch();
        }}
      />
    );
  return (
    <>
      <nav
        aria-label="Điều hướng tổ chức"
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
      >
        {[
          {
            to: `/organization/${encodeURIComponent(slug)}`,
            label: "Tổng quan",
          },
          {
            to: `/organization/${encodeURIComponent(slug)}/members`,
            label: "Thành viên",
          },
          {
            to: `/organization/${encodeURIComponent(slug)}/invitations`,
            label: "Lời mời",
          },
          {
            to: `/organization/${encodeURIComponent(slug)}/roles`,
            label: "Vai trò",
          },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-100"}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      {view === "roles" ? (
        <OrganizationRoles
          key={organization.data.id}
          organizationId={organization.data.id}
        />
      ) : view === "invitations" ? (
        <OrganizationInvitations
          key={organization.data.id}
          organizationId={organization.data.id}
        />
      ) : view === "members" ? (
        <OrganizationMembers
          key={organization.data.id}
          organizationId={organization.data.id}
          name={organization.data.name}
          ownerId={organization.data.ownerId}
        />
      ) : (
        <>
          <OrganizationDetails organization={organization.data} />
          <OrganizationEditor
            key={organization.data.id}
            organization={organization.data}
          />
        </>
      )}
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
