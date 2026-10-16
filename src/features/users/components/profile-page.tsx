import { toast } from "sonner";
import { useMe, endSession } from "@/features/auth/api/auth.api";
import {
  useUser,
  useUpdateUser,
  useUploadAvatar,
  useDeleteUser,
} from "../api/users.api";
import { avatarSchema } from "../schemas/user.schema";
import { ProfileForm } from "./profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorNotice } from "@/components/feedback";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export function ProfilePage() {
  const me = useMe();
  if (me.isPending) return <Skeleton />;
  if (me.isError)
    return (
      <ErrorNotice
        error={me.error}
        retry={() => {
          void me.refetch();
        }}
      />
    );
  return <ProfileDetail id={me.data.id} />;
}
function ProfileDetail({ id }: { id: string }) {
  const user = useUser(id);
  const update = useUpdateUser();
  const upload = useUploadAvatar();
  const remove = useDeleteUser();
  if (user.isPending) return <Skeleton />;
  if (user.isError)
    return (
      <ErrorNotice
        error={user.error}
        retry={() => {
          void user.refetch();
        }}
      />
    );
  return (
    <div className="space-y-7">
      <header>
        <p className="eyebrow">Tài khoản</p>
        <h1>Hồ sơ cá nhân</h1>
        <p className="subtitle">Cập nhật thông tin và ảnh đại diện của bạn.</p>
      </header>
      <section className="panel flex flex-wrap items-center gap-5">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-600">
          {user.data.avatarUrl ? (
            <img
              src={user.data.avatarUrl}
              alt="Ảnh đại diện"
              className="size-full object-cover"
            />
          ) : (
            user.data.username.slice(0, 2).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="font-semibold">
            {user.data.firstName} {user.data.lastName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            JPEG · Tối đa 2 MB · Tối đa 16 triệu pixel
          </p>
          <label
            className="mt-3 block text-sm font-medium text-indigo-600"
            htmlFor="avatar"
          >
            {upload.isPending ? "Đang tải ảnh…" : "Đổi ảnh đại diện"}
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/jpeg"
            disabled={upload.isPending}
            className="mt-2 max-w-full text-sm file:mr-3 file:rounded file:border-0 file:p-2"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              const parsed = avatarSchema.safeParse(file);
              if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message);
                return;
              }
              upload.mutate(file, {
                onSuccess: () => toast.success("Đã cập nhật ảnh."),
              });
            }}
          />
        </div>
      </section>
      <section className="panel">
        <h2 className="mb-6 text-lg font-semibold">Thông tin cơ bản</h2>
        <ProfileForm
          key={user.data.updatedAt}
          user={user.data}
          pending={update.isPending}
          onSubmit={async (input) => {
            try {
              await update.mutateAsync(input);
              toast.success("Đã lưu hồ sơ.");
            } catch {
              return;
            }
          }}
        />
        {update.isError && <ErrorNotice error={update.error} />}
      </section>
      <section className="panel border-red-200">
        <h2 className="font-semibold text-red-700">Xóa tài khoản</h2>
        <p className="my-3 text-sm text-slate-500">
          Tài khoản sẽ bị vô hiệu hóa và các phiên refresh bị thu hồi. Thao tác
          không thể hoàn tác qua giao diện.
        </p>
        <ConfirmDialog
          title="Xóa tài khoản của tôi"
          description="Bạn chắc chắn muốn xóa tài khoản đang đăng nhập?"
          pending={remove.isPending}
          onConfirm={() => remove.mutate(id, { onSuccess: endSession })}
        />
      </section>
    </div>
  );
}
