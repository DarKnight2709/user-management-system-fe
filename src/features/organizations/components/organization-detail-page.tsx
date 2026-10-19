import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { OrganizationInvitations } from "@/features/invitations/components/organization-invitations";
import { OrganizationRoles } from "@/features/roles/components/organization-roles";
import { useOrganization } from "../api/organizations.api";
import { useOrganizationAccess } from "../hooks/use-organization-access";
import { organizationViews } from "../lib/organization-views";
import { createOrganizationSchema } from "../schemas/organization.schema";
import type { Organization } from "../types";
import type { OrganizationView } from "../types/access";
import { OrganizationAccessProvider } from "./organization-access";
import { OrganizationMembers } from "./organization-members";
import { OrganizationOverview } from "./organization-overview";
import { OrganizationTabs } from "./organization-tabs";

export function OrganizationDetailPage({
  view = "overview",
}: {
  view?: OrganizationView;
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
        <h1>{organizationViews[view].title}</h1>
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
  view: OrganizationView;
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
      {organization.isFetching && <Skeleton />}
      <div hidden={organization.isFetching}>
        <OrganizationAccessProvider organization={organization.data}>
          <OrganizationContent
            organization={organization.data}
            slug={slug}
            view={view}
          />
        </OrganizationAccessProvider>
      </div>
    </>
  );
}

function OrganizationContent({
  organization,
  slug,
  view,
}: {
  organization: Organization;
  slug: string;
  view: OrganizationView;
}) {
  const access = useOrganizationAccess();
  const required = organizationViews[view];
  if (!access.can(required.resource, required.action)) {
    return (
      <Navigate
        to={
          view === "overview"
            ? "/organization"
            : `/organization/${encodeURIComponent(slug)}`
        }
        replace
      />
    );
  }
  return (
    <>
      <OrganizationTabs slug={slug} />
      <OrganizationViewContent
        key={organization.id}
        organization={organization}
        view={view}
      />
    </>
  );
}

function OrganizationViewContent({
  organization,
  view,
}: {
  organization: Organization;
  view: OrganizationView;
}) {
  switch (view) {
    case "roles":
      return <OrganizationRoles organizationId={organization.id} />;
    case "invitations":
      return <OrganizationInvitations organizationId={organization.id} />;
    case "members":
      return (
        <OrganizationMembers
          organizationId={organization.id}
          name={organization.name}
          ownerId={organization.ownerId}
        />
      );
    case "overview":
      return <OrganizationOverview organization={organization} />;
  }
}
