import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Sparkles,
  UserCheck,
  Shield,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { ModeratorUser, DEMO_MODERATORS } from './ModeratorLoginModal';

interface LoginPageProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: ModeratorUser, rememberMe?: boolean) => void;
  lang: Language;
  onToggleLanguage?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToHome,
  onLoginSuccess,
  lang,
  onToggleLanguage,
}) => {
  const isAr = lang === 'ar';

  const [activeTabRole, setActiveTabRole] = useState<'open_data_specialist' | 'lead_verifier'>('open_data_specialist');
  const [email, setEmail] = useState('mod@jami3ati.ma');
  const [password, setPassword] = useState('mod2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleTabChange = (role: 'open_data_specialist' | 'lead_verifier') => {
    setActiveTabRole(role);
    setErrorMsg('');
    if (role === 'lead_verifier') {
      setEmail('admin@jami3ati.ma');
      setPassword('admin2026');
    } else {
      setEmail('mod@jami3ati.ma');
      setPassword('mod2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanEmail === 'admin@jami3ati.ma' && cleanPass === 'admin2026') {
        setIsLoading(false);
        onLoginSuccess(DEMO_MODERATORS[1], rememberMe);
      } else if (
        (cleanEmail === 'mod@jami3ati.ma' || cleanEmail === 'moderator@jami3ati.ma') &&
        cleanPass === 'mod2026'
      ) {
        setIsLoading(false);
        onLoginSuccess(DEMO_MODERATORS[0], rememberMe);
      } else {
        setIsLoading(false);
        setErrorMsg(
          isAr
            ? 'بيانات الاعتماد غير صحيحة. يمكنك النقر على زر "دخول سريع" أدناه للمعاينة المباشرة.'
            : 'Identifiants incorrects. Utilisez le bouton "Accès démo" ci-dessous.'
        );
      }
    }, 350);
  };

  const handleQuickLogin = (mod: ModeratorUser) => {
    setEmail(mod.email);
    setPassword(mod.role === 'lead_verifier' ? 'admin2026' : 'mod2026');
    setActiveTabRole(mod.role);
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ ...mod, isCloudAuthorized: false }, rememberMe);
    }, 300);
  };

  const handleGoogleSignIn = () => {
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setErrorMsg(
        isAr
          ? 'تم إيقاف خدمة المصادقة السحابية مؤقتاً بناءً على الطلب. يرجى استخدام الدخول السريع أدناه.'
          : 'Service d’authentification cloud désactivé. Veuillez utiliser l’accès rapide ci-dessous.'
      );
    }, 300);
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      {/* Main Form Center */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-12 pb-24 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Right Column: Information & Governance Value Prop */}
        <div className="lg:col-span-6 order-2 lg:order-1 space-y-4 sm:space-y-5 text-stone-800">
          <div className="flex items-start sm:items-center gap-1.5 text-[#143D30] text-[11px] sm:text-xs font-bold leading-snug">
            <Building2 className="w-4 h-4 text-[#143D30] shrink-0 mt-0.5 sm:mt-0" />
            <span>{isAr ? 'منظومة حكامة البيانات الجامعية' : 'Gouvernance des Données Ouvertes'}</span>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold text-stone-900 leading-snug sm:leading-tight">
            {isAr ? 'بوابة دخول المكلفين بالتدقيق والحكامة الأكاديمية' : 'Portail Officiel d’Audit & Gouvernance'}
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed">
            {isAr
              ? 'تتيح هذه الصفحة المخصصة للمكلفين المعتمدين والمشرفين الأكاديميين متابعة بلاغات الطلبة، فحص روابط الإثبات الرسمية، ومطابقة البيانات مع المنشورات الحكومية في data.gov.ma.'
              : 'Espace sécurisé réservé aux modérateurs pour la vérification des signalements et la mise à jour des données universitaires.'}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">{isAr ? 'تدقيق دقيق ومستمر' : 'Audit continu'}</span>
                <span className="text-stone-500">{isAr ? 'مطابقة بيانات أكثر من 30 مؤسسة وجامعة وطنية.' : 'Vérification continue des 30+ établissements.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">{isAr ? 'اعتماد المصادر الموثقة' : 'Sources certifiées'}</span>
                <span className="text-stone-500">{isAr ? 'ربط مباشر بالمراسيم الرسمية ومواقع الجامعات.' : 'Lien direct avec les décrets et portails officiels.'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: Standalone Login Box */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="bg-[#143D30] text-white p-4 sm:p-6 border-b border-amber-400/20">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[11px] sm:text-xs font-bold text-amber-300 font-mono">256-bit TLS Encrypted Session</span>
                <KeyRound className="w-4 h-4 text-amber-300" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isAr ? 'تسجيل الدخول الآمن' : 'Connexion Modérateur'}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-emerald-50 border-2 border-[#143D30]/30 hover:border-[#143D30] text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Shield className="w-4 h-4 text-[#143D30]" />
                <span>
                  {isAr
                    ? 'تسجيل الدخول بحساب Google المعتمد (Cloud)'
                    : 'Connexion Google Vérifiée (Cloud)'}
                </span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <div className="h-px bg-stone-200 flex-1" />
                <span>{isAr ? 'أو دخول المعاينة المحلية' : 'ou aperçu local'}</span>
                <div className="h-px bg-stone-200 flex-1" />
              </div>

              {/* Role Segmented Switcher */}
              <div className="p-1 bg-stone-100 rounded-2xl grid grid-cols-2 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('open_data_specialist')}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTabRole === 'open_data_specialist'
                      ? 'bg-[#143D30] text-white shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="truncate">{isAr ? 'أخصائي البيانات المفتوحة' : 'Open Data Specialist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTabChange('lead_verifier')}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTabRole === 'lead_verifier'
                      ? 'bg-[#143D30] text-white shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span className="truncate">{isAr ? 'المشرف الأكاديمي الرئيسي' : 'Lead Auditor'}</span>
                </button>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-800">
                      {isAr ? 'البريد المهني / اسم المستخدم' : 'Email / Identifiant'}
                    </label>
                    <span className="text-[11px] text-[#143D30] font-mono font-semibold">
                      {activeTabRole === 'lead_verifier' ? 'admin@jami3ati.ma' : 'mod@jami3ati.ma'}
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mod@jami3ati.ma"
                      className="w-full ps-10 pe-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-[#143D30] focus:ring-2 focus:ring-[#143D30]/10 text-left transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-800">
                      {isAr ? 'كلمة المرور / الرمز الأمني' : 'Mot de passe'}
                    </label>
                    <span className="text-[11px] text-amber-900 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      {activeTabRole === 'lead_verifier' ? 'admin2026' : 'mod2026'}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full ps-10 pe-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-[#143D30] focus:ring-2 focus:ring-[#143D30]/10 text-left transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#143D30] focus:ring-[#143D30] w-4 h-4 border-stone-300"
                    />
                    <span>{isAr ? 'تذكر الجلسة في هذا الجهاز' : 'Rester connecté'}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#143D30] hover:bg-[#0e2d23] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#143D30]"
                >
                  {isLoading ? (
                    <span>{isAr ? 'جاري التحقق...' : 'Vérification...'}</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-amber-300" />
                      <span>{isAr ? 'تسجيل الدخول للوحة المكلفين' : 'Se connecter'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Login Cards */}
              <div className="pt-3 border-t border-stone-200">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-2">
                  {isAr ? '⚡ دخول سريع بضغطة واحدة (Demo Accounts)' : 'Accès démo 1-Click'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_MODERATORS.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleQuickLogin(mod)}
                      className="p-2.5 rounded-xl border border-stone-200 hover:border-[#143D30] bg-stone-50 hover:bg-[#FAF7F0] text-start transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#143D30] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {mod.avatar_code}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-stone-900 block truncate group-hover:text-[#143D30]">
                            {isAr ? mod.name_ar : mod.name_fr}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-[#143D30] font-bold shrink-0">
                        {isAr ? 'دخول' : 'Entrer'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 border-t border-stone-800 text-xs text-center">
        <span>
          {isAr
            ? 'جامعتي | جميع الحقوق محفوظة لمنظومة حكامة البيانات الجامعية 2026'
            : 'Jami3ati | Portail de gouvernance des données universitaires 2026'}
        </span>
      </footer>
    </div>
  );
};
