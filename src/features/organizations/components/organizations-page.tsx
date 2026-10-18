import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { useOrganizations } from "../api/organizations.api";
import { OrganizationList } from "./organization-list";

export function OrganizationsPage() {
  const [params, setParams] = useSearchParams();
  const requestedPage = Number(params.get("page") || 1);
  const page =
    Number.isInteger(requestedPage) &&
    requestedPage >= 1 &&
    requestedPage <= 1_000_000
      ? requestedPage
      : 1;
  const organizations = useOrganizations(page);
  function changePage(nextPage: number) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("page", String(nextPage));
      return next;
    });
  }
  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="eyebrow">Không gian làm việc</p>
          <h1>Tổ chức của tôi</h1>
          <p className="subtitle">
            Các tổ chức bạn tham gia và có quyền truy cập.
          </p>
        </div>
        <Button asChild>
          <Link to="/organization/create">
            <Plus size={18} aria-hidden="true" />
            <span>Tạo tổ chức</span>
          </Link>
        </Button>
      </header>
      {organizations.isPending ? (
        <Skeleton />
      ) : organizations.isError ? (
        <ErrorNotice
          error={organizations.error}
          retry={() => {
            void organizations.refetch();
          }}
        />
      ) : (
        <>
          <p className="text-sm text-slate-500">
            {organizations.data.total} tổ chức
          </p>
          {organizations.data.items.length === 0 &&
          organizations.data.total > 0 ? (
            <section className="panel">
              <p className="mb-4 text-sm text-slate-500">
                Trang này không có tổ chức nào.
              </p>
              <Button variant="outline" onClick={() => changePage(1)}>
                Về trang đầu
              </Button>
            </section>
          ) : (
            <OrganizationList organizations={organizations.data.items} />
          )}
          {organizations.data.total > 0 && (
            <nav
              aria-label="Phân trang tổ chức"
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <p className="text-sm text-slate-500">
                Trang {page} /{" "}
                {Math.max(
                  page,
                  Math.ceil(
                    organizations.data.total / organizations.data.limit,
                  ),
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1 || organizations.isFetching}
                  onClick={() => changePage(page - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  disabled={
                    page >= 1_000_000 ||
                    page * organizations.data.limit >=
                      organizations.data.total ||
                    organizations.isFetching
                  }
                  onClick={() => changePage(page + 1)}
                >
                  Sau
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
