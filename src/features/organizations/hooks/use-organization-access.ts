import { useContext } from "react";
import { OrganizationAccessContext } from "../context/organization-access.context";

export function useOrganizationAccess() {
  const access = useContext(OrganizationAccessContext);
  if (!access) throw new Error("OrganizationAccessProvider is required.");
  return access;
}
