import React from 'react';
import { Target, Briefcase, Sparkles, ArrowRight, ArrowLeft, HelpCircle, Globe } from 'lucide-react';
import { Language } from '../types';

import communityImg from '../assets/images/roadmap_community_networking_1794089649164.jpg';
import careerImg from '../assets/images/roadmap_career_mapping_1794089661852.jpg';

interface Props {
  lang: Language;
  onBackToHome: () => void;
  onToggleLanguage?: () => void;
}

export const RoadmapPage: React.FC<Props> = ({ lang, onBackToHome, onToggleLanguage }) => {
  const isAr = lang === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col">
      {/* Page Header */}
      <div className="bg-[#143D30] text-white py-2.5 sm:py-3 px-2.5 sm:px-8 border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] sm:text-xs font-semibold transition-all shrink-0 whitespace-nowrap"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> : <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
            <span className="sm:hidden">{isAr ? 'الرئيسية' : 'Accueil'}</span>
            <span className="hidden sm:inline">{isAr ? 'العودة للرئيسية' : 'Retour'}</span>
          </button>
          <h1 className="text-[11px] sm:text-base font-extrabold tracking-tight flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 flex-1 px-1">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
            <span className="truncate">
              {isAr ? 'رؤية جامعتي 2027' : 'Jami3ati Vision 2027'}
            </span>
          </h1>
          <div className="flex items-center shrink-0">
            {onToggleLanguage && (
              <button
                type="button"
                onClick={onToggleLanguage}
                className="inline-flex items-center justify-center gap-1 min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] sm:text-xs font-semibold transition-all shrink-0 whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-mono uppercase font-bold">{isAr ? 'FR' : 'عربي'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 pb-24 lg:pb-12 space-y-6 sm:space-y-12">
        {/* Intro */}
        <div className="text-center space-y-2.5 sm:space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-[#143D30]">
            {isAr ? 'نحو تجربة جامعية متكاملة ومخصصة' : 'Vers une expérience universitaire intégrée et personnalisée'}
          </h2>
          <p className="text-xs sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'نهدف لتحويل "جامعتي" من مجرد دليل بيانات إلى شريك أكاديمي يرافق الطالب من البكالوريا حتى الحصول على أول وظيفة.'
              : 'Nous visons à transformer "Jami3ati" d’un simple répertoire en un partenaire académique accompagnant l’étudiant du Bac jusqu’au premier emploi.'}
          </p>
        </div>

        {/* Roadmap Items */}
        <div className="space-y-6 sm:space-y-12">
          {/* Feature 1: Community */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-center bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-md">
            <div className="space-y-3 sm:space-y-4 order-2 md:order-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-[#143D30]">
                  {isAr ? '1. منصة ربط الطلبة (Peer-to-Peer)' : '1. Réseau d’Entraide & Alumni'}
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="bg-[#FAF7F0] p-3.5 sm:p-4 rounded-xl border border-[#EDE8DE]">
                  <p className="font-bold mb-1 flex items-center gap-2"><HelpCircle className="w-4 h-4 shrink-0"/> {isAr ? 'لماذا؟' : 'Pourquoi ?'}</p>
                  <p>{isAr ? 'لأن نصيحة "من جرب" تعادل آلاف الصفحات الرسمية في التأثير.' : 'Parce que les conseils de ceux qui sont passés par là ont plus d’impact que les pages officielles.'}</p>
                </div>
                <div className="bg-[#FAF7F0] p-3.5 sm:p-4 rounded-xl border border-[#EDE8DE]">
                  <p className="font-bold mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 shrink-0"/> {isAr ? 'كيف؟' : 'Comment ?'}</p>
                  <p>{isAr ? 'إضافة قسم "تجربة الطلبة" داخل كل مؤسسة، حيث يشارك الطلبة الحاليون والخريجون نصائحهم الحقيقية.' : 'Ajout d’une section "Expérience étudiants" dans chaque établissement pour le partage d’avis réels.'}</p>
                </div>
              </div>
            </div>
            <img src={communityImg} alt="Community Networking" className="rounded-xl sm:rounded-2xl shadow-md w-full h-44 sm:h-64 md:h-auto object-cover order-1 md:order-2" />
          </div>

          {/* Feature 2: Career */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-center bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-md">
            <img src={careerImg} alt="Career Mapping" className="rounded-xl sm:rounded-2xl shadow-md w-full h-44 sm:h-64 md:h-auto object-cover" />
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-cyan-100 text-cyan-900 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-[#143D30]">
                  {isAr ? '2. خارطة طريق المسار المهني' : '2. Cartographie du Parcours Professionnel'}
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="bg-[#FAF7F0] p-3.5 sm:p-4 rounded-xl border border-[#EDE8DE]">
                  <p className="font-bold mb-1 flex items-center gap-2"><HelpCircle className="w-4 h-4 shrink-0"/> {isAr ? 'لماذا؟' : 'Pourquoi ?'}</p>
                  <p>{isAr ? 'لربط الدراسة الجامعية بسوق الشغل وتفادي البطالة التخصصية.' : 'Pour lier les études universitaires au marché du travail et éviter l’inadéquation.'}</p>
                </div>
                <div className="bg-[#FAF7F0] p-3.5 sm:p-4 rounded-xl border border-[#EDE8DE]">
                  <p className="font-bold mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4 shrink-0"/> {isAr ? 'كيف؟' : 'Comment ?'}</p>
                  <p>{isAr ? 'إضافة قسم "ماذا بعد التخرج؟" الذي يحلل المهارات المطلوبة في المغرب لكل شهادة.' : 'Ajout de la section "Après diplôme" analysant les compétences requises au Maroc pour chaque diplôme.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
