import React from 'react';

interface AppErrorBoundaryState {
  failed: boolean;
}

/**
 * Last-resort guard for runtime/schema errors. Persisted-data migrations should
 * prevent known failures; this boundary guarantees an unexpected render error
 * never degrades into an unexplained blank white phone.
 */
export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Mneme render recovery boundary', error, info);
  }

  private recoverDemo = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('mneme_'))
      .forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1b1533] p-0 sm:p-6">
        <div className="flex h-screen w-full flex-col items-center justify-center gap-[20px] overflow-hidden bg-[#f8f6fd] px-[32px] text-center sm:h-[856px] sm:w-[390px] sm:rounded-[40px]">
          <div className="flex w-full flex-col gap-[8px] overflow-hidden">
            <h1 className="text-[20px] leading-[28px] font-medium text-[#0e0727]">Mneme cần tải lại dữ liệu</h1>
            <p className="text-[14px] leading-[20px] text-[#9490a2]">
              Dữ liệu lưu trên thiết bị không tương thích với phiên bản hiện tại.
            </p>
          </div>
          <button
            type="button"
            onClick={this.recoverDemo}
            className="flex h-[48px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#7758e2] px-[16px] text-[16px] leading-[22px] font-medium text-white"
          >
            Khôi phục dữ liệu demo
          </button>
        </div>
      </div>
    );
  }
}
