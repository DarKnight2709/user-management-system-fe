export interface OrganizationPermission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
}
export interface OrganizationRole {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
  permissions: OrganizationPermission[];
}
export interface PaginatedRoles {
  items: OrganizationRole[];
  total: number;
  page: number;
  limit: number;
}
export interface RoleInput {
  name: string;
  permissionIds: string[];
}
export type UpdateRoleInput = Partial<RoleInput>;
