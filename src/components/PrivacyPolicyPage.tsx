import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  HardDrive,
  EyeOff,
  Trash2,
  CheckCircle2,
  FileText,
  Scale,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
  onNavigateToTerms: () => void;
  onNavigateToSources: () => void;
  onClearLocalPreferences?: () => void;
  onToast?: (msg: string) => void;
}

export const PrivacyPolicyPage: React.FC<Props> = ({
  lang,
  onNavigateToTerms,
  onNavigateToSources,
  onClearLocalPreferences,
  onToast,
}) => {
  const isAr = lang === 'ar';
  const [confirmReset, setConfirmReset] = useState(false);
  const [clearedDone, setClearedDone] = useState(false);

  const localDataItems = [
    {
      keyName: 'jami3ati_bookmarks_v1',
      title_ar: 'قائمة المفضلة',
      title_fr: 'Favoris enregistrés',
      desc_ar: 'تحفظ الجامعات والمؤسسات التي قمت بوضع علامة مرجعية عليها للعودة إليها لاحقاً.',
      desc_fr: 'Conserve les universités et établissements que vous avez mis en favoris.',
    },
    {
      keyName: 'jami3ati_recent_searches',
      title_ar: 'سجل البحث الأخير',
      title_fr: 'Recherches récentes',
      desc_ar: 'يحفظ آخر عبارات البحث في متصفحك لتسريع الوصول دون إرسالها لأي خادم تتبع.',
      desc_fr: 'Enregistre vos derniers termes de recherche localement pour accélérer la navigation.',
    },
    {
      keyName: 'jami3ati_feedbacks_v1 / reports',
      title_ar: 'التقييمات والبلاغات المرسلة',
      title_fr: 'Avis et signalements soumis',
      desc_ar: 'تخزين مؤقت لتجارب الطلبة وبلاغات تصحيح الروابط التي أرسلتها في نفس المتصفح.',
      desc_fr: 'Stockage local des retours étudiants et signalements de correction que vous avez soumis.',
    },
  ];

  const handleClearLocalData = () => {
    try {
      localStorage.removeItem('jami3ati_bookmarks_v1');
      localStorage.removeItem('jami3ati_recent_searches');
      localStorage.removeItem('jami3ati_contact_messages_v1');
      if (onClearLocalPreferences) {
        onClearLocalPreferences();
      }
      setConfirmReset(false);
      setClearedDone(true);
      if (onToast) {
        onToast(
          isAr
            ? 'تم مسح بيانات التفضيلات المحلية من متصفحك بنجاح.'
            : 'Vos préférences locales ont été effacées avec succès.'
        );
      }
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-6 sm:space-y-8">
        {/* Clean Editorial Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr ? 'سياسة الخصوصية وحماية المعطيات' : 'Politique de confidentialité'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'نلتزم بحماية خصوصية الطلبة والزوار؛ تصفح دليل جامعتي لا يتطلب إنشاء حساب ولا جمع بيانات شخصية أو تتبع إعلاني.'
                : 'Nous protégeons la vie privée des étudiants : la consultation de Jami3ati ne requiert ni compte, ni collecte commerciale, ni pistage publicitaire.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-medium text-stone-500 shrink-0">
            <span className="font-semibold text-[#143D30]">
              {isAr ? 'القانون المغربي 09-08' : 'Loi marocaine 09-08'}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{isAr ? 'آخر تحديث: نوفمبر 2026' : 'Mise à jour : Nov 2026'}</span>
          </div>
        </header>

        {/* Core Privacy Commitments */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#143D30] flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-stone-900">
              {isAr ? 'بدون تتبع أو إعلانات' : 'Aucun pistage publicitaire'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isAr
                ? 'لا نستخدم ملفات تعريف الارتباط التسويقية (Cookies) ولا نشارك أو نبيع أي سجل تصفح لأطراف ثالثة.'
                : 'Nous n’utilisons aucun cookie publicitaire et ne partageons ni ne revendons aucune donnée de navigation.'}
            </p>
          </article>

          <article className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-stone-900">
              {isAr ? 'لا نطلب رقم البطاقة أو المسار' : 'Aucune donnée sensible demandée'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isAr
                ? 'لا يطلب الموقع رقم البطاقة الوطنية (CIN) أو رقم مسار (CNE) أو أي وثائق رسمية خاصة بالطالب.'
                : 'La plateforme ne demande jamais votre numéro CIN, code Massar (CNE) ni aucun document administratif.'}
            </p>
          </article>

          <article className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#143D30]" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-stone-900">
              {isAr ? 'المطابقة مع القانون 09-08' : 'Conformité Loi 09-08 (CNDP)'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isAr
                ? 'تراعي المنصة مبادئ حماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي المعمول بها بالمغرب.'
                : 'L’architecture respecte les principes de protection des données personnelles en vigueur au Maroc.'}
            </p>
          </article>
        </section>

        {/* Transparent Local Storage Control */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143D30]">
                <HardDrive className="w-4 h-4" />
                <span>{isAr ? 'التخزين المحلي في المتصفح' : 'Stockage local (Browser)'}</span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-stone-900">
                {isAr
                  ? 'ما البيانات المحفوظة على جهازك فقط؟'
                  : 'Quelles données restent stockées sur votre appareil ?'}
              </h2>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#B43425] border border-red-200 text-xs font-bold transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'مسح تفضيلاتي المحلية' : 'Effacer mes données locales'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClearLocalData}
                  className="px-3.5 py-2 rounded-xl bg-[#B43425] hover:bg-red-800 text-white text-xs font-bold transition-colors"
                >
                  {isAr ? 'تأكيد المسح' : 'Confirmer'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
              </div>
            )}
          </div>

          {clearedDone && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isAr
                  ? 'تمت إزالة المفضلة وسجل البحث والرسائل المحلية من متصفحك.'
                  : 'Vos favoris, recherches récentes et messages locaux ont été supprimés.'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localDataItems.map((item) => (
              <div
                key={item.keyName}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2"
              >
                <span dir="ltr" className="font-mono text-[11px] font-bold text-[#143D30] bg-white px-2 py-0.5 rounded border border-stone-200 inline-block">
                  {item.keyName}
                </span>
                <h3 className="text-sm font-bold text-stone-900">
                  {isAr ? item.title_ar : item.title_fr}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {isAr ? item.desc_ar : item.desc_fr}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* External Links & Moderation Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isAr ? 'مشاركة الآراء والبلاغات' : 'Soumission d’avis et signalements'}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'عند إرسال تقييم لتجربة طلابية أو الإبلاغ عن رابط غير صالح، يُنصح باستعمال اسم أول أو اسم مستعار وعدم إدراج أرقام هاتف شخصية أو معطيات خاصة داخل حقل النص.'
                : 'Lors de la publication d’un avis étudiant ou d’un signalement, utilisez uniquement un prénom ou pseudonyme et évitez d’inclure des coordonnées personnelles dans le texte.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
              <ExternalLink className="w-4 h-4 text-[#143D30] shrink-0" />
              <span>{isAr ? 'الروابط نحو المواقع الرسمية الخارجية' : 'Liens vers les portails officiels'}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'تحتوي المنصة على روابط مباشرة لمواقع الجامعات المغربية (.ac.ma) وبوابات الوزارة وdata.gov.ma. عند انتقالك لتلك المواقع تخضع لسياسات الخصوصية الخاصة بكل مؤسسة.'
                : 'La plateforme redirige vers les sites officiels (.ac.ma, ministères, data.gov.ma). Une fois redirigé, vous êtes soumis aux politiques propres à chaque portail.'}
            </p>
          </div>
        </section>

        {/* Related Governance Pages */}
        <section className="bg-[#FAF7F0] rounded-2xl border border-[#EDE7D9] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-bold text-stone-800">
            {isAr ? 'صفحات مكملة للحكامة والاستخدام:' : 'Pages complémentaires :'}
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateToTerms}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs font-bold text-[#143D30] transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isAr ? 'طريقة وشروط الاستخدام' : 'Guide & Conditions'}</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToSources}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#143D30] hover:bg-[#0e2c23] text-white text-xs font-bold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'المصادر الرسمية والتواصل' : 'Sources & Contact'}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
