import React from 'react';
import { University, Institution, Language } from '../types';
import { translations } from '../data/translations';
import { AcademicAnalyticsSection } from './AcademicAnalyticsSection';
import { ModalBackdrop } from './ModalBackdrop';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, BarChart3 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  universities: University[];
  institutions: Institution[];
  lang: Language;
}

export const AnalyticsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  universities,
  institutions,
  lang,
}) => {
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <ModalBackdrop onClose={onClose} ariaLabelledBy="analytics-modal-title" mobileBottomSheet>
      <div className="relative w-full max-w-5xl max-h-[92dvh] sm:my-auto flex flex-col bg-[#FAF8F5] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden select-text animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#143D30] text-emerald-300 flex items-center justify-center font-bold shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 id="analytics-modal-title" className="text-sm sm:text-lg font-bold text-stone-900 leading-tight truncate">
                {isAr ? 'الإحصائيات والتحليلات البيانية الشاملة' : 'Analyses & Statistiques Détaillées'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                {isAr ? 'توزيع المؤسسات والجامعات حسب المدن والتخصصات وأنماط الولوج' : 'Répartition des établissements par ville et discipline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none shrink-0"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          <AcademicAnalyticsSection universities={universities} institutions={institutions} lang={lang} />
        </div>
      </div>
    </ModalBackdrop>
  );
};
