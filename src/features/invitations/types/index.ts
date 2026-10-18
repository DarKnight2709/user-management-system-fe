export type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
export type DeliveryStatus = "NOT_QUEUED" | "QUEUED" | "SENT" | "FAILED";
export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  status: InvitationStatus;
  expiresAt: string;
  invitedById: string;
  createdAt: string;
  resendCount: number;
  lastRequestedAt: string;
  deliveryStatus: DeliveryStatus;
  sentAt: string | null;
  role: "MEMBER";
}
export interface PaginatedInvitations {
  items: Invitation[];
  total: number;
  page: number;
  limit: number;
}
export interface InvitationDelivery {
  emailQueued: boolean;
}
export interface InvitationLink {
  id: string;
  inviteLink: string;
  expiresAt: string;
}
export interface AcceptedInvitation {
  organizationId: string;
  membershipId: string;
}
