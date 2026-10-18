import { Building2, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Organization } from "../types";

export function OrganizationList({
  organizations,
}: {
  organizations: Organization[];
}) {
  if (!organizations.length)
    return (
      <section className="panel py-14 text-center">
        <Building2
          size={40}
          className="mx-auto mb-4 text-slate-400"
          aria-hidden="true"
        />
        <h2 className="text-lg font-semibold">Chưa có tổ chức khả dụng</h2>
        <p className="subtitle">
          Các tổ chức bạn tham gia và có quyền truy cập sẽ xuất hiện tại đây.
          Nhấn nút + phía trên để tạo tổ chức của bạn.
        </p>
      </section>
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {organizations.map((organization) => (
        <Link
          key={organization.id}
          to={`/organization/${encodeURIComponent(organization.slug)}`}
          className="panel transition-colors hover:border-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Building2 size={24} aria-hidden="true" />
            </span>
            <ArrowUpRight
              size={20}
              className="text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-5 break-words text-lg font-semibold">
            {organization.name}
          </h2>
          <p className="mt-1 break-words text-sm text-slate-500">
            {organization.slug}
          </p>
        </Link>
      ))}
    </div>
  );
}
