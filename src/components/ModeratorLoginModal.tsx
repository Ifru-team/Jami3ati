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
  Info,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { ModalBackdrop } from './ModalBackdrop';
import { useEscapeKey } from '../hooks/useEscapeKey';
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

export const DEMO_MODERATORS: ModeratorUser[] = [
  {
    id: 'mod-1',
    name_ar: 'د. كريم الإدريسي',
    name_fr: 'Dr. Karim El Idrissi',
    email: 'mod@jami3ati.ma',
    role: 'open_data_specialist',
    role_title_ar: 'أخصائي تدقيق البيانات المفتوحة',
    role_title_fr: 'Spécialiste Open Data & Audit',
    avatar_code: 'KI',
    badge_color: 'bg-emerald-700',
  },
  {
    id: 'mod-2',
    name_ar: 'أ. مريم الفاسي',
    name_fr: 'Pr. Meryem El Fassi',
    email: 'admin@jami3ati.ma',
    role: 'lead_verifier',
    role_title_ar: 'المشرف الأكاديمي الرئيسي',
    role_title_fr: 'Auditeur en chef & Gouvernance',
    avatar_code: 'MF',
    badge_color: 'bg-amber-700',
  },
];

export const ModeratorLoginModal: React.FC<ModeratorLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  useEscapeKey(onClose, isOpen);

  const [activeTabRole, setActiveTabRole] = useState<'open_data_specialist' | 'lead_verifier'>('open_data_specialist');
  const [email, setEmail] = useState('mod@jami3ati.ma');
  const [password, setPassword] = useState('mod2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isAr = lang === 'ar';

  if (!isOpen) return null;

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
            ? 'بيانات الاعتماد غير صحيحة. يرجى استخدام حسابات المعاينة المعتمدة أدناه.'
            : 'Identifiants incorrects. Veuillez utiliser les comptes de démonstration ci-dessous.'
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
          ? 'تم إيقاف خدمة المصادقة السحابية مؤقتاً في البيئة التجريبية. يرجى استخدام الدخول السريع أو بيانات الاعتماد أدناه.'
          : 'Service d’authentification cloud désactivé en mode démo. Veuillez utiliser l’accès rapide ci-dessous.'
      );
    }, 300);
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className={`relative bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col transition-all ${
          isFullScreen
            ? 'w-full h-full max-w-none rounded-none'
            : 'max-w-md sm:max-w-xl w-full max-h-[92vh] sm:max-h-[88vh]'
        }`}
      >
        {/* Fixed Premium Header Banner */}
        <div className="bg-gradient-to-br from-[#143D30] via-[#1b5240] to-[#0a231b] text-white p-5 sm:p-6 relative overflow-hidden border-b border-[#D4AF37]/30 shrink-0">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 -mb-10 -ms-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar inside Banner */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-amber-400/30 shadow-xs">
              <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isAr ? 'منظومة الحكامة والتدقيق الأكاديمي' : 'Portail d’Audit & Gouvernance'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsFullScreen((prev) => !prev)}
                className="text-stone-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                title={isFullScreen ? (isAr ? 'تصغير النافذة' : 'Réduire') : (isAr ? 'عرض الشاشة الكاملة' : 'Plein écran')}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-stone-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                title={isAr ? 'إغلاق' : 'Fermer'}
              >
                ✕
              </button>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1.5 relative z-10 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-amber-400 shrink-0" />
            <span>{isAr ? 'فضاء المكلفين والمشرفين' : 'Espace Modérateurs & Auditeurs'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-lg relative z-10">
            {isAr
              ? 'الولوج الآمن لمراجعة بلاغات الطلبة، فحص روابط الإثبات الرسمية، وتدقيق البيانات وفق مرجع data.gov.ma.'
              : 'Espace sécurisé pour auditer les signalements et actualiser les données universitaires.'}
          </p>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 bg-[#FAF8F5]/60 flex-1 overflow-y-auto overscroll-contain">
          {/* Verified Google Auth Cloud Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full min-h-[46px] py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#143D30]/25 hover:border-[#143D30] text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all disabled:opacity-50"
          >
            <Shield className="w-4.5 h-4.5 text-[#143D30] shrink-0" />
            <span>
              {isAr
                ? 'تسجيل الدخول بحساب Google المعتمد (المزامنة السحابية)'
                : 'Connexion Google Vérifiée (Cloud)'}
            </span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="font-semibold uppercase tracking-wider text-stone-500">
              {isAr ? 'أو بيانات الدخول المحلية' : 'ou accès local'}
            </span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>

          {/* Role Segmented Switcher */}
          <div className="p-1.5 bg-stone-200/90 rounded-2xl grid grid-cols-2 gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleTabChange('open_data_specialist')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTabRole === 'open_data_specialist'
                  ? 'bg-white text-[#143D30] shadow-sm font-bold border border-stone-300/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{isAr ? 'أخصائي البيانات المفتوحة' : 'Spécialiste Open Data'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('lead_verifier')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTabRole === 'lead_verifier'
                  ? 'bg-white text-[#143D30] shadow-sm font-bold border border-stone-300/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="truncate">{isAr ? 'المشرف الأكاديمي الرئيسي' : 'Auditeur en Chef'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username / Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  {isAr ? 'البريد المهني / اسم المستخدم' : 'Email / Identifiant'}
                </label>
                <span className="text-[11px] text-[#143D30] font-mono font-bold bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EDE8DE]">
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
                  className="w-full ps-10 pe-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-[#143D30] focus:ring-2 focus:ring-[#143D30]/15 text-left transition-all min-h-[42px]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  {isAr ? 'كلمة المرور / الرمز الأمني' : 'Mot de passe'}
                </label>
                <span className="text-[11px] text-amber-900 font-mono font-bold bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                  {isAr ? 'الرمز: ' : 'Code: '}
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
                  className="w-full ps-10 pe-11 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-[#143D30] focus:ring-2 focus:ring-[#143D30]/15 text-left transition-all min-h-[42px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox & Security badge */}
            <div className="flex items-center justify-between pt-1 text-xs text-stone-600">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#143D30] focus:ring-[#143D30] w-4 h-4 border-stone-300"
                />
                <span className="font-semibold text-stone-800 text-xs">{isAr ? 'تذكر الجلسة' : 'Rester connecté'}</span>
              </label>

              <span className="text-[11px] text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                TLS 256-bit
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] py-3 px-4 bg-[#143D30] hover:bg-[#0e2c23] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#143D30]/30 disabled:opacity-50 mt-1.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جاري التنسيق والمطابقة...' : 'Validation...'}</span>
                </div>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{isAr ? 'تسجيل الدخول للوحة المكلفين' : 'Se connecter au portail'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Deck */}
          <div className="pt-3 border-t border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'دخول فوري بضغطة واحدة (Demo)' : 'Accès démo 1-Click'}</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono bg-stone-200/80 px-2 py-0.5 rounded-md font-semibold">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_MODERATORS.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleQuickLogin(mod)}
                  className={`p-3 rounded-2xl border text-start transition-all flex items-center justify-between group hover:shadow-xs ${
                    mod.role === activeTabRole
                      ? 'border-[#143D30] bg-[#FAF7F0] ring-2 ring-[#143D30]/15'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 ${mod.badge_color || 'bg-[#143D30]'}`}>
                      {mod.avatar_code}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-stone-900 block truncate group-hover:text-[#143D30]">
                        {isAr ? mod.name_ar : mod.name_fr}
                      </span>
                      <span className="text-[10px] text-stone-500 block truncate font-medium">
                        {isAr ? mod.role_title_ar : mod.role_title_fr}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-[#143D30] font-bold shrink-0 group-hover:bg-[#143D30] group-hover:text-white transition-colors">
                    {isAr ? 'دخول' : 'Entrer'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer Security Notice */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 shrink-0 text-[11px] text-stone-600 flex items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-1.5 text-stone-500">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate max-w-[280px]">
              {isAr ? 'منظومة حكامة البيانات الجامعية المفتوحة (data.gov.ma)' : 'Gouvernance Open Data (data.gov.ma)'}
            </span>
          </span>
          <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            DGSSI Secure
          </span>
        </div>
      </div>
    </ModalBackdrop>
  );
};
