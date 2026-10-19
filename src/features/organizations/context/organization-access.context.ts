import { createContext } from "react";
import type { OrganizationAccess } from "../types/access";

export const OrganizationAccessContext =
  createContext<OrganizationAccess | null>(null);
