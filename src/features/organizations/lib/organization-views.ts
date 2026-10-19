import type { OrganizationView } from "../types/access";

interface OrganizationViewConfig {
  title: string;
  label: string;
  suffix: string;
  resource: string;
  action: string;
}

export const organizationViews: Record<
  OrganizationView,
  OrganizationViewConfig
> = {
  overview: {
    title: "Chi tiết tổ chức",
    label: "Tổng quan",
    suffix: "",
    resource: "ORGANIZATION",
    action: "read",
  },
  members: {
    title: "Thành viên tổ chức",
    label: "Thành viên",
    suffix: "/members",
    resource: "ORGANIZATION_MEMBER",
    action: "read",
  },
  invitations: {
    title: "Lời mời tổ chức",
    label: "Lời mời",
    suffix: "/invitations",
    resource: "ORGANIZATION_MEMBER",
    action: "invite",
  },
  roles: {
    title: "Vai trò tổ chức",
    label: "Vai trò",
    suffix: "/roles",
    resource: "ORGANIZATION_ROLE",
    action: "read",
  },
};
