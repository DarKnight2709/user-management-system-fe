import { NavLink } from "react-router-dom";
import { useOrganizationAccess } from "../hooks/use-organization-access";
import { organizationViews } from "../lib/organization-views";

export function OrganizationTabs({ slug }: { slug: string }) {
  const access = useOrganizationAccess();
  return (
    <nav
      aria-label="Điều hướng tổ chức"
      className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
    >
      {Object.values(organizationViews)
        .filter((view) => access.can(view.resource, view.action))
        .map((view) => (
          <NavLink
            key={view.suffix}
            to={`/organization/${encodeURIComponent(slug)}${view.suffix}`}
            end
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-100"}`
            }
          >
            {view.label}
          </NavLink>
        ))}
    </nav>
  );
}
