import {
  createBrowserRouter,
  Navigate,
  Outlet,
  Link,
  useRouteError,
} from "react-router-dom";
import { useSession } from "@/lib/session";
import { AuthPage } from "@/features/auth/components/auth-page";
import { SecurityPage } from "@/features/auth/components/security-page";
import { ProfilePage } from "@/features/users/components/profile-page";
import { UsersPage } from "@/features/users/components/users-page";
import { UserProfilePage } from "@/features/users/components/user-profile-page";
import { HealthPage } from "@/features/health/components/health-page";
import { AuditLogsPage } from "@/features/audit/components/audit-logs-page";
import { AppLayout } from "./app-layout";
import { ErrorNotice } from "@/components/feedback";
import { AccessRoute } from "./access-routes";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";
import { OrganizationsPage } from "@/features/organizations/components/organizations-page";
import { CreateOrganizationPage } from "@/features/organizations/components/create-organization-page";
import { OrganizationDetailPage } from "@/features/organizations/components/organization-detail-page";
import { AcceptInvitationPage } from "@/features/invitations/components/accept-invitation-page";
function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const current = useSession();
  if (!current || (current.portal || "user") !== (admin ? "admin" : "user"))
    return <Navigate to={admin ? "/admin/login" : "/login"} replace />;
  return <Outlet />;
}
function HomeRoute() {
  const current = useSession();
  return (
    <Navigate to={current?.portal === "admin" ? "/admin" : "/user"} replace />
  );
}
function RouteError() {
  return (
    <div className="p-10">
      <ErrorNotice error={useRouteError()} />
      <Link to="/">Về trang chủ</Link>
    </div>
  );
}
export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      { path: "/login", element: <AuthPage key="login" mode="login" /> },
      { path: "/invitations/accept", element: <AcceptInvitationPage /> },
      {
        path: "/admin/login",
        element: <AuthPage key="admin-login" mode="login" portal="admin" />,
      },
      { path: "/", element: <HomeRoute /> },
      {
        path: "/register",
        element: <AuthPage key="register" mode="register" />,
      },
      { path: "/health", element: <HealthPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout area="user" />,
            children: [
              { path: "/organization", element: <OrganizationsPage /> },
              {
                path: "/organization/:slug",
                element: <OrganizationDetailPage />,
              },
              {
                path: "/organization/:slug/members",
                element: <OrganizationDetailPage view="members" />,
              },
              {
                path: "/organization/:slug/roles",
                element: <OrganizationDetailPage view="roles" />,
              },
              {
                path: "/organization/:slug/invitations",
                element: <OrganizationDetailPage view="invitations" />,
              },
              {
                path: "/organization/:slug/audit-logs",
                element: <OrganizationDetailPage view="audit" />,
              },
              {
                path: "/organization/create",
                element: <CreateOrganizationPage />,
              },
            ],
          },
          {
            path: "/profile",
            element: <Navigate to="/user/profile" replace />,
          },
          {
            path: "/security",
            element: <Navigate to="/user/security" replace />,
          },
          { path: "/users", element: <Navigate to="/admin/users" replace /> },
          {
            path: "/user",
            element: <AppLayout area="user" />,
            children: [
              { index: true, element: <UserDashboard /> },
              {
                path: "organizations",
                element: <Navigate to="/organization" replace />,
              },
              { path: "profile", element: <ProfilePage /> },
              { path: "security", element: <SecurityPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute admin />,
        children: [
          {
            element: <AccessRoute />,
            children: [
              {
                path: "/admin",
                element: <AppLayout area="admin" />,
                children: [
                  { index: true, element: <AdminDashboard /> },
                  { path: "users", element: <UsersPage /> },
                  { path: "users/:id", element: <UserProfilePage /> },
                  { path: "health", element: <HealthPage /> },
                  { path: "audit-logs", element: <AuditLogsPage /> },
                  { path: "profile", element: <ProfilePage /> },
                  { path: "security", element: <SecurityPage /> },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: (
          <div className="p-10">
            <h1>Không tìm thấy trang</h1>
            <Link to="/">Về trang chủ</Link>
          </div>
        ),
      },
    ],
  },
]);
