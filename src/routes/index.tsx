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
import { HealthPage } from "@/features/health/components/health-page";
import { AppLayout } from "./app-layout";
import { ErrorNotice } from "@/components/feedback";
function ProtectedRoute() {
  return useSession() ? <Outlet /> : <Navigate to="/login" replace />;
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
      { path: "/", element: <Navigate to="/profile" replace /> },
      { path: "/login", element: <AuthPage key="login" mode="login" /> },
      {
        path: "/register",
        element: <AuthPage key="register" mode="register" />,
      },
      { path: "/health", element: <HealthPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "/profile", element: <ProfilePage /> },
              { path: "/users", element: <UsersPage /> },
              { path: "/security", element: <SecurityPage /> },
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
