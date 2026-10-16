export function Skeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải"
      className="space-y-4 animate-pulse"
    >
      <div className="h-8 w-1/3 rounded bg-slate-200" />
      <div className="h-40 rounded-xl bg-slate-100" />
      <span className="sr-only">Đang tải…</span>
    </div>
  );
}
