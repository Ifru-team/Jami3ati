import React, { useState } from 'react';
import { University, Institution, Language } from '../types';
import { translations } from '../data/translations';
import { ModalBackdrop } from './ModalBackdrop';
import { DataStatusBadge } from './DataStatusBadge';
import { PhoneDisplay } from './PhoneDisplay';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  X,
  Building2,
  GraduationCap,
  MapPin,
  Globe,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  Scale,
  Trash2,
  Share2,
  Check,
  Download,
} from 'lucide-react';

export type ComparableItem = {
  item: University | Institution;
  type: 'university' | 'institution';
};

interface Props {
  items: ComparableItem[];
  lang: Language;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onCopyComparison?: () => void;
}

export const CompareModal: React.FC<Props> = ({
  items,
  lang,
  onClose,
  onRemoveItem,
  onClearAll,
  onCopyComparison,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEscapeKey(onClose, items.length > 0);

  if (items.length === 0) return null;

  // Determine if a row's values are identical across all compared items
  const isIdentical = (rowValues: any[]) => {
    if (rowValues.length <= 1) return true;
    const firstValue = JSON.stringify(rowValues[0]);
    return rowValues.every((val) => JSON.stringify(val) === firstValue);
  };

  const getRow = (label: string, renderCell: (item: ComparableItem) => React.ReactNode, rowValues: any[]) => ({
    label,
    renderCell,
    render: () => (
      <tr key={label} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
        <td className="p-3.5 bg-stone-50/80 font-bold text-stone-700 text-xs w-48 align-top border-e border-stone-200/80">
          {label}
        </td>
        {items.map(({ item, type }) => (
          <td key={item.id} className="p-3.5 bg-white align-top border-e border-stone-100/80 last:border-e-0">
            {renderCell({ item, type })}
          </td>
        ))}
        {items.length < 3 && <td className="bg-stone-50/20" />}
      </tr>
    ),
    isDifferent: !isIdentical(rowValues),
  });

  const rowDefinitions = [
    // 1. Institution Type / Parent Univ
    getRow(
      isAr ? 'النوع / الجامعة الأم' : 'Type / Université',
      ({ item }) =>
        'type' in item && (item as Institution).type ? (
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block text-xs">
              {isAr ? (item as Institution).type_label_ar : (item as Institution).type_label_fr}
            </span>
            <span className="text-[11px] text-[#143D30] font-medium block">
              {isAr ? 'تابع لـ:' : 'Rattaché à :'}{' '}
              {isAr ? (item as Institution).university_name_ar : (item as Institution).university_name_fr}
            </span>
          </div>
        ) : (
          <div>
            <span className="font-bold text-stone-900 block text-xs">
              {isAr ? 'جامعة عمومية مركزية' : 'Université publique centrale'}
            </span>
            <span className="text-[11px] text-stone-500 block">
              {isAr
                ? `تأسست سنة ${(item as University).established_year}`
                : `Fondée en ${(item as University).established_year}`}
            </span>
          </div>
        ),
      items.map((i) => ('type' in i.item ? (i.item as Institution).type_label_ar : 'جامعة مركزي'))
    ),

    // 2. Admission Mode & Access Type
    getRow(
      isAr ? 'نظام وشروط الولوج' : 'Conditions & Mode d’accès',
      ({ item }) =>
        'access_mode_ar' in item ? (
          <div className="space-y-1 text-xs">
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                (item as Institution).admission_type === 'regulated'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              {(item as Institution).admission_type === 'regulated'
                ? isAr ? 'استقطاب محدود (مباراة/انتقاء)' : 'Accès régulé'
                : isAr ? 'استقطاب مفتوح (تسجيل مباشر)' : 'Accès ouvert'}
            </span>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {isAr ? (item as Institution).access_mode_ar : (item as Institution).access_mode_fr}
            </p>
          </div>
        ) : (
          <span className="text-[11px] text-stone-600">
            {isAr
              ? 'تضم كليات ذات استقطاب مفتوح (FS, FSJES, FLSH) ومؤسسات ذات استقطاب محدود (ENSA, ENCG, EST).'
              : 'Regroupe des facultés à accès ouvert (FS, FSJES, FLSH) et des écoles à accès régulé (ENSA, ENCG, EST).'}
          </span>
        ),
      items.map((i) => ('admission_type' in i.item ? (i.item as Institution).admission_type : 'mixed'))
    ),

    // 3. City & Campus Location
    getRow(
      isAr ? 'المدينة والحرم الجامعي' : 'Ville & Campus',
      ({ item }) => (
        <div className="space-y-0.5 text-xs text-stone-700">
          <div className="flex items-center gap-1 font-bold text-stone-900">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{isAr ? item.city_ar : item.city_fr}</span>
          </div>
          <span className="text-[11px] text-stone-500 block">
            {'campus_ar' in item ? (isAr ? (item as Institution).campus_ar : (item as Institution).campus_fr) : (isAr ? (item as University).address_ar : (item as University).address_fr)}
          </span>
        </div>
      ),
      items.map((i) => i.item.city_ar)
    ),

    // 4. Academic Programs & Specialties
    getRow(
      isAr ? 'التخصصات والمسالك' : 'Filières & Spécialités',
      ({ item }) =>
        'programs_summary_ar' in item ? (
          <ul className="text-xs text-stone-700 space-y-1">
            {(isAr ? (item as Institution).programs_summary_ar : (item as Institution).programs_summary_fr).map((p, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                <span className="w-1 h-1 rounded-full bg-[#143D30] shrink-0 mt-1.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[11px] text-stone-600">
            <span>
              {isAr
                ? 'تضم كليات في الهندسة، الطب والصيدلة، الاقتصاد، والعلوم القانونية.'
                : 'Couvre l’ingénierie, la médecine, la pharmacie, l’économie et les sciences juridiques.'}
            </span>
          </div>
        ),
      items.map((i) => ('programs_summary_ar' in i.item ? (i.item as Institution).programs_summary_ar.join('|') : 'all'))
    ),

    // 5. Data Status & Open Data Source
    getRow(
      isAr ? 'حالة التوثيق ومصدر البيانات' : 'Statut & Source data.gov.ma',
      ({ item }) => (
        <div className="space-y-1">
          <DataStatusBadge status={item.data_status} lang={lang} size="sm" />
          <span className="text-[11px] text-stone-500 block truncate max-w-[200px]" title={item.source_name}>
            {item.source_name}
          </span>
          <span className="text-[10px] font-mono text-stone-400 block">
            {isAr ? `تاريخ التوثيق: ${item.verified_at}` : `Vérifié le : ${item.verified_at}`}
          </span>
        </div>
      ),
      items.map((i) => i.item.data_status)
    ),

    // 6. Contact Information
    getRow(
      isAr ? 'أرقام الاتصال المعتمدة' : 'Contacts vérifiés',
      ({ item }) => (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-stone-700">
            <PhoneDisplay phone={item.phone} lang={lang} size="sm" showCallButton={false} showCopyButton={true} />
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <Mail className="w-3.5 h-3.5 text-[#143D30] shrink-0" />
            <span className="font-mono text-[11px] truncate max-w-[160px]">
              {item.email || <span className="text-stone-400 italic">{isAr ? 'غير مدرج' : 'Non renseigné'}</span>}
            </span>
          </div>
        </div>
      ),
      items.map((i) => `${i.item.phone}-${i.item.email}`)
    ),

    // 7. Official Website Link
    getRow(
      isAr ? 'الموقع الرسمي' : 'Site web officiel',
      ({ item }) => (
        <a
          href={item.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#143D30] hover:text-[#0b221a] font-semibold underline underline-offset-2"
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-[140px]">{item.website_url.replace(/^https?:\/\//, '')}</span>
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      ),
      items.map((i) => i.item.website_url)
    ),
  ];

  const displayedRows = rowDefinitions.filter((r) => !showDifferencesOnly || r.isDifferent);

  const handleCopyLink = () => {
    const compareUrl = new URL(window.location.href);
    compareUrl.searchParams.delete('item');
    compareUrl.searchParams.set('compare', items.map((i) => i.item.id).join(','));
    navigator.clipboard?.writeText(compareUrl.toString()).catch(() => {});
    if (onCopyComparison) {
      onCopyComparison();
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportReport = () => {
    const reportLines = [
      '=== Jami3ati Comparison Report ===',
      `Date: ${new Date().toISOString()}`,
      `Items Compared: ${items.map(i => i.item.code).join(', ')}`,
      '',
    ];

    items.forEach(({ item }) => {
      reportLines.push(`[${item.code}] ${isAr ? item.name_ar : item.name_fr}`);
      reportLines.push(`City: ${isAr ? item.city_ar : item.city_fr}`);
      reportLines.push(`Website: ${item.website_url}`);
      reportLines.push(`Source: ${item.source_name}`);
      reportLines.push('----------------------------------------');
    });

    const blob = new Blob([reportLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jami3ati_comparison_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ModalBackdrop onClose={onClose} ariaLabelledBy="compare-modal-title" mobileBottomSheet>
      <div className="relative w-full max-w-5xl max-h-[92dvh] sm:my-auto flex flex-col bg-[#FAF8F5] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden select-text animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 sm:p-5 bg-white border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#143D30] text-white flex items-center justify-center font-bold shrink-0">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 id="compare-modal-title" className="text-sm sm:text-lg font-bold text-stone-900 truncate">
                    {isAr ? 'مقارنة مباشرة بين المؤسسات' : 'Comparatif côte à côte'}
                  </h3>
                  <span className="font-mono text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    ({items.length}/3)
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-stone-500 block truncate">
                  {isAr ? 'مقارنة دقيقة بالبيانات الموثقة من data.gov.ma' : 'Données certifiées issues de data.gov.ma'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden min-h-[40px] min-w-[40px] flex items-center justify-center p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
            <button
              onClick={handleExportReport}
              className="min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white text-[#143D30] hover:bg-stone-50 transition-colors shadow-2xs whitespace-nowrap shrink-0"
              title={isAr ? 'تصدير تقرير المقارنة كملف نصي' : 'Exporter le rapport comparatif (.txt)'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصدير' : 'Exporter'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0"
              title={isAr ? 'نسخ رابط المقارنة المباشر' : 'Copier le lien du comparatif'}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{isAr ? (copiedLink ? 'تم النسخ!' : 'مشاركة') : (copiedLink ? 'Copié !' : 'Partager')}</span>
            </button>

            <button
              onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
              className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 rounded-lg transition-colors border whitespace-nowrap shrink-0 ${
                showDifferencesOnly
                  ? 'bg-[#143D30] text-white border-[#143D30]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? (showDifferencesOnly ? 'عرض الكل' : 'الاختلافات فقط') : (showDifferencesOnly ? 'Tout' : 'Différences')}</span>
            </button>

            <button
              onClick={onClearAll}
              className="min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs text-stone-500 hover:text-red-600 font-medium flex items-center gap-1 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title={isAr ? 'إفراغ المقارنة' : 'Vider le comparatif'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'تفريغ' : 'Effacer'}</span>
            </button>

            <button
              onClick={onClose}
              className="hidden sm:flex min-h-[38px] min-w-[38px] items-center justify-center p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain p-3.5 sm:p-6 flex-1 space-y-3 sm:space-y-0">
          {/* Mobile Stacked Cards Comparison (< sm) */}
          <div className="sm:hidden space-y-3">
            {/* Selected Institutions Chips */}
            <div className="flex flex-wrap gap-1.5">
              {items.map(({ item }) => (
                <div
                  key={item.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs max-w-full"
                >
                  <span className="font-mono text-[11px] font-bold text-[#143D30] shrink-0">{item.code}</span>
                  <span className="text-xs font-semibold text-stone-800 truncate">
                    {isAr ? item.name_ar : item.name_fr}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-0.5 text-stone-400 hover:text-red-600 rounded shrink-0"
                    aria-label={isAr ? 'حذف من المقارنة' : 'Retirer'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {displayedRows.length > 0 ? (
              displayedRows.map((row) => (
                <div
                  key={row.label}
                  className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden"
                >
                  <div className="px-3.5 py-2 bg-stone-100/90 border-b border-stone-200 text-xs font-extrabold text-stone-800">
                    {row.label}
                  </div>
                  <div className="divide-y divide-stone-100">
                    {items.map(({ item, type }) => (
                      <div key={item.id} className="p-3 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#143D30] font-mono">
                            {item.code} · {isAr ? item.city_ar : item.city_fr}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-500 truncate max-w-[180px]">
                            {isAr ? item.name_ar : item.name_fr}
                          </span>
                        </div>
                        <div className="pt-0.5">{row.renderCell({ item, type })}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-sm text-stone-800">
                  {isAr ? 'جميع المعايير متطابقة بين المؤسسات المحددة!' : 'Toutes les données sont identiques !'}
                </p>
                <button
                  onClick={() => setShowDifferencesOnly(false)}
                  className="mt-2 min-h-[36px] px-3 py-1 text-xs text-[#143D30] font-semibold underline"
                >
                  {isAr ? 'عرض جدول المقارنة الكامل' : 'Tout afficher'}
                </button>
              </div>
            )}
          </div>

          {/* Tablet & Desktop Table Comparison (sm+) */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
            <table className="w-full text-xs border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-stone-200 bg-stone-100/90">
                  <th className="p-3.5 text-start w-44 md:w-48 text-stone-700 font-bold border-e border-stone-200">
                    {isAr ? 'معيار المقارنة' : 'Critère'}
                  </th>
                  {items.map(({ item }) => (
                    <th key={item.id} className="p-3.5 md:p-4 bg-white text-start align-top border-e border-stone-200 last:border-e-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-stone-900 leading-snug line-clamp-1">
                            {isAr ? item.name_ar : item.name_fr}
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#143D30] block mt-0.5">
                            {item.code} · {isAr ? item.city_ar : item.city_fr}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="حذف من المقارنة"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {items.length < 3 && (
                    <th className="p-4 bg-stone-50/50 text-stone-400 font-normal italic text-center">
                      {isAr ? '+ أضف مؤسسة أخرى لمقارنتها' : '+ Ajouter un établissement'}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedRows.length > 0 ? (
                  displayedRows.map((r) => r.render())
                ) : (
                  <tr>
                    <td colSpan={items.length + (items.length < 3 ? 2 : 1)} className="p-8 text-center text-stone-500 bg-stone-50">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="font-bold text-stone-800">
                        {isAr ? 'جميع المعايير متطابقة بين المؤسسات المحددة!' : 'Toutes les données sont identiques pour les critères sélectionnés !'}
                      </p>
                      <button
                        onClick={() => setShowDifferencesOnly(false)}
                        className="mt-2 text-xs text-[#143D30] font-semibold underline"
                      >
                        {isAr ? 'عرض جدول المقارنة الكامل' : 'Afficher le tableau complet'}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
};
