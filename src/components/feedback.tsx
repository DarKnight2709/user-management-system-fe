import { Component, type ReactNode } from "react";
import { errorMessage } from "@/lib/errors";
import { Button } from "./ui/button";
export function ErrorNotice({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="my-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <p className="whitespace-pre-line">{errorMessage(error)}</p>
      {retry && (
        <Button variant="outline" className="mt-3" onClick={retry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="mx-auto max-w-lg p-8">
        <h1>Giao diện gặp lỗi.</h1>
        <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
      </main>
    ) : (
      this.props.children
    );
  }
}
