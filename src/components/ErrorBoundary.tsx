import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorMsg = error.toString().toLowerCase();
    const isChunkError = 
      errorMsg.includes('chunk') || 
      errorMsg.includes('loading chunk') || 
      errorMsg.includes('failed to fetch') || 
      errorMsg.includes('dynamic import') ||
      errorMsg.includes('dynamically imported');

    return { 
      hasError: true, 
      error, 
      isChunkError 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Auto-reload the page once on a chunk failure to get the freshest build files
    if (this.state.isChunkError) {
      const lastReload = sessionStorage.getItem('last-chunk-reload');
      const now = Date.now();
      // Only auto-reload if the last automatic reload was more than 10 seconds ago
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('last-chunk-reload', now.toString());
        console.warn('Chunk load error detected. Refreshing the browser to load the latest build files...');
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    sessionStorage.removeItem('last-chunk-reload');
    this.setState({ hasError: false, error: null, isChunkError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.state.isChunkError) {
        return (
          <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900" id="chunk_error_boundary">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-rose-100 dark:border-rose-950/30 p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-5">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Gagal Memuat Halaman</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Sebagian berkas pembaruan situs gagal diunduh atau koneksi jaringan Anda terputus. silakan muat ulang halaman ini.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="w-full px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 4H2.1" />
                  </svg>
                  Segarkan Halaman
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = '#/'}
                  className="w-full px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Generic render error
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900" id="generic_error_boundary">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-100 dark:border-amber-950/30 p-8 text-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-5">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Terjadi Hambatan Teknis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Sistem mendeteksi kesalahan tampilan internal. Silakan muat ulang halaman ini untuk memulihkan tampilan.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full px-5 py-3 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-900 dark:hover:bg-white transition-all duration-150 cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
