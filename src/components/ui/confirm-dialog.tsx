import * as Dialog from "@radix-ui/react-alert-dialog";
import { Button } from "./button";
export function ConfirmDialog({
  title,
  description,
  pending,
  onConfirm,
}: {
  title: string;
  description: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="destructive" disabled={pending}>
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="my-4 text-sm text-slate-600">
            {description}
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Cancel asChild>
              <Button variant="outline">Hủy</Button>
            </Dialog.Cancel>
            <Dialog.Action asChild>
              <Button variant="destructive" onClick={onConfirm}>
                Xác nhận
              </Button>
            </Dialog.Action>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
