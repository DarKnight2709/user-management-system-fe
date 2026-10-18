import type { z } from "zod";
import type {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "../schemas/organization.schema";

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export interface Organization {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreatedOrganization extends Organization {
  deletedAt: string | null;
}
export interface PaginatedOrganizations {
  items: Organization[];
  total: number;
  page: number;
  limit: number;
}

export interface OrganizationMember {
  id: string;
  status: "ACTIVE";
  createdAt: string;
  user: { id: string; username: string; firstName: string; lastName: string };
  isOwner: boolean;
  roles: { id: string; name: string }[];
}

export interface PaginatedOrganizationMembers {
  items: OrganizationMember[];
  total: number;
  page: number;
  limit: number;
}
