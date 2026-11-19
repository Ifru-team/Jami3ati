import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  X,
  HelpCircle,
  Bookmark,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  BookOpen,
  Home,
  Database,
  FileText,
  Lock,
  Compass,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onToggleLanguage: () => void;
  bookmarksCount: number;
  comparedCount: number;
  onOpenCompare: () => void;
  onOpenHelpCenter: () => void;
  onOpenModerator: () => void;
  onOpenReport: () => void;
  onFilterBookmarks?: () => void;
  onOpenAnalytics?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToPrograms?: () => void;
  onNavigateToDormitories?: () => void;
  onNavigateToExport?: () => void;
  onNavigateToGuide?: () => void;
  onNavigateToSources?: () => void;
  onNavigateToPrivacy?: () => void;
}

export const NavigationDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  onToggleLanguage,
  bookmarksCount,
  comparedCount,
  onOpenCompare,
  onOpenHelpCenter,
  onOpenModerator,
  onOpenReport,
  onFilterBookmarks,
  onOpenAnalytics,
  onNavigateToHome,
  onNavigateToAbout,
  onNavigateToPrograms,
  onNavigateToDormitories,
  onNavigateToExport,
  onNavigateToGuide,
  onNavigateToSources,
  onNavigateToPrivacy,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="قائمة التنقل">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 ${
          isAr ? 'right-0' : 'left-0'
        } max-w-xs sm:max-w-sm w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-${
          isAr ? 'right' : 'left'
        } duration-200 border-${isAr ? 'l' : 'r'} border-stone-200 select-text`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-14 h-14 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/jami3ati_emblem_transparent.png"
                alt={isAr ? 'شعار جامعتي' : 'Logo Jami3ati'}
                className="w-full h-[130%] object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm block">{isAr ? 'جامعتي | Jami3ati' : 'Jami3ati | جامعتي'}</span>
              <span className="text-[11px] text-stone-500 block">
                {isAr ? 'دليل التعليم العالي بالمغرب' : 'Guide de l’enseignement supérieur au Maroc'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* Pages */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 block mb-1">
              {isAr ? 'الصفحات الرئيسية' : 'Pages principales'}
            </span>

            {onNavigateToHome && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToHome();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-[#143D30] font-bold transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'الرئيسية' : 'Accueil'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToPrograms && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPrograms();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-900 font-bold transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'دليل المسالك والشهادات' : 'Répertoire des Diplômes'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToDormitories && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDormitories();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-900 font-bold transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'الأحياء والمطاعم والمنحة' : 'Logement & Bourses'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToExport && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToExport();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'البيانات المفتوحة والتصدير' : 'Export Open Data'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToAbout && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToAbout();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'من نحن وخارطة الطريق' : 'À propos & Feuille de route'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToGuide && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToGuide();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'طريقة وشروط الاستخدام' : 'Guide & Conditions'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToSources && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSources();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'المصادر الرسمية والتواصل' : 'Sources & Contact'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            {onNavigateToPrivacy && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPrivacy();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'سياسة الخصوصية' : 'Confidentialité'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}
          </div>

          {/* Student Tools & Support */}
          <div className="space-y-1 pt-3 border-t border-stone-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 block mb-1">
              {isAr ? 'الأدوات والدعم' : 'Outils & Support'}
            </span>

            {onFilterBookmarks && (
              <button
                onClick={() => {
                  onClose();
                  onFilterBookmarks();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-50 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'المفضلة المحفوظة' : 'Favoris'}</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {bookmarksCount}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenCompare();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-[#143D30]" />
                <span>{isAr ? 'المقارنة المباشرة' : 'Comparateur direct'}</span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#143D30] border border-[#E7E2D6]">
                {comparedCount}/3
              </span>
            </button>

            {onOpenAnalytics && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAnalytics();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-[#143D30]" />
                  <span>{isAr ? 'الإحصائيات والتحليلات' : 'Statistiques & Analyses'}</span>
                </div>
                {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenHelpCenter();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors text-start"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'مركز المساعدة' : 'Centre d’aide'}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 text-[#B43425] font-medium transition-colors text-start"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-[#B43425]" />
                <span>{t.report_inaccuracy}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenModerator();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 text-emerald-800 font-semibold transition-colors text-start mt-1 border-t border-stone-100 pt-3"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t.nav_moderator}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/80 shrink-0 space-y-2">
          <button
            onClick={() => {
              onToggleLanguage();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-colors shadow-2xs"
          >
            <Globe className="w-4 h-4 text-[#143D30]" />
            <span>{isAr ? 'Passer en Français' : 'التحويل إلى اللغة العربية'}</span>
          </button>

          <a
            href="https://data.gov.ma/data/dataset/etablissements-enseignement-superieur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 hover:text-[#143D30] pt-1"
          >
            <span>{isAr ? 'مصدر البيانات: data.gov.ma' : 'Source des données : data.gov.ma'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
