import React, { useState } from 'react';
import { Language, DataStatus, InstitutionType, DisciplineKey } from '../types';
import { DISCIPLINE_OPTIONS } from '../data/seedData';
import { translations } from '../data/translations';
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  X,
  Building2,
  GraduationCap,
  Bookmark,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  lang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedDiscipline: DisciplineKey | 'all';
  onDisciplineChange: (discipline: DisciplineKey | 'all') => void;
  viewFilter: 'all' | 'universities' | 'institutions';
  onViewFilterChange: (view: 'all' | 'universities' | 'institutions') => void;
  admissionFilter: 'all' | 'regulated' | 'open';
  onAdmissionFilterChange: (admission: 'all' | 'regulated' | 'open') => void;
  onlyBookmarksFilter: boolean;
  onToggleBookmarksFilter: () => void;
  bookmarksCount: number;
  totalResultsCount: number;
  universitiesCount: number;
  institutionsCount: number;
  disciplineCounts: Record<string, number>;
  sortBy?: 'default' | 'name' | 'city' | 'admission';
  onSortChange?: (sort: 'default' | 'name' | 'city' | 'admission') => void;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<Props> = ({
  lang,
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  selectedDiscipline,
  onDisciplineChange,
  viewFilter,
  onViewFilterChange,
  admissionFilter,
  onAdmissionFilterChange,
  onlyBookmarksFilter,
  onToggleBookmarksFilter,
  bookmarksCount,
  totalResultsCount,
  universitiesCount,
  institutionsCount,
  disciplineCounts,
  sortBy = 'default',
  onSortChange,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const t = translations[lang];
  const isAr = lang === 'ar';

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCity !== 'all' ||
    selectedStatus !== 'all' ||
    selectedType !== 'all' ||
    selectedDiscipline !== 'all' ||
    viewFilter !== 'all' ||
    admissionFilter !== 'all' ||
    onlyBookmarksFilter;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all duration-200">
      {/* Top Bar: View Segmented Control & Bookmarks Toggle */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented View Switcher */}
        <div className="grid grid-cols-2 sm:inline-flex sm:items-center gap-1.5 p-1.5 sm:p-1 bg-stone-100/90 rounded-xl text-xs font-medium w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onViewFilterChange('all')}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
              viewFilter === 'all' && !onlyBookmarksFilter
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{isAr ? 'الكل' : 'Tous'}</span>
            <span className="font-mono text-[11px] opacity-80">({universitiesCount + institutionsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onlyBookmarksFilter) onToggleBookmarksFilter();
              onViewFilterChange('universities');
            }}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
              viewFilter === 'universities' && !onlyBookmarksFilter
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#143D30] shrink-0" />
            <span>{isAr ? 'الجامعات' : 'Universités'} ({universitiesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onlyBookmarksFilter) onToggleBookmarksFilter();
              onViewFilterChange('institutions');
            }}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
              viewFilter === 'institutions' && !onlyBookmarksFilter
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#143D30] shrink-0" />
            <span className="truncate">{isAr ? 'المؤسسات' : 'Établissements'} ({institutionsCount})</span>
          </button>

          {/* Bookmarks Filter Tab */}
          <button
            type="button"
            onClick={onToggleBookmarksFilter}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
              onlyBookmarksFilter
                ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 shrink-0 ${onlyBookmarksFilter ? 'fill-amber-600 text-amber-600' : 'text-stone-400'}`} />
            <span>{isAr ? 'المفضلة' : 'Favoris'}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white text-stone-700">
              {bookmarksCount}
            </span>
          </button>
        </div>

        {/* Live Counter, Sort Selector & Toggle Advanced Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-2.5 text-xs text-stone-500 w-full md:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-1.5">
            <span>{t.results_count}</span>
            <span className="font-mono tabular-nums font-bold text-sm text-[#143D30] bg-[#FAF7F0] px-2.5 py-0.5 rounded border border-[#E7E2D6]">
              {totalResultsCount}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            {onSortChange && (
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'default' | 'name' | 'city' | 'admission')}
                className="min-h-[42px] w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 text-xs font-medium focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none"
                aria-label={isAr ? 'ترتيب النتائج' : 'Trier les résultats'}
              >
                <option value="default">{isAr ? 'ترتيب: افتراضي' : 'Tri : Par défaut'}</option>
                <option value="name">{isAr ? 'ترتيب: حسب الاسم' : 'Tri : Par nom (A–Z)'}</option>
                <option value="city">{isAr ? 'ترتيب: حسب المدينة' : 'Tri : Par ville'}</option>
                <option value="admission">{isAr ? 'محدود الاستقطاب أولاً' : 'Accès régulé d’abord'}</option>
              </select>
            )}

            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className={`min-h-[42px] w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none whitespace-nowrap ${
                showAdvanced || selectedCity !== 'all' || selectedStatus !== 'all' || selectedType !== 'all' || admissionFilter !== 'all'
                  ? 'bg-[#143D30] text-white border-[#143D30]'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'تصفية تفصيلية' : 'Filtres avancés'}</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Discipline & Admission Selectors */}
      <div className="px-4 sm:px-5 py-3 bg-[#FAF8F5] border-b border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label
            htmlFor="home-discipline-select"
            className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 mb-1"
          >
            <Layers className="w-3.5 h-3.5 text-[#143D30]" />
            <span>{isAr ? 'الشعبة / التخصص الدراسي' : 'Filière / Discipline'}</span>
          </label>
          <select
            id="home-discipline-select"
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value as DisciplineKey | 'all')}
            className="w-full min-h-[40px] px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#143D30] cursor-pointer"
          >
            <option value="all">
              {isAr ? `جميع التخصصات (${institutionsCount})` : `Toutes les disciplines (${institutionsCount})`}
            </option>
            {DISCIPLINE_OPTIONS.map((disc) => (
              <option key={disc.key} value={disc.key}>
                {isAr ? disc.label_ar : disc.label_fr} ({disciplineCounts[disc.key] || 0})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="home-admission-select"
            className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 mb-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#143D30]" />
            <span>{isAr ? 'نمط الولوج' : 'Mode d’accès'}</span>
          </label>
          <select
            id="home-admission-select"
            value={admissionFilter}
            onChange={(e) => onAdmissionFilterChange(e.target.value as 'all' | 'regulated' | 'open')}
            className="w-full min-h-[40px] px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#143D30] cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع أنماط الولوج' : 'Tous les modes d’accès'}</option>
            <option value="regulated">
              {isAr ? 'محدود الاستقطاب (مباريات: ENSA, ENCG, FMP, FST)' : 'Accès régulé (Concours / Sélection)'}
            </option>
            <option value="open">
              {isAr ? 'مفتوح الاستقطاب (كليات العلوم، الحقوق، الآداب)' : 'Accès ouvert (Facultés)'}
            </option>
          </select>
        </div>
      </div>

      {/* Advanced Secondary Filters */}
      {showAdvanced && (
        <div className="p-4 sm:p-5 bg-white border-b border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-1 duration-150 text-xs">
          {/* City filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.filter_by_city}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143D30]"
            >
              <option value="all">{t.all_cities}</option>
              <option value="الرباط">الرباط / Rabat</option>
              <option value="الدار البيضاء">الدار البيضاء / Casablanca</option>
              <option value="مراكش">مراكش / Marrakech</option>
              <option value="فاس">فاس / Fès</option>
              <option value="طنجة">طنجة / Tanger</option>
              <option value="أكادير">أكادير / Agadir</option>
              <option value="القنيطرة">القنيطرة / Kénitra</option>
              <option value="وجدة">وجدة / Oujda</option>
              <option value="مكناس">مكناس / Meknès</option>
              <option value="سطات">سطات / Settat</option>
              <option value="الجديدة">الجديدة / El Jadida</option>
              <option value="بني ملال">بني ملال / Béni Mellal</option>
              <option value="تطوان">تطوان / Tétouan</option>
              <option value="تارودانت">تارودانت / Taroudant</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.filter_by_type}
            </label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143D30]"
            >
              <option value="all">{t.all_types}</option>
              <option value="engineering_school">مدارس المهندسين / Grandes écoles</option>
              <option value="faculty">الكليات الجامعية / Facultés</option>
              <option value="business_school">مدارس التجارة والتسيير / Commerce & Gestion</option>
            </select>
          </div>

          {/* Verification status filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.filter_by_status}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143D30]"
            >
              <option value="all">{t.all_statuses}</option>
              <option value="verified">{t.status_verified}</option>
              <option value="needs_review">{t.status_needs_review}</option>
              <option value="demo">{t.status_demo}</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filter Badges Strip & Quick Reset */}
      {hasActiveFilters && (
        <div className="px-4 sm:px-5 py-2.5 bg-stone-50/70 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-500 font-medium me-1">{isAr ? 'الفلاتر النشطة:' : 'Filtres actifs :'}</span>

            {onlyBookmarksFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold">
                <span>{isAr ? 'المفضلة فقط' : 'Favoris uniquement'}</span>
                <button onClick={onToggleBookmarksFilter} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {admissionFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
                <span>
                  {isAr
                    ? admissionFilter === 'regulated' ? 'محدود الاستقطاب' : 'مفتوح الاستقطاب'
                    : admissionFilter === 'regulated' ? 'Accès régulé' : 'Accès ouvert'}
                </span>
                <button onClick={() => onAdmissionFilterChange('all')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-800 text-[11px]">
                <span>{isAr ? `بحث: «${searchQuery}»` : `Recherche : « ${searchQuery} »`}</span>
                <button onClick={() => onSearchChange('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedDiscipline !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                <span>
                  {isAr
                    ? DISCIPLINE_OPTIONS.find((d) => d.key === selectedDiscipline)?.label_ar
                    : DISCIPLINE_OPTIONS.find((d) => d.key === selectedDiscipline)?.label_fr}
                </span>
                <button onClick={() => onDisciplineChange('all')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-800 text-[11px]">
                <span>{isAr ? `مدينة: ${selectedCity}` : `Ville : ${selectedCity}`}</span>
                <button onClick={() => onCityChange('all')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B43425] hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.clear_filters}</span>
          </button>
        </div>
      )}
    </div>
  );
};
