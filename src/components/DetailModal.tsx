import React from 'react';
import { University, Institution, OfficialAnnouncement, Language } from '../types';
import { translations } from '../data/translations';
import { X, ExternalLink, MapPin, Phone, Mail, Building2, GraduationCap, AlertCircle, BookOpen, Share2, Bookmark, Scale, Navigation, Calendar, CalendarPlus, Clock, ShieldCheck, Briefcase, Sparkles, TrendingUp, Download } from 'lucide-react';
import { SourceAttribution } from './SourceAttribution';
import { DataStatusBadge } from './DataStatusBadge';
import { ModalBackdrop } from './ModalBackdrop';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { shareItem } from '../utils/shareUtils';
import { PhoneDisplay } from './PhoneDisplay';
import { getCoordinates, getOpenStreetMapDirectionsUrl } from '../utils/geoCoordinates';
import { resolveAssetImage } from '../utils/imageAssets';
import { getCareerProfilesForItem } from '../utils/careerMapping';
import {
  getGoogleCalendarUrl,
  downloadAnnouncementIcs,
  getMatchingAnnouncementsForItem,
} from '../utils/calendarExport';

interface Props {
  item: University | Institution | null;
  itemType: 'university' | 'institution';
  lang: Language;
  announcements?: OfficialAnnouncement[];
  onClose: () => void;
  onReport: (item: University | Institution) => void;
  isCompared?: boolean;
  onToggleCompare?: (item: University | Institution) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (item: University | Institution) => void;
  onToast?: (msg: string) => void;
}

