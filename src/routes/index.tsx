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
import { AppLayout } from "./app-layout";
import { ErrorNotice } from "@/components/feedback";
import { AccessRoute } from "./access-routes";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { UserDashboard } from "@/features/dashboard/components/user-dashboard";
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
