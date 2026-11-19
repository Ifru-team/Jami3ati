import React from 'react';
import { AlertTriangle, Lock, X } from 'lucide-react';
import { Language } from '../types';

export interface ModeratorUser {
  id: string;
  name_ar: string;
  name_fr: string;
  email: string;
  role: 'lead_verifier' | 'open_data_specialist';
  role_title_ar: string;
  role_title_fr: string;
  avatar_code: string;
  badge_color?: string;
  isCloudAuthorized?: boolean;
}

interface ModeratorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: ModeratorUser, rememberMe?: boolean) => void;
  lang: Language;
}

/**
 * The previous implementation authenticated fixed credentials entirely in the
 * browser. This gate intentionally remains closed until a server-verified auth
 * provider and role authorization are implemented.
 */
export const ModeratorLoginModal: React.FC<ModeratorLoginModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 p-4" role="presentation">
      <section
        dir={isAr ? 'rtl' : 'ltr'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="moderator-auth-title"
        className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          className="absolute end-4 top-4 rounded-lg p-2 text-stone-500 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <Lock className="h-6 w-6" />
        </div>
        <h2 id="moderator-auth-title" className="mb-2 text-xl font-bold text-stone-900">
          {isAr ? 'دخول المشرفين غير متاح حالياً' : 'Moderator access is currently unavailable'}
        </h2>
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
          <p>
            {isAr
              ? 'تم تعطيل تسجيل الدخول التجريبي لأن التحقق السابق كان يتم داخل المتصفح باستخدام كلمات مرور ثابتة، وهو غير آمن. سيُفتح هذا الفضاء بعد إعداد مصادقة خادمية والتحقق من صلاحيات كل مشرف.'
              : 'Demo login has been disabled because the previous password check ran in the browser with hard-coded credentials. Moderator access will reopen after server-side authentication and role authorization are configured.'}
          </p>
        </div>
        <p className="mt-4 text-xs text-stone-500">
          {isAr ? 'لا تستخدم هذه المنصة حالياً لإدارة بيانات إنتاجية أو حساسة.' : 'Do not use this portal to manage production or sensitive data yet.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#143D30] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0e2c23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {isAr ? 'إغلاق' : 'Close'}
        </button>
      </section>
    </div>
  );
};