export const DetailModal: React.FC<Props> = ({
  item,
  itemType,
  lang,
  announcements = [],
  onClose,
  onReport,
  isCompared = false,
  onToggleCompare,
  isBookmarked = false,
  onToggleBookmark,
  onToast,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'careers'>('overview');
  React.useEffect(() => {
    setImgError(false);
    setActiveTab('overview');
  }, [item?.id]);
  // Listen for Escape key globally to close this modal
  useEscapeKey(onClose, Boolean(item));

  if (!item) return null;
  const t = translations[lang];
  const isAr = lang === 'ar';

  const isUniv = itemType === 'university';
  const univ = isUniv ? (item as University) : null;
  const inst = !isUniv ? (item as Institution) : null;

  const displayName = lang === 'ar' ? item.name_ar : item.name_fr;
  const subName = lang === 'ar' ? item.name_fr : item.name_ar;
  const city = lang === 'ar' ? item.city_ar : item.city_fr;
  const coords = getCoordinates(item, itemType);
  const directionsUrl = getOpenStreetMapDirectionsUrl(coords.lat, coords.lng);
  const matchedAnnouncements = getMatchingAnnouncementsForItem(item, itemType, announcements);
  const careerProfiles = getCareerProfilesForItem(item, itemType);


  const handleDownloadCareerSheet = () => {
    const lines = [
      `${displayName} (${item.code})`,
      `${subName}`,
      `${isAr ? 'المدينة' : 'Ville'}: ${city}`,
      `${isAr ? 'الموقع الرسمي' : 'Site officiel'}: ${item.website_url}`,
      '',
      `=== ${isAr ? 'المهن المرتبطة والمهارات المطلوبة في سوق العمل المغربي' : 'Métiers associés & Compétences au Maroc'} ===`,
      '',
      ...careerProfiles.flatMap((cp, idx) => [
        `${idx + 1}. ${isAr ? cp.title_ar : cp.title_fr} (${isAr ? cp.demand_level_ar : cp.demand_level_fr})`,
        `   ${isAr ? 'القطاعات المشغلة' : 'Secteurs'}: ${isAr ? cp.sectors_ar : cp.sectors_fr}`,
        `   ${isAr ? 'المهارات الأساسية' : 'Compétences clés'}: ${(isAr ? cp.skills_ar : cp.skills_fr).join(' · ')}`,
        '',
      ]),
      `${isAr ? 'المصدر' : 'Source'}: ${item.source_name} (${item.source_url})`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jami3ati-${item.code.toLowerCase()}-careers.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast?.(
      isAr
        ? 'تم تحميل بطاقة المؤسسة والمهن المرتبطة (.txt)'
        : 'Fiche établissement & métiers téléchargée (.txt)'
    );
  };

  return (
    <ModalBackdrop onClose={onClose} ariaLabelledBy="modal-title" mobileBottomSheet>
      <div className="relative w-full max-w-3xl max-h-[92dvh] sm:my-auto flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden select-text animate-in zoom-in-95 duration-150">
        {/* Sticky/Fixed close button */}
        <button
          onClick={onClose}
          aria-label={t.close}
          tabIndex={0}
          className="absolute top-3 end-3 z-20 min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-white/90 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header banner */}
        <div className="relative h-36 sm:h-52 w-full overflow-hidden bg-stone-900 shrink-0">
          {!imgError ? (
            <img
              src={resolveAssetImage(item.image_url)}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#143D30] to-[#091a14] flex flex-col items-center justify-center p-4 sm:p-6 text-white">
              <span className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-amber-300">
                {item.code}
              </span>
              <span className="text-xs sm:text-sm text-stone-300 font-medium mt-1">
                {city}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] sm:text-xs uppercase px-2 py-0.5 rounded bg-white/20 text-white font-medium">
                  {item.code}
                </span>
                <DataStatusBadge status={item.data_status} lang={lang} size="sm" />
              </div>
              <h2 id="modal-title" className="text-base sm:text-2xl font-bold text-white tracking-tight leading-snug line-clamp-2">
                {displayName}
              </h2>
              <p className="text-[11px] sm:text-sm text-stone-300 font-normal mt-0.5 truncate">
                {subName}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Tab Switcher */}
        <div className="bg-[#FAF8F5] border-b border-stone-200 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#143D30] text-[#143D30]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'بطاقة المؤسسة والمعلومات' : 'Fiche & Informations'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('careers')}
            className={`min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'careers'
                ? 'border-[#143D30] text-[#143D30]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'المهن وسوق العمل المغربي' : 'Métiers & Marché de l’emploi'}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              {careerProfiles.length}
            </span>
          </button>
        </div>

        {/* Scrollable inner content container */}
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-5 sm:space-y-6 flex-1">
          {activeTab === 'careers' ? (
            <div className="space-y-5">
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143D30]">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>
                      {isAr
                        ? 'الربط بالمسار المهني وسوق الشغل بالمغرب'
                        : 'Passerelle Formation → Emploi au Maroc'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isAr
                      ? `أبرز المهن المرتبطة بتكوينات ${displayName} والمهارات الأساسية المطلوبة لدى المشغلين بالمغرب.`
                      : `Principaux métiers accessibles après ${displayName} et compétences clés recherchées sur le marché marocain.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadCareerSheet}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#143D30] hover:bg-[#0e2c22] text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAr ? 'تحميل بطاقة المهن (.txt)' : 'Télécharger fiche (.txt)'}</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {careerProfiles.map((cp) => (
                  <div
                    key={cp.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#143D30]/50 transition-colors space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#143D30] flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-stone-900">
                            {isAr ? cp.title_ar : cp.title_fr}
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            {isAr ? cp.title_fr : cp.title_ar}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                        {isAr ? cp.demand_level_ar : cp.demand_level_fr}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 bg-[#FAF8F5] px-3 py-2 rounded-xl border border-stone-200/80 leading-relaxed">
                      <strong className="text-stone-900">
                        {isAr ? 'القطاعات والمشغلون بالمغرب: ' : 'Secteurs & employeurs au Maroc : '}
                      </strong>
                      {isAr ? cp.sectors_ar : cp.sectors_fr}
                    </p>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {isAr
                            ? 'المهارات الأساسية المطلوبة في سوق العمل:'
                            : 'Compétences essentielles requises :'}
                        </span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(isAr ? cp.skills_ar : cp.skills_fr).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-800 border border-stone-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
          {/* Context Navigation Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 bg-[#FAF7F0] px-3 py-2 rounded-xl border border-stone-200 w-full">
            <button
              type="button"
              onClick={onClose}
              className="hover:text-[#143D30] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none rounded px-1"
              tabIndex={0}
            >
              {lang === 'ar' ? 'الدليل الرئيسي' : 'Annuaire'}
            </button>
            <span className="text-stone-300" aria-hidden="true">/</span>
            <button
              type="button"
              onClick={onClose}
              className="hover:text-[#143D30] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none rounded px-1"
              tabIndex={0}
            >
              {city}
            </button>
            <span className="text-stone-300" aria-hidden="true">/</span>
            <span className="text-stone-900 font-bold truncate max-w-[200px]" aria-current="page">
              {displayName}
            </span>
          </nav>

          {/* Quick info row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 border-b border-stone-200">
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="w-4 h-4 text-[#143D30] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-stone-500 block">{t.filter_by_city}</span>
                <span className="font-medium text-stone-900">{city}</span>
                {inst && <span className="text-xs text-stone-500 block mt-0.5">{lang === 'ar' ? inst.campus_ar : inst.campus_fr}</span>}
              </div>
            </div>

            {inst && (
              <div className="flex items-start gap-2.5 text-sm">
                <Building2 className="w-4 h-4 text-[#143D30]" />
                <div>
                  <span className="text-xs text-stone-500 block">{t.parent_university}</span>
                  <span className="font-medium text-stone-900">
                    {lang === 'ar' ? inst.university_name_ar : inst.university_name_fr}
                  </span>
                </div>
              </div>
            )}

            {univ && (
              <div className="flex items-start gap-2.5 text-sm">
                <Building2 className="w-4 h-4 text-[#143D30]" />
                <div>
                  <span className="text-xs text-stone-500 block">{isAr ? 'سنة التأسيس' : 'Année de fondation'}</span>
                  <span className="font-medium text-stone-900 font-mono">{univ.established_year}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 text-sm">
              <GraduationCap className="w-4 h-4 text-[#143D30]" />
              <div>
                <span className="text-xs text-stone-500 block">{t.filter_by_type}</span>
                <span className="font-medium text-stone-900">
                  {univ ? t.type_university : lang === 'ar' ? inst?.type_label_ar : inst?.type_label_fr}
                </span>
              </div>
            </div>
          </div>

          {/* Description or Academic Programs */}
          {univ && (
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#143D30]" />
                <span>{isAr ? 'نبذة تعريفية ومكونات القطب الجامعي' : 'Présentation & composantes du pôle universitaire'}</span>
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {lang === 'ar' ? univ.description_ar : univ.description_fr}
              </p>
              {univ.institutions_list && univ.institutions_list.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-stone-500 block mb-1.5 font-medium">
                    {isAr ? 'أبرز المؤسسات التابعة:' : 'Principaux établissements rattachés :'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {univ.institutions_list.map((sub, idx) => (
                      <span key={idx} className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {inst && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#143D30]" />
                  <span>{t.academic_programs}</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-700">
                  {(lang === 'ar' ? inst.programs_summary_ar : inst.programs_summary_fr).map((prog, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#143D30] shrink-0" />
                      <span>{prog}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-stone-900 mb-1">{t.access_mode}</h4>
                <p className="text-xs text-stone-600 bg-[#FAF8F5] p-3 rounded-lg border border-[#EDE8DE] leading-relaxed">
                  {lang === 'ar' ? inst.access_mode_ar : inst.access_mode_fr}
                </p>
              </div>
            </div>
          )}

          {/* Matching Competition & Deadline Calendar Cards */}
          {matchedAnnouncements.length > 0 && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#143D30] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isAr
                      ? 'مواعيد المباريات والآجال المرتبطة (أضف إلى تقويمك)'
                      : 'Concours & échéances associés (Ajouter à votre agenda)'}
                  </span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {matchedAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white rounded-xl border border-stone-200/90 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 leading-snug">
                        {isAr ? ann.title_ar : ann.title_fr}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{isAr ? 'الانطلاق:' : 'Début :'}</span>
                          <strong className="font-mono text-stone-800">{ann.event_date}</strong>
                        </span>
                        {ann.deadline_date && (
                          <span className="inline-flex items-center gap-1 text-[#B43425]">
                            <Clock className="w-3 h-3" />
                            <span>{isAr ? 'آخر أجل:' : 'Délai :'}</span>
                            <strong className="font-mono">{ann.deadline_date}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getGoogleCalendarUrl(ann, lang, 'deadline')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#143D30]/10 hover:bg-[#143D30] text-[#143D30] hover:text-white rounded-lg text-[11px] font-bold transition-colors border border-[#143D30]/20"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>{isAr ? 'جوجل' : 'Google'}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          downloadAnnouncementIcs(ann, lang);
                          onToast?.(
                            isAr
                              ? 'تم تحميل ملف التقويم (.ics) لإضافته إلى Apple Calendar أو تقويمك'
                              : 'Fichier calendrier (.ics) téléchargé pour Apple Calendar / iCal'
                          );
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-900 text-stone-800 hover:text-white rounded-lg text-[11px] font-bold transition-colors border border-stone-200"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isAr ? 'أبل / iCal' : 'iCal (.ics)'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Contacts Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
              {isAr ? 'بيانات الاتصال المعتمدة (دون افتراضات)' : 'Coordonnées officielles vérifiées'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col justify-between">
                <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>{t.contact_phone}</span>
                </span>
                <PhoneDisplay phone={item.phone} lang={lang} size="md" showCallButton={true} showCopyButton={true} />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.contact_email}</span>
                </span>
                {item.email ? (
                  <span className="font-mono text-stone-900 font-medium">{item.email}</span>
                ) : (
                  <span className="text-xs text-stone-400 italic">{t.unavailable}</span>
                )}
              </div>
            </div>
          </div>

          {/* Provenance and Verification Box */}
          <SourceAttribution
            sourceName={item.source_name}
            sourceUrl={item.source_url}
            verifiedAt={item.verified_at}
            dataStatus={item.data_status}
            lang={lang}
          />

          {/* Report Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
            <span className="text-xs text-stone-500">
              {isAr ? 'هل لاحظت خطأ أو رابطًا معطلاً؟' : 'Vous avez repéré une erreur ou un lien rompu ?'}
            </span>
            <button
              onClick={() => {
                onClose();
                onReport(item);
              }}
              className="inline-flex items-center gap-1.5 min-h-[40px] text-xs text-[#B43425] hover:text-[#8b2316] font-medium px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#B43425] focus-visible:outline-none rounded"
              aria-label={t.report_inaccuracy}
              tabIndex={0}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{t.report_inaccuracy}</span>
            </button>
          </div>
            </>
          )}
        </div>

        {/* Sticky Thumb-Zone Action Bar */}
        <div className="shrink-0 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-stone-200 px-3.5 sm:px-6 py-2.5 sm:py-3 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <a
            href={item.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[130px] min-h-[44px] flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#143D30] text-white font-bold hover:bg-[#0e2c22] transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none text-xs sm:text-sm whitespace-nowrap"
            aria-label={`${t.official_website} ${displayName}`}
            tabIndex={0}
          >
            <span>{t.official_website}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3 sm:px-3.5 py-2.5 bg-white hover:bg-stone-100 text-[#143D30] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none whitespace-nowrap shrink-0"
            title={isAr ? 'فتح مسار الاتجاهات عبر خريطة OpenStreetMap' : 'Obtenir l’itinéraire GPS'}
          >
            <Navigation className="w-4 h-4 text-[#143D30] shrink-0" />
            <span className="hidden sm:inline">{isAr ? 'الاتجاهات' : 'Itinéraire'}</span>
          </a>

          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(item)}
              className={`min-h-[44px] px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border shadow-2xs focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none whitespace-nowrap shrink-0 ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
              title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Bookmark className={`w-4 h-4 shrink-0 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? (isAr ? 'محفوظ' : 'Enregistré') : (isAr ? 'حفظ' : 'Favori')}</span>
            </button>
          )}

          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(item)}
              className={`min-h-[44px] px-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border shadow-2xs focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none whitespace-nowrap shrink-0 ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-300 font-bold'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
              aria-label={isAr ? 'إضافة أو إزالة من المقارنة' : 'Ajouter au comparateur'}
              tabIndex={0}
            >
              <Scale className={`w-4 h-4 shrink-0 ${isCompared ? 'text-amber-800' : 'text-[#143D30]'}`} />
              <span className="hidden sm:inline">{isCompared ? (isAr ? 'في المقارنة ✓' : 'Comparé ✓') : (isAr ? '+ مقارنة' : '+ Comparer')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              shareItem(item, lang, (msg) => {
                if (onToast) onToast(msg);
              })
            }
            className="min-h-[44px] px-3 py-2.5 bg-white hover:bg-stone-100 text-stone-800 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-200 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none whitespace-nowrap shrink-0"
            title={lang === 'ar' ? 'مشاركة رابط المؤسسة المباشر' : 'Partager'}
            aria-label={lang === 'ar' ? `مشاركة رابط ${displayName}` : `Partager ${displayName}`}
            tabIndex={0}
          >
            <Share2 className="w-4 h-4 text-[#143D30] shrink-0" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'مشاركة' : 'Partager'}</span>
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
