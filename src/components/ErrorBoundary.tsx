import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Unexpected error',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-stone-900"
        >
          <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-lg p-7 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B43425] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-extrabold text-stone-900">
              حدث خطأ غير متوقع / Une erreur est survenue
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed break-words">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#143D30] hover:bg-[#0e2d22] text-white text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تحميل المنصة / Recharger</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
