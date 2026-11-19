import React from 'react';
import { AlertTriangle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { ModeratorUser } from './ModeratorLoginModal';

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: ModeratorUser, rememberMe?: boolean) => void;
  lang: Language;
  onToggleLanguage?: () => void;
}

/**
 * Moderator login is intentionally unavailable until authentication is
 * performed by a trusted server-side identity provider.
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  lang,
  onToggleLanguage,
}) => {
  const isAr = lang === 'ar';

  return (
    <main
      dir={isAr ? 'rtl' : 'ltr'}
      className="flex-1 min-h-[70vh] bg-[#FAF8F5] px-4 py-12 sm:py-16 flex items-center justify-center"
    >
      <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 sm:p-9 shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#143D30]/10 text-[#143D30]">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-stone-900">
          {isAr ? 'فضاء المكلفين والمشرفين' : 'Espace modérateurs'}
        </h1>
        <p className="mt-2 text-center text-sm leading-7 text-stone-500">
          {isAr
            ? 'هذا الفضاء مخصص للمشرفين المعتمدين على منصة جامعتي.'
            : 'Cet espace est réservé aux modérateurs autorisés de Jami3ati.'}
        </p>

        <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <h2 className="font-bold">
                {isAr ? 'تسجيل الدخول معطّل مؤقتاً' : 'Connexion temporairement désactivée'}
              </h2>
              <p className="mt-1 text-sm leading-7">
                {isAr
                  ? 'أوقفنا الحسابات التجريبية وكلمات المرور المضمّنة في الواجهة. لن يُسمح بالدخول حتى إعداد مصادقة خادمية موثوقة والتحقق من صلاحيات المستخدم.'
                  : 'Les comptes de démonstration et mots de passe intégrés à l’interface ont été désactivés. L’accès sera rétabli après la mise en place d’une authentification côté serveur et du contrôle des rôles.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#143D30] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0e2d23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D30]"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAr ? 'العودة إلى الرئيسية' : 'Retour à l’accueil'}
          </button>
          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              {isAr ? 'Français' : 'العربية'}
            </button>
          )}
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-stone-400">
          <Lock className="h-3.5 w-3.5" />
          {isAr ? 'الوصول الإداري غير متاح في النسخة الحالية' : 'Accès administratif indisponible dans cette version'}
        </p>
      </section>
    </main>
  );
};
