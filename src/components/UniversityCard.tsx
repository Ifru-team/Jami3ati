import React from 'react';
import { University, Language } from '../types';
import { translations } from '../data/translations';
import { DataStatusBadge } from './DataStatusBadge';
import { MapPin, Globe, ExternalLink, ArrowRight, ArrowLeft, Scale, Share2, Bookmark, Phone } from 'lucide-react';
import { shareItem } from '../utils/shareUtils';
import { formatMoroccanPhone } from '../utils/phoneUtils';
import { resolveAssetImage } from '../utils/imageAssets';

interface Props {
  university: University;
  lang: Language;
  onSelect: (univ: University) => void;
  onReport: (univ: University) => void;
  isCompared?: boolean;
  onToggleCompare?: (univ: University) => void;
  onShare?: (univ: University) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (univ: University) => void;
}

export const UniversityCard: React.FC<Props> = ({
  university,
  lang,
  onSelect,
  onReport,
  isCompared = false,
  onToggleCompare,
  onShare,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const t = translations[lang];
  const isAr = lang === 'ar';
  const name = isAr ? university.name_ar : university.name_fr;
  const city = isAr ? university.city_ar : university.city_fr;
  const desc = isAr ? university.description_ar : university.description_fr;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#143D30]/40 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 h-full">
      <div>
        {/* Visual Header */}
        <div className="relative h-36 sm:h-44 w-full bg-stone-100 overflow-hidden">
          {!imgError ? (
            <img
              src={resolveAssetImage(university.image_url)}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#143D30] to-[#0a1f18] flex flex-col items-center justify-center p-4 text-white">
              <span className="font-mono text-2xl font-extrabold tracking-widest text-amber-300 opacity-90">
                {university.code}
              </span>
              <span className="text-xs text-stone-300 font-medium mt-1 truncate max-w-full">
                {city}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top badges & Quick Actions bar */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10">
            {/* Start: Code + Verified status */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white/95 text-stone-900 rounded-md shadow-xs shrink-0">
                {university.code}
              </span>
              <DataStatusBadge status={university.data_status} lang={lang} size="sm" />
            </div>

            {/* End: Floating Bookmark & Share Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {onToggleBookmark && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(university);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                    isBookmarked
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-sm'
                      : 'bg-black/45 hover:bg-black/65 text-white'
                  }`}
                  title={isBookmarked ? (isAr ? 'إزالة من المفضلة' : 'Retirer des favoris') : (isAr ? 'حفظ في المفضلة' : 'Ajouter aux favoris')}
                  aria-label={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-stone-950' : ''}`} />
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare ? onShare(university) : shareItem(university, lang);
                }}
                className="w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                title={isAr ? 'مشاركة رابط الجامعة' : 'Partager'}
                aria-label={isAr ? `مشاركة ${name}` : `Partager ${name}`}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom metadata on image */}
          <div className="absolute bottom-3 inset-x-3 text-white">
            <div className="flex items-center gap-1.5 text-xs text-stone-200">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-semibold">{city}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>{isAr ? `تأسست ${university.established_year}` : `Fondée en ${university.established_year}`}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-5">
          <button
            type="button"
            onClick={() => onSelect(university)}
            className="w-full text-start group-hover:text-[#143D30] transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none rounded block"
            tabIndex={0}
            aria-label={`عرض تفاصيل ${name}`}
          >
            <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 sm:min-h-[2.5rem]">
              {name}
            </h3>
          </button>

          <p className="text-[11px] sm:text-xs text-stone-600 line-clamp-2 leading-relaxed mt-1.5 mb-3 sm:mb-4">
            {desc}
          </p>

          {/* Unboxed Metadata & Official Portal link */}
          <div className="flex items-center justify-between gap-2 text-xs text-stone-500 border-t border-stone-100 pt-3">
            <span className="font-medium text-stone-700">
              {isAr ? `${university.institution_count} مؤسسة وكلية` : `${university.institution_count} établissements`}
            </span>
            <a
              href={university.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-stone-600 hover:text-[#143D30] font-medium transition-colors"
              title={t.official_website}
              aria-label={`${t.official_website} ${name}`}
            >
              <Globe className="w-3.5 h-3.5 text-[#143D30]" />
              <span className="truncate max-w-[120px]">{isAr ? 'البوابة الرسمية' : 'Site officiel'}</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>

          {/* Verified Phone Contact Row */}
          {university.phone && (
            <div className="flex items-center justify-between text-xs pt-2.5 mt-2.5 border-t border-dashed border-stone-200">
              <span className="text-[11px] text-stone-500 font-medium">{isAr ? 'الهاتف المعتمد:' : 'Tél vérifié :'}</span>
              <a
                href={`tel:${university.phone.replace(/[^\d+]/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                dir="ltr"
                style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200/80 transition-colors"
                title={isAr ? 'اتصال مباشر بالسكرتارية' : 'Appeler'}
              >
                <Phone className="w-3 h-3 text-emerald-700 shrink-0" />
                <span>{formatMoroccanPhone(university.phone)}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions - High-contrast Two-Button Deck */}
      <div className="p-2.5 sm:px-4 sm:py-3 border-t border-stone-100 bg-stone-50/70 flex items-center gap-2">
        {/* Compare Button */}
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(university)}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[44px] py-1.5 sm:py-2 px-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all border shadow-2xs focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none active:scale-[0.98] ${
              isCompared
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-300 font-bold'
                : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300/80'
            }`}
            title={isCompared ? 'إزالة من المقارنة' : 'إضافة إلى المقارنة'}
            aria-label={isAr ? `مقارنة ${name}` : `Comparer ${name}`}
            tabIndex={0}
          >
            <Scale className={`w-3.5 h-3.5 shrink-0 ${isCompared ? 'text-amber-800' : 'text-[#143D30]'}`} />
            <span className="truncate">{isCompared ? (isAr ? 'في المقارنة ✓' : 'Comparé ✓') : (isAr ? '+ مقارنة' : '+ Comparer')}</span>
          </button>
        )}

        {/* Details Primary CTA */}
        <button
          type="button"
          onClick={() => onSelect(university)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[44px] py-1.5 sm:py-2 px-2.5 rounded-xl bg-[#143D30] hover:bg-[#0f2e24] text-white text-[11px] sm:text-xs font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none active:scale-[0.98]"
          aria-label={isAr ? `التفاصيل الكاملة لـ ${name}` : `Détails de ${name}`}
          tabIndex={0}
        >
          <span className="truncate">{t.view_details}</span>
          {isAr ? <ArrowLeft className="w-3.5 h-3.5 shrink-0" /> : <ArrowRight className="w-3.5 h-3.5 shrink-0" />}
        </button>
      </div>
    </div>
  );
};
