import React, { useState } from 'react';
import { OfficialAnnouncement, Language } from '../types';
import { translations } from '../data/translations';
import { Calendar, ExternalLink, ShieldCheck, Clock, CheckCircle2, Download, CalendarPlus } from 'lucide-react';
import {
  getGoogleCalendarUrl,
  downloadAnnouncementIcs,
  downloadAllAnnouncementsIcs,
  getCountdownInfo,
} from '../utils/calendarExport';

interface Props {
  announcements: OfficialAnnouncement[];
  lang: Language;
  onToast?: (msg: string) => void;
}

export const AnnouncementsSection: React.FC<Props> = ({ announcements, lang, onToast }) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'concours' | 'inscription' | 'bourse'>('all');

  const handleDownloadIcs = (ann: OfficialAnnouncement) => {
    downloadAnnouncementIcs(ann, lang);
    onToast?.(
      isAr
        ? 'تم تحميل ملف التقويم (.ics) — افتحه لإضافته إلى Apple Calendar أو تقويمك'
        : 'Fichier calendrier (.ics) téléchargé pour Apple Calendar / iCal'
    );
  };

  const handleBatchExportIcs = () => {
    downloadAllAnnouncementsIcs(filteredAnnouncements, lang);
    onToast?.(
      isAr
        ? `تم تصدير ${filteredAnnouncements.length} مواعيد في ملف تقويم واحد (.ics)`
        : `${filteredAnnouncements.length} échéances exportées dans un fichier (.ics)`
    );
  };

  const filteredAnnouncements = announcements
    .filter((a) => selectedCategory === 'all' || a.category === selectedCategory)
    .slice()
    .sort((a, b) => {
      const aDate = a.deadline_date || a.event_date;
      const bDate = b.deadline_date || b.event_date;
      return aDate.localeCompare(bDate);
    });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'concours':
        return isAr ? 'مباريات الولوج' : 'Concours d’accès';
      case 'inscription':
        return isAr ? 'التسجيل القبلي' : 'Inscriptions';
      case 'bourse':
        return isAr ? 'المنحة الجامعية' : 'Bourses d’études';
      default:
        return isAr ? 'إعلان رسمي' : 'Avis officiel';
    }
  };

  return (
    <section id="announcements" className="py-8 sm:py-14 border-b border-stone-200/90 w-full max-w-full overflow-x-clip bg-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 w-full">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#143D30] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
              <span>
                {isAr
                  ? 'مواعيد رسمية مؤكدة بمذكرات وزارة التعليم العالي (MESRSI)'
                  : 'Calendrier officiel vérifié (Notes ministérielles MESRSI)'}
              </span>
            </div>
            <h2 className="text-lg sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t.announcements_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              {t.announcements_desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Batch Export All Deadlines (.ics) */}
            {filteredAnnouncements.length > 0 && (
              <button
                type="button"
                onClick={handleBatchExportIcs}
                className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-[#143D30] hover:bg-[#0f2e24] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                title={
                  isAr
                    ? 'تصدير جميع المواعيد الظاهرة دفعة واحدة لـ Apple Calendar أو Google Calendar'
                    : 'Tout exporter vers Apple Calendar / iCal / Outlook'
                }
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isAr
                    ? `تصدير الكل للتقويم (${filteredAnnouncements.length})`
                    : `Tout exporter (.ics)`}
                </span>
              </button>
            )}

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-stone-200/90 shadow-2xs text-xs overflow-x-auto no-scrollbar flex-nowrap">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 whitespace-nowrap min-h-[38px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#143D30] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'جميع المواعيد' : 'Tous'} ({announcements.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('concours')}
                className={`shrink-0 whitespace-nowrap min-h-[38px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'concours'
                    ? 'bg-[#143D30] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'المباريات (Concours)' : 'Concours'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('inscription')}
                className={`shrink-0 whitespace-nowrap min-h-[38px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'inscription'
                    ? 'bg-[#143D30] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'التسجيل الجامعي' : 'Inscriptions'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('bourse')}
                className={`shrink-0 whitespace-nowrap min-h-[38px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'bourse'
                    ? 'bg-[#143D30] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'المنح (Minhaty)' : 'Bourses'}
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 w-full">
          {filteredAnnouncements.map((ann) => {
            const countdown = getCountdownInfo(ann.deadline_date || ann.event_date, isAr);
            const countdownClass =
              countdown?.tone === 'urgent'
                ? 'bg-red-50 text-[#B43425] border-red-200'
                : countdown?.tone === 'upcoming'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : countdown?.tone === 'expired'
                ? 'bg-stone-100 text-stone-500 border-stone-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200';

            return (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-stone-300 transition-all duration-200"
              >
                <div>
                  {/* Card Header: Category & Live Countdown */}
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-2.5 sm:mb-3 pb-2 sm:pb-2.5 border-b border-stone-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] sm:text-xs font-bold text-[#143D30] tracking-wide shrink-0">
                        {ann.institution_code}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-[11px] sm:text-xs font-medium text-stone-600 truncate">
                        {getCategoryLabel(ann.category)}
                      </span>
                    </div>
                    {countdown && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${countdownClass}`}>
                        {countdown.label}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[13px] sm:text-sm font-bold text-stone-900 leading-snug mb-1.5 sm:mb-2">
                    {isAr ? ann.title_ar : ann.title_fr}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-stone-500 mb-3 sm:mb-4 line-clamp-1">
                    {isAr ? ann.institution_name_ar : ann.institution_name_fr}
                  </p>

                  {/* Date range details */}
                  <div className="bg-stone-50 rounded-xl p-2.5 sm:p-3 border border-stone-200/60 text-[11px] sm:text-xs space-y-1.5 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{isAr ? 'تاريخ الانطلاق:' : 'Date de début :'}</span>
                      </span>
                      <span className="font-mono font-bold text-stone-900">{ann.event_date}</span>
                    </div>

                    {ann.deadline_date && (
                      <div className="flex items-center justify-between text-stone-700">
                        <span className="text-stone-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isAr ? 'آخر أجل للترشيح:' : 'Dernier délai :'}</span>
                        </span>
                        <span className="font-mono font-bold text-[#B43425]">{ann.deadline_date}</span>
                      </div>
                    )}
                  </div>
                </div>

              {/* Bottom Attribution & 1-Click Calendar Actions */}
              <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
                <div className="text-[11px] text-stone-400 flex items-center justify-between">
                  <span>
                    {isAr ? `تم التوثيق: ${ann.verified_at}` : `Vérifié le : ${ann.verified_at}`}
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isAr ? 'مذكرة وزارية' : 'Note ministérielle'}</span>
                  </span>
                </div>

                {/* 1-Click Add to Google Calendar & Apple Calendar / iCal */}
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-dashed border-stone-200">
                  <a
                    href={getGoogleCalendarUrl(ann, lang, 'deadline')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 min-h-[42px] bg-[#143D30]/10 hover:bg-[#143D30] text-[#143D30] hover:text-white rounded-xl text-xs font-bold transition-colors border border-[#143D30]/20 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none"
                    title={
                      isAr
                        ? 'إضافة آخر أجل مباشرة إلى تقويم جوجل (Google Calendar)'
                        : 'Ajouter directement à Google Agenda'
                    }
                  >
                    <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {isAr ? 'تقويم جوجل' : 'Google Agenda'}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownloadIcs(ann)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 min-h-[42px] bg-stone-100 hover:bg-stone-900 text-stone-800 hover:text-white rounded-xl text-xs font-bold transition-colors border border-stone-200 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none"
                    title={
                      isAr
                        ? 'تحميل ملف (.ics) لتقويم أبل (Apple Calendar / iCal) أو Outlook مع تذكير مسبق'
                        : 'Télécharger (.ics) pour Apple Calendar / iCal / Outlook avec rappel'
                    }
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {isAr ? 'أبل / iCal (.ics)' : 'Apple / iCal (.ics)'}
                    </span>
                  </button>
                </div>

                <a
                  href={ann.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-1 text-[11px] text-[#143D30] hover:underline font-semibold pt-1"
                >
                  <span className="truncate">{ann.source_name}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
