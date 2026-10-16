export interface Liveness {
  status: "ok";
}
export interface Readiness extends Liveness {
  checks: { database: "up" };
}
