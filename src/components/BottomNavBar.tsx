import React from 'react';
import { Language } from '../types';
import { Home, Building2, BookOpen, Layers, Menu } from 'lucide-react';

export type AppRoute =
  | 'home'
  | 'about'
  | 'programs'
  | 'dormitories'
  | 'export'
  | 'login'
  | 'privacy'
  | 'guide'
  | 'sources'
  | 'moderator';

interface Props {
  lang: Language;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenDirectory: () => void;
  onOpenDrawer: () => void;
  bookmarksCount?: number;
}

export const BottomNavBar: React.FC<Props> = ({
  lang,
  currentRoute,
  onNavigate,
  onOpenDirectory,
  onOpenDrawer,
  bookmarksCount = 0,
}) => {
  const isAr = lang === 'ar';

  const isHome = currentRoute === 'home';
  const isPrograms = currentRoute === 'programs';
  const isDormitories = currentRoute === 'dormitories';

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))]"
      aria-label={isAr ? 'شريط التنقل السفلي للهواتف' : 'Barre de navigation mobile'}
    >
      <div className="max-w-md sm:max-w-xl mx-auto grid grid-cols-5 gap-1 sm:gap-2 items-center px-1 sm:px-3">
        {/* 1. Accueil / الرئيسية */}
        <button
          type="button"
          onClick={() => {
            if (isHome) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onNavigate('home');
            }
          }}
          aria-label={isAr ? 'الصفحة الرئيسية' : 'Accueil'}
          aria-current={isHome ? 'page' : undefined}
          tabIndex={0}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
            isHome
              ? 'text-[#143D30] font-extrabold'
              : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${isHome ? 'bg-[#143D30]/10 text-[#143D30]' : ''}`}>
            <Home className="w-5 h-5 shrink-0" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-tight truncate">
            {isAr ? 'الرئيسية' : 'Accueil'}
          </span>
        </button>

        {/* 2. Directory / المؤسسات */}
        <button
          type="button"
          onClick={onOpenDirectory}
          aria-label={isAr ? 'دليل المؤسسات والجامعات' : 'Établissements'}
          tabIndex={0}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl text-stone-500 hover:text-[#143D30] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none font-medium"
        >
          <div className="p-1 rounded-lg">
            <Building2 className="w-5 h-5 shrink-0" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-tight truncate">
            {isAr ? 'المؤسسات' : 'Établissements'}
          </span>
        </button>

        {/* 3. Filières & Diplômes / المسالك */}
        <button
          type="button"
          onClick={() => onNavigate('programs')}
          aria-label={isAr ? 'دليل المسالك والشهادات' : 'Diplômes'}
          aria-current={isPrograms ? 'page' : undefined}
          tabIndex={0}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
            isPrograms
              ? 'text-[#143D30] font-extrabold'
              : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${isPrograms ? 'bg-[#143D30]/10 text-[#143D30]' : ''}`}>
            <BookOpen className="w-5 h-5 shrink-0" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-tight truncate">
            {isAr ? 'المسالك' : 'Diplômes'}
          </span>
        </button>

        {/* 4. Logement & Bourses / السكن والمنحة */}
        <button
          type="button"
          onClick={() => onNavigate('dormitories')}
          aria-label={isAr ? 'الأحياء والمطاعم والمنحة' : 'Logement'}
          aria-current={isDormitories ? 'page' : undefined}
          tabIndex={0}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
            isDormitories
              ? 'text-[#143D30] font-extrabold'
              : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${isDormitories ? 'bg-[#143D30]/10 text-[#143D30]' : ''}`}>
            <Layers className="w-5 h-5 shrink-0" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-tight truncate">
            {isAr ? 'السكن' : 'Logement'}
          </span>
        </button>

        {/* 5. Menu Drawer / القائمة والمفضلة */}
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label={isAr ? 'القائمة والمزيد' : 'Menu & Plus'}
          tabIndex={0}
          className="flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl text-stone-500 hover:text-[#143D30] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none font-medium relative"
        >
          <div className="p-1 rounded-lg relative">
            <Menu className="w-5 h-5 shrink-0" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold font-mono text-[9px] rounded-full flex items-center justify-center border border-white shadow-2xs">
                {bookmarksCount > 9 ? '9+' : bookmarksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-tight truncate">
            {isAr ? 'القائمة' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
};
