import type { z } from "zod";
import type { createOrganizationSchema } from "../schemas/organization.schema";

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export interface Organization {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
