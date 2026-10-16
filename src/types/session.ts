export interface Session {
  accessToken: string;
  refreshToken: string;
  portal?: "admin" | "user";
}
export interface CurrentUser {
  id: string;
  email: string;
  username: string;
}
