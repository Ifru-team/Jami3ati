import React, { useState } from 'react';
import {
  ShieldCheck,
  Database,
  Compass,
  Users,
  CheckCircle2,
  ExternalLink,
  Building2,
  GraduationCap,
  FileCheck2,
  Scale,
  MapPin,
  Clock,
  Rocket,
  BookOpen,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Language, University, Institution } from '../types';

interface Props {
  lang: Language;
  universities: University[];
  institutions: Institution[];
  onBackToHome: () => void;
  onNavigateToDirectory: () => void;
  onNavigateToExport: () => void;
  onToggleLanguage?: () => void;
}

export const AboutUsPage: React.FC<Props> = ({
  lang,
  universities,
  institutions,
  onNavigateToDirectory,
  onNavigateToExport,
}) => {
  const isAr = lang === 'ar';
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const uniqueCitiesCount = React.useMemo(() => {
    const cities = new Set<string>();
    universities.forEach((u) => cities.add(u.city_fr));
    institutions.forEach((i) => cities.add(i.city_fr));
    return cities.size;
  }, [universities, institutions]);

  const audiences = [
    {
      icon: GraduationCap,
      title_ar: 'تلاميذ البكالوريا',
      title_fr: 'Bacheliers & Lycéens',
      desc_ar: 'مقارنة المدارس العليا والكليات حسب الشعبة، المدينة، ونظام الاستقطاب المفتوح أو المحدود.',
      desc_fr: 'Comparer écoles et facultés selon la filière, la ville et le mode d’accès (ouvert ou régulé).',
    },
    {
      icon: BookOpen,
      title_ar: 'طلبة الإجازة والماستر',
      title_fr: 'Étudiants Licence & Master',
      desc_ar: 'استكشاف الآفاق المهنية للشهادات الوطنية، شروط الجسور، ومواعيد المنحة والسكن الجامعي.',
      desc_fr: 'Découvrir les débouchés des diplômes nationaux, passerelles, bourses et cités universitaires.',
    },
    {
      icon: Users,
      title_ar: 'الأولياء والباحثون',
      title_fr: 'Familles & Chercheurs',
      desc_ar: 'مرجع موحد بروابط رسمية واضحة وقابل للتصدير المفتوح بصيغ JSON وCSV لأغراض البحث.',
      desc_fr: 'Référentiel unique avec liens officiels fiables et export ouvert JSON/CSV pour la recherche.',
    },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title_ar: 'صفر تخمين وتوثيق مصدر كل معلومة',
      title_fr: 'Zéro approximation & traçabilité intégrale',
      desc_ar:
        'لا ننشر أي رقم أو رابط أو موعد بدون مصدر رسمي منشور (.ac.ma أو data.gov.ma أو وزارة التعليم العالي)، مع إظهار تاريخ آخر مراجعة بوضوح في كل بطاقة.',
      desc_fr:
        'Chaque établissement, date de concours et lien officiel est adossé à une source publiée (.ac.ma, data.gov.ma ou MESRSI) avec une date de vérification explicite.',
      accent: 'bg-emerald-50 text-[#143D30] border-emerald-200',
    },
    {
      icon: Compass,
      title_ar: 'تكافؤ الفرص عبر كل جهات المملكة',
      title_fr: 'Équité territoriale sur tout le Royaume',
      desc_ar:
        'من طنجة إلى الداخلة، تجمع المنصة الجامعات العمومية والمدارس العليا وكليات الاستقطاب المفتوح في خريطة تفاعلية موحدة تسهل المقارنة واختيار المسار.',
      desc_fr:
        'De Tanger à Dakhla, la plateforme réunit universités publiques, grandes écoles et facultés à accès ouvert sur une carte interactive unifiée.',
      accent: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      icon: Users,
      title_ar: 'حوكمة تشاركية ومراجعة مجتمعية',
      title_fr: 'Gouvernance participative & vérification',
      desc_ar:
        'نفتح المجال للطلبة لتقييم جودة الخدمات والإبلاغ عن أي رابط معطل أو معلومة قديمة بشرط إرفاق رابط المصدر الرسمي، لتتم مراجعتها في فضاء المكلفين.',
      desc_fr:
        'Les étudiants peuvent partager leurs retours et signaler toute donnée obsolète avec justificatif officiel afin qu’elle soit auditée par nos modérateurs.',
      accent: 'bg-stone-100 text-stone-800 border-stone-200',
    },
  ];

  const protocolSteps = [
    {
      step: '01',
      title_ar: 'استيراد البيانات المفتوحة',
      title_fr: 'Import Open Data',
      desc_ar: 'المزامنة مع السجل الوطني المنشور على بوابة data.gov.ma كمرجع أولي.',
      desc_fr: 'Synchronisation initiale avec le répertoire national publié sur data.gov.ma.',
    },
    {
      step: '02',
      title_ar: 'التحقق من البوابات الرسمية',
      title_fr: 'Audit des portails .ac.ma',
      desc_ar: 'مطابقة الرموز، المدن، الأحياء الجامعية، وشروط الولوج من مواقع الجامعات.',
      desc_fr: 'Vérification des sigles, villes, campus et modalités d’accès sur les sites officiels.',
    },
    {
      step: '03',
      title_ar: 'ختم تاريخ المراجعة',
      title_fr: 'Horodatage de révision',
      desc_ar: 'إسناد تاريخ مراجعة صريح ووسم حالة التوثيق لكل مؤسسة أو موعد رسمي.',
      desc_fr: 'Attribution d’une date de vérification et d’un statut de fiabilité à chaque fiche.',
    },
    {
      step: '04',
      title_ar: 'تحديث مستمر ببلاغات الطلبة',
      title_fr: 'Mise à jour continue',
      desc_ar: 'معالجة بلاغات التصحيح المرفقة بروابط رسمية عبر بوابة المكلفين بالموقع.',
      desc_fr: 'Traitement des signalements sourcés via le portail dédié aux modérateurs.',
    },
  ];

  const roadmapPhases = [
    {
      phase: '01',
      timeframe_ar: 'المرحلة الحالية — 2026',
      timeframe_fr: 'Phase actuelle — 2026',
      status: 'done' as const,
      status_ar: 'مكتمل ومفعّل',
      status_fr: 'Déployé',
      title_ar: 'السجل الموحد للجامعات والخريطة التفاعلية',
      title_fr: 'Répertoire unifié et carte interactive',
      items_ar: [
        'تغطية الجامعات العمومية المغربية والمدارس الوطنية العليا مع بيانات الموقع والتواصل.',
        'أداة المقارنة المباشرة بين المؤسسات، دليل المسالك والشهادات، وتصدير JSON / CSV.',
      ],
      items_fr: [
        'Couverture des universités publiques et grandes écoles avec coordonnées vérifiées.',
        'Comparateur interactif, guide des filières/débouchés et export ouvert JSON / CSV.',
      ],
    },
    {
      phase: '02',
      timeframe_ar: 'المرحلة القادمة — موسم 2026',
      timeframe_fr: 'Prochaine étape — Saison 2026',
      status: 'in_progress' as const,
      status_ar: 'قيد التطوير',
      status_fr: 'En cours',
      title_ar: 'أرشيف عتبات الانتقاء ومباريات الولوج',
      title_fr: 'Historique des seuils & concours nationaux',
      items_ar: [
        'إدراج عتبات الانتقاء الأولي للسنوات الثلاث الأخيرة لمباريات ENSA وENCG وFMP وENSAM.',
        'مزامنة تلقائية لمواعيد التسجيل والنتائج مع تقويم Google وملفات ICS.',
      ],
      items_fr: [
        'Historique des seuils de présélection sur 3 ans pour ENSA, ENCG, FMP et ENSAM.',
        'Synchronisation des échéances officielles vers Google Calendar et fichiers ICS.',
      ],
    },
    {
      phase: '03',
      timeframe_ar: 'نهاية 2026',
      timeframe_fr: 'Fin 2026',
      status: 'planned' as const,
      status_ar: 'مخطط له',
      status_fr: 'Planifié',
      title_ar: 'توسيع السكن الجامعي وربط معاهد التكوين المهني',
      title_fr: 'Extension cités ONOUSC & réseau OFPPT',
      items_ar: [
        'تغطية جميع الأحياء والمطاعم الجامعية التابعة لـ ONOUSC في الجهات الـ 12.',
        'إدماج معاهد التكوين المهني (OFPPT) ومدارس التمريض (ISPITS) ومعاهد الفلاحة.',
      ],
      items_fr: [
        'Couverture complète des cités et restaurants ONOUSC dans les 12 régions.',
        'Intégration des instituts OFPPT, ISPITS et écoles spécialisées publiques.',
      ],
    },
    {
      phase: '04',
      timeframe_ar: 'آفاق 2027',
      timeframe_fr: 'Horizon 2027',
      status: 'vision' as const,
      status_ar: 'رؤية مستقبلية',
      status_fr: 'Vision 2027',
      title_ar: 'التوجيه حسب شعبة البكالوريا وواجهة برمجية مفتوحة',
      title_fr: 'Orientation par série du Bac & API publique',
      items_ar: [
        'مرشّح ذكي يطابق شعبة البكالوريا ونقاط المواد مع المسالك المتاحة رسمياً.',
        'إطلاق واجهة برمجية مفتوحة (Open API) موثقة للباحثين ومشاريع المجتمع المدني.',
      ],
      items_fr: [
        'Filtre d’éligibilité croisant série du Bac et filières publiques accessibles.',
        'Lancement d’une API ouverte documentée pour les chercheurs et initiatives civiques.',
      ],
    },
  ];

  const faqs = [
    {
      q_ar: 'هل منصة جامعتي تابعة لوزارة التعليم العالي أو لجهة رسمية؟',
      q_fr: 'Jami3ati est-elle affiliée au ministère de l’Enseignement supérieur ?',
      a_ar:
        'لا، جامعتي مشروع مدني استكشافي مستقل. لا ندّعي تمثيل الوزارة أو أي جامعة رسمية، بل نجمع البيانات المنشورة في البوابات الرسمية (data.gov.ma ومواقع .ac.ma) مع إرفاق رابط المصدر الأصلي في كل بطاقة للتحقق النهائي.',
      a_fr:
        'Non, Jami3ati est un projet civique indépendant. Nous ne représentons ni le ministère ni aucune université, et renvoyons systématiquement vers les liens officiels (.ac.ma et data.gov.ma) pour toute confirmation.',
    },
    {
      q_ar: 'كيف يتم التأكد من دقة العناوين والمواعيد قبل نشرها؟',
      q_fr: 'Comment la fiabilité des liens et dates est-elle contrôlée ?',
      a_ar:
        'يمر كل سجل بمراجعة يدوية ومطابقة مع السجلات الوطنية المفتوحة ومواقع المؤسسات، مع إظهار تاريخ آخر تحقق على كل بطاقة. كما يمكن لأي زائر الإبلاغ عن معلومة متقادمة مرفقة برابط التصحيح الرسمي.',
      a_fr:
        'Chaque fiche est croisée avec les données publiques et portails officiels avec une date de vérification visible. Tout visiteur peut signaler une correction en joignant un lien officiel.',
    },
    {
      q_ar: 'هل البيانات متاحة للاستخدام الأكاديمي أو التطويري؟',
      q_fr: 'Les données sont-elles réutilisables pour la recherche ou des projets ?',
      a_ar:
        'نعم، يمكنك تنزيل السجل الكامل للجامعات والمؤسسات مباشرة من مركز البيانات المفتوحة بصيغ JSON وCSV الجاهزة لبرنامج Excel وأدوات التحليل.',
      a_fr:
        'Oui, l’ensemble du répertoire est téléchargeable librement depuis le Centre Open Data aux formats JSON et CSV compatibles Excel.',
    },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-8 sm:space-y-10">
        {/* Clean Editorial Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr
                ? 'من نحن، منهجية التوثيق، وخارطة الطريق'
                : 'À propos, méthodologie et feuille de route'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'مبادرة مستقلة توحّد البيانات الجامعية المغربية المفتوحة في مرجع ثنائي اللغة مبني على المصادر الرسمية، مع خطة تطوير مستمرة لخدمة التوجيه الدراسي.'
                : 'Initiative indépendante qui unifie les données universitaires marocaines ouvertes dans un répertoire bilingue sourcé, avec une feuille de route continue pour l’orientation.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#143D30] hover:bg-[#0e2c23] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
            >
              <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isAr ? 'استكشاف الدليل' : 'Explorer l’annuaire'}</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToExport}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-[#143D30] border border-stone-300 text-xs sm:text-sm font-bold transition-colors"
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'البيانات المفتوحة' : 'Open Data'}</span>
            </button>
          </div>
        </header>

        {/* Live Coverage Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-5 h-5 text-[#143D30]" />
              <span className="text-[11px] font-mono font-semibold text-stone-400">01</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#143D30] tabular-nums">
              {universities.length}
            </div>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'جامعة عمومية موثقة' : 'Universités publiques'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap className="w-5 h-5 text-[#143D30]" />
              <span className="text-[11px] font-mono font-semibold text-stone-400">02</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#143D30] tabular-nums">
              {institutions.length}
            </div>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'مدرسة عليا وكلية ومعهد' : 'Écoles, facultés & instituts'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span className="text-[11px] font-mono font-semibold text-stone-400">03</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
              {uniqueCitiesCount}
            </div>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'مدينة وقطب جامعي' : 'Villes & pôles couverts'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-[#B43425]" />
              <span className="text-[11px] font-mono font-semibold text-stone-400">04</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#B43425] tabular-nums">
              0
            </div>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'معلومات مختلقة أو تخمينية' : 'Données inventées'}
            </p>
          </div>
        </section>

        {/* Mission & Who We Serve */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143D30]">
                <Layers className="w-4 h-4" />
                <span>{isAr ? 'لماذا أنشأنا جامعتي؟' : 'Pourquoi Jami3ati ?'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
                {isAr
                  ? 'حل مشكلة تشتت المعلومة الجامعية في مصدر واحد'
                  : 'Mettre fin à la dispersion de l’information universitaire'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {isAr
                  ? 'يضطر الطالب المغربي كل سنة للتنقل بين عشرات المواقع والمذكرات المتفرقة لمعرفة شروط الولوج، مواقع المدارس، ومواعيد المنحة والسكن. تجمع «جامعتي» هذه المعطيات المفتوحة في تجربة موحدة وسريعة التحقق.'
                  : 'Chaque année, l’étudiant doit naviguer entre des dizaines de portails et notes dispersées pour vérifier les conditions d’accès, adresses et délais. Jami3ati centralise ces données ouvertes dans une interface claire et vérifiable.'}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>{isAr ? 'تغطية تفاعلية على مستوى 12 جهة' : 'Couverture sur 12 régions'}</span>
              <span className="font-mono font-bold text-[#143D30]">AR / FR</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {audiences.map((item, idx) => {
              const Icon = item.icon;
              return (
                <article
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F0] border border-stone-200 text-[#143D30] flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                      {isAr ? item.title_ar : item.title_fr}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isAr ? item.desc_ar : item.desc_fr}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Future Roadmap Section */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143D30]">
                <Rocket className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'التطوير المستقبلي' : 'Développement continu'}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-stone-900">
                {isAr ? 'خارطة الطريق: ما سنقوم به مستقبلاً' : 'Feuille de route : nos prochaines étapes'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                {isAr
                  ? 'خطة عمل واضحة لتوسيع التغطية الأكاديمية والخدمات الرقمية للطلبة خلال عامي 2026 و2027.'
                  : 'Un plan d’évolution progressif pour enrichir l’accompagnement universitaire entre 2026 et 2027.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium shrink-0">
              <Clock className="w-4 h-4 text-[#143D30]" />
              <span>{isAr ? 'تحديث دوري حسب الأولويات الطلابية' : 'Mises à jour par priorités étudiantes'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {roadmapPhases.map((item) => {
              const isDone = item.status === 'done';
              const isInProgress = item.status === 'in_progress';
              const badgeStyle = isDone
                ? 'bg-[#143D30] text-amber-300 border-[#143D30]'
                : isInProgress
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-700 border-stone-200';

              return (
                <article
                  key={item.phase}
                  className={`rounded-2xl border p-4 sm:p-5 space-y-3 transition-colors ${
                    isDone
                      ? 'bg-[#FAF7F0] border-[#143D30]/30'
                      : isInProgress
                        ? 'bg-white border-amber-300/80'
                        : 'bg-[#FAF8F5] border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg border ${
                          isDone
                            ? 'bg-[#143D30] text-white border-[#143D30]'
                            : 'bg-white text-stone-800 border-stone-300'
                        }`}
                      >
                        {item.phase}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-stone-500">
                        {isAr ? item.timeframe_ar : item.timeframe_fr}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${badgeStyle}`}>
                      {isAr ? item.status_ar : item.status_fr}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                    {isAr ? item.title_ar : item.title_fr}
                  </h3>

                  <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
                    {(isAr ? item.items_ar : item.items_fr).map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isDone ? 'text-[#143D30]' : isInProgress ? 'text-amber-600' : 'text-stone-400'
                          }`}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Core Pillars */}
        <section className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#143D30]">
              {isAr ? 'قيمنا ومنهجيتنا' : 'Nos principes fondateurs'}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'لماذا سيثق الطلبة بمنصة جامعتي؟' : 'Pourquoi les étudiants feront confiance à Jami3ati ?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-3 flex flex-col"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${pillar.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900">
                    {isAr ? pillar.title_ar : pillar.title_fr}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isAr ? pillar.desc_ar : pillar.desc_fr}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Data Verification Protocol */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-8 shadow-2xs space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143D30]">
                <FileCheck2 className="w-4 h-4" />
                <span>{isAr ? 'بروتوكول سلامة البيانات' : 'Protocole d’intégrité des données'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                {isAr ? 'كيف نتحقق من كل معلومة قبل نشرها؟' : 'Comment chaque donnée est-elle auditée ?'}
              </h2>
            </div>

            <button
              type="button"
              onClick={onNavigateToExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-stone-300 text-xs font-bold text-[#143D30] transition-colors shrink-0"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isAr ? 'مركز البيانات المفتوحة' : 'Centre Open Data'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {protocolSteps.map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2"
              >
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-[#143D30] text-amber-300 inline-block">
                  {item.step}
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

        {/* Frequently Asked Questions */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl font-extrabold text-stone-900">
              {isAr ? 'أسئلة متكررة حول المنصة' : 'Questions fréquentes'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {isAr
                ? 'إجابات سريعة حول استقلالية المشروع وآلية تحديث المعطيات.'
                : 'Réponses rapides sur notre indépendance et la mise à jour des données.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-4 sm:px-5 py-3.5 text-start flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-stone-900">
                      {isAr ? faq.q_ar : faq.q_fr}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-[#143D30]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {isAr ? faq.a_ar : faq.a_fr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Independence & Open Governance */}
        <section className="bg-[#FAF7F0] rounded-2xl sm:rounded-3xl border border-[#EDE7D9] p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B43425]">
              <Scale className="w-4 h-4" />
              <span>{isAr ? 'استقلالية المنصة وحدود الاستخدام' : 'Indépendance & périmètre'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
              {isAr
                ? 'مشروع مفتوح مستقل لخدمة الطالب المغربي'
                : 'Un projet indépendant au service de l’étudiant marocain'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'منصة «جامعتي» مشروع استكشافي مستقل مبني في إطار الابتكار الرقمي والبيانات المفتوحة بالمغرب، ولا تدّعي تمثيل وزارة التعليم العالي أو أي جامعة رسمية، بل تحيل دائماً إلى المصدر الأصلي للتحقق النهائي.'
                : 'Jami3ati est un projet indépendant d’innovation civique et Open Data au Maroc. Elle ne prétend représenter ni le ministère ni aucune université officielle, et renvoie systématiquement vers la source officielle.'}
            </p>
          </div>

          <a
            href="https://data.gov.ma/data/dataset/etablissements-enseignement-superieur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#143D30] hover:bg-[#0f2e24] text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            <span>{isAr ? 'بوابة data.gov.ma الرسمية' : 'Portail officiel data.gov.ma'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </a>
        </section>
      </main>
    </div>
  );
};
