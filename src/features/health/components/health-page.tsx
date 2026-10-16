import { Link } from "react-router-dom";
import { useHealth } from "../api/health.api";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { Button } from "@/components/ui/button";
export function HealthPage() {
  const { live, ready, greeting } = useHealth();
  return (
    <div className="mx-auto max-w-4xl space-y-7 p-6 sm:p-10">
      <header>
        <p className="eyebrow">Hệ thống</p>
        <h1>Trạng thái kết nối</h1>
        <p className="subtitle">Kiểm tra ứng dụng và cơ sở dữ liệu backend.</p>
      </header>
      <Button asChild variant="outline">
        <Link to="/profile">Về tài khoản</Link>
      </Button>
      {[
        { title: "Ứng dụng", query: live },
        { title: "PostgreSQL", query: ready },
        { title: "Lời chào API", query: greeting },
      ].map(({ title, query }) => (
        <section className="panel" key={title}>
          <h2 className="mb-4 font-semibold">{title}</h2>
          {query.isPending ? (
            <Skeleton />
          ) : query.isError ? (
            <ErrorNotice
              error={query.error}
              retry={() => {
                void query.refetch();
              }}
            />
          ) : (
            <p className="text-sm text-emerald-700">
              {typeof query.data === "string"
                ? query.data
                : "Hoạt động bình thường"}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
