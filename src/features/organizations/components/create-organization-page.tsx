import { toast } from "sonner";
import { Building2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ErrorNotice } from "@/components/feedback";
import { useCreateOrganization } from "../api/organizations.api";
import { CreateOrganizationForm } from "./create-organization-form";

export function CreateOrganizationPage() {
  const create = useCreateOrganization();
  const navigate = useNavigate();
  return (
    <div className="space-y-7">
      <Button asChild variant="outline">
        <Link to="/organization">
          <ArrowLeft size={16} aria-hidden="true" />
          Tổ chức của tôi
        </Link>
      </Button>
      <header>
        <p className="eyebrow">Không gian làm việc</p>
        <h1>Tạo tổ chức mới</h1>
        <p className="subtitle">
          Tạo không gian tổ chức của bạn để bắt đầu cộng tác.
        </p>
      </header>
      <section className="panel">
        <div className="mb-6 flex items-start gap-3">
          <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Building2 size={24} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Tạo tổ chức mới</h2>
            <p className="subtitle">
              Bạn sẽ là chủ sở hữu của tổ chức được tạo.
            </p>
          </div>
        </div>
        <CreateOrganizationForm
          pending={create.isPending}
          onSubmit={async (input) => {
            try {
              await create.mutateAsync(input);
              toast.success("Đã tạo tổ chức thành công.");
              navigate("/organization");
              return true;
            } catch {
              return false;
            }
          }}
        />
        {create.isError && <ErrorNotice error={create.error} />}
      </section>
    </div>
  );
}
