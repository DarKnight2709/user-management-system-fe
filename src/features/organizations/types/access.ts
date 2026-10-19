export interface EffectivePermission {
  id: string;
  resource: string;
  action: string;
}

export interface OrganizationAccess {
  userId: string;
  isOwner: boolean;
  can: (resource: string, action: string) => boolean;
}

export type OrganizationView = "overview" | "members" | "invitations" | "roles";
