import type { PaginatedOrganizations } from "./index";

export type AdminOrganizationStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type ManageableOrganizationStatus = Exclude<AdminOrganizationStatus, "DELETED">;

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; username: string; firstName: string; lastName: string };
  status: AdminOrganizationStatus;
}

export interface PaginatedAdminOrganizations extends Omit<PaginatedOrganizations, "items"> {
  items: AdminOrganization[];
}
