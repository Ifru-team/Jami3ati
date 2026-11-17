import React from 'react';
import {
  Search,
  Scale,
  Bookmark,
  CalendarPlus,
  ShieldAlert,
  CheckCircle2,
  Building2,
  BookOpen,
  FileCheck2,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
  onNavigateToHome: () => void;
  onNavigateToPrograms: () => void;
  onNavigateToPrivacy: () => void;
  onOpenReport: () => void;
}

export const TermsAndGuidePage: React.FC<Props> = ({
  lang,
  onNavigateToHome,
  onNavigateToPrograms,
  onNavigateToPrivacy,
  onOpenReport,
}) => {
  const isAr = lang === 'ar';

  const usageSteps = [
    {
      step: '01',
      icon: Search,
      title_ar: 'البحث والتصفية السريعة',
      title_fr: 'Recherche et filtres rapides',
      desc_ar:
        'استخدم شريط البحث في الرئيسية بكتابة اسم الجامعة، المدينة (مثل الرباط أو مراكش)، أو رمز المدرسة (ENSIAS، ENCG...)، كما يمكنك الضغط على مفتاح "/" للتركيز الفوري وتصفية النتائج حسب الاستقطاب أو الشعبة.',
      desc_fr:
        'Saisissez le nom d’une université, ville ou acronyme (ENSIAS, ENCG...) ou appuyez sur "/" pour cibler la barre de recherche et filtrer par type d’accès ou filière.',
    },
    {
      step: '02',
      icon: Scale,
      title_ar: 'المقارنة المباشرة وحفظ المفضلة',
      title_fr: 'Comparateur et favoris',
      desc_ar:
        'اضغط على زر «+ مقارنة» في البطاقات للمقارنة جنباً إلى جنب بين ما يصل إلى 3 مؤسسات، أو اضغط على أيقونة الحفظ لإضافة المؤسسة لقائمة مفضلتك التي تبقى محفوظة في متصفحك.',
      desc_fr:
        'Cliquez sur "+ Comparer" sur les fiches pour comparer jusqu’à 3 établissements côte à côte, ou ajoutez-les à vos favoris conservés dans votre navigateur.',
    },
    {
      step: '03',
      icon: CalendarPlus,
      title_ar: 'استكشاف الشهادات ومزامنة المواعيد',
      title_fr: 'Diplômes et synchronisation agenda',
      desc_ar:
        'تصفح صفحة «المسالك والشهادات» لمعرفة المهن المطلوبة بعد التخرج، وانتقل إلى «السكن والمنحة» لإضافة مواعيد ONOUSC ومنحتي مباشرة إلى تقويم Google أو تحميل ملف ICS.',
      desc_fr:
        'Consultez les débouchés par diplôme dans "Filières & Diplômes" et exportez les échéances ONOUSC / Minhaty vers Google Calendar ou au format ICS.',
    },
    {
      step: '04',
      icon: ShieldAlert,
      title_ar: 'التحقق من المصدر والتبليغ',
      title_fr: 'Vérification et signalement',
      desc_ar:
        'اعتمد دائماً رابط الموقع الرسمي (.ac.ma) في كل بطاقة عند تقديم طلبات التسجيل. وإذا لاحظت رابطاً معطلاً أو تاريخاً قديماً، استعمل زر «الإبلاغ عن معلومة» مع إرفاق الرابط الرسمي.',
      desc_fr:
        'Vérifiez toujours le portail officiel (.ac.ma) avant toute candidature. En cas de lien obsolète, utilisez "Signaler une erreur" avec la source officielle.',
    },
  ];

  const termsRules = [
    {
      icon: FileCheck2,
      title_ar: 'الطبيعة الاستكشافية للدليل',
      title_fr: 'Nature informative du répertoire',
      desc_ar:
        'منصة «جامعتي | Jami3ati» دليل توجيهي استكشافي مستقل يسهّل الوصول للمعلومات الجامعية المنشورة، ولا تحل محل المذكرات الوزارية أو البوابات الرسمية للجامعات عند إيداع ملفات الترشيح.',
      desc_fr:
        'Jami3ati est un guide d’orientation indépendant. Elle facilite l’accès à l’information publique sans remplacer les notes ministérielles ni les portails d’inscription officiels.',
    },
    {
      icon: Database,
      title_ar: 'ترخيص البيانات المفتوحة (Open Data)',
      title_fr: 'Licence des données ouvertes',
      desc_ar:
        'البيانات الوصفية المستوردة من السجلات الوطنية المفتوحة متاحة للتنزيل وإعادة الاستخدام لأغراض البحث الأكاديمي، الصحافة، والتطوير التقني مع الإشارة للمصدر الرسمي.',
      desc_fr:
        'Les jeux de données consolidés sont librement réutilisables à des fins académiques, analytiques ou associatives avec mention de la source d’origine.',
    },
    {
      icon: AlertTriangle,
      title_ar: 'ضوابط المساهمات والتقييمات',
      title_fr: 'Règles de contribution et avis',
      desc_ar:
        'يُشترط في التقييمات الطلابية والبلاغات احترام الموضوعية وتجنب أي عبارات مسيئة أو معلومات غير موثقة. يحتفظ فريق الإشراف بحق عدم اعتماد أي بلاغ يخلو من رابط مصدر رسمي.',
      desc_fr:
        'Les avis et signalements doivent rester objectifs et respectueux. Tout signalement de modification sans lien vers une source officielle peut être rejeté.',
    },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-6 sm:space-y-8">
        {/* Clean Editorial Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr ? 'طريقة الاستخدام وشروط المنصة' : 'Guide d’utilisation et conditions d’usage'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'شرح مبسط للاستفادة الكاملة من أدوات البحث والمقارنة، مع الشروط العامة لاستخدام البيانات والمساهمة في المنصة.'
                : 'Mode d’emploi étape par étape pour exploiter la recherche et le comparateur, accompagné des conditions générales d’utilisation.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onNavigateToHome}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-[#143D30] hover:bg-[#0e2c23] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'الانتقال للدليل' : 'Aller à l’annuaire'}</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToPrograms}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs font-bold text-[#143D30] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isAr ? 'دليل المسالك' : 'Filières'}</span>
            </button>
          </div>
        </header>

        {/* Step-by-Step How to Use */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'كيف تستخدم منصة جامعتي؟' : 'Comment utiliser Jami3ati en 4 étapes ?'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {isAr
                ? 'أربع خطوات عملية للوصول إلى المؤسسة المناسبة ومقارنة خياراتك الدراسية.'
                : 'Quatre étapes simples pour trouver l’établissement adapté et comparer vos options.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usageSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF7F0] border border-stone-200 text-[#143D30] flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                        {isAr ? item.title_ar : item.title_fr}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg bg-[#143D30] text-amber-300">
                      {item.step}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isAr ? item.desc_ar : item.desc_fr}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Terms of Use & Governance */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="border-b border-stone-100 pb-3.5 space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              {isAr ? 'شروط الاستخدام وإخلاء المسؤولية' : 'Conditions d’utilisation et avertissement'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {isAr
                ? 'باستخدامك للمنصة فإنك تطلع وتوافق على الضوابط التالية:'
                : 'En utilisant la plateforme, vous prenez connaissance des principes suivants :'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {termsRules.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                    <Icon className="w-4 h-4 text-[#143D30] shrink-0" />
                    <span>{isAr ? rule.title_ar : rule.title_fr}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isAr ? rule.desc_ar : rule.desc_fr}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1.5 text-stone-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isAr
                  ? 'هل وجدت رابطاً غير محدث أو معلومة تحتاج تصحيحاً؟'
                  : 'Vous avez repéré un lien obsolète ou une erreur ?'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToPrivacy}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors"
              >
                {isAr ? 'سياسة الخصوصية' : 'Confidentialité'}
              </button>
              <button
                type="button"
                onClick={onOpenReport}
                className="px-3.5 py-1.5 rounded-lg bg-[#B43425] hover:bg-red-800 text-white font-bold transition-colors"
              >
                {isAr ? 'الإبلاغ عن معلومة' : 'Signaler une erreur'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
