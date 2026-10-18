import type { PaginatedOrganizations } from "../types";

export async function resolveOrganizationId(
  slug: string,
  loadPage: (page: number) => Promise<PaginatedOrganizations>,
): Promise<string> {
  for (let page = 1; page <= 1_000_000; page += 1) {
    const result = await loadPage(page);
    const organization = result.items.find((item) => item.slug === slug);
    if (organization) return organization.id;
    if (!result.items.length || result.page * result.limit >= result.total)
      break;
  }
  throw new Error("Không tìm thấy tổ chức hoặc bạn không có quyền truy cập.");
}
