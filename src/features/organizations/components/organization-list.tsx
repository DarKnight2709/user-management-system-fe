import { Building2 } from "lucide-react";
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
        <h2 className="text-lg font-semibold">Bạn chưa tham gia tổ chức nào</h2>
        <p className="subtitle">
          Các tổ chức bạn tham gia sẽ xuất hiện tại đây. Nhấn nút + phía trên để
          tạo tổ chức của bạn.
        </p>
      </section>
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {organizations.map((organization) => (
        <article key={organization.id} className="panel">
          <span className="inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Building2 size={24} aria-hidden="true" />
          </span>
          <h2 className="mt-5 break-words text-lg font-semibold">
            {organization.name}
          </h2>
          <p className="mt-1 break-words text-sm text-slate-500">
            {organization.slug}
          </p>
        </article>
      ))}
    </div>
  );
}
