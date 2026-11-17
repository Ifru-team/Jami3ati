import React, { useMemo } from 'react';
import { University, Institution, Language } from '../types';
import { DISCIPLINE_OPTIONS } from '../data/seedData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Building2, GraduationCap, Sparkles } from 'lucide-react';

interface Props {
  universities: University[];
  institutions: Institution[];
  lang: Language;
}

const COLORS = ['#143D30', '#2E6F58', '#4A9F82', '#D97706', '#B43425', '#78350F', '#1E3A8A', '#065F46'];

export const AcademicAnalyticsSection: React.FC<Props> = ({ universities, institutions, lang }) => {
  const isAr = lang === 'ar';

  // 1. Data for Institutions by City
  const cityData = useMemo(() => {
    const counts: Record<string, { city: string; count: number }> = {};

    institutions.forEach((inst) => {
      const cityName = isAr ? inst.city_ar : inst.city_fr;
      if (!counts[cityName]) {
        counts[cityName] = { city: cityName, count: 0 };
      }
      counts[cityName].count += 1;
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 cities
  }, [institutions, isAr]);

  // 2. Data for Institutions by Discipline
  const disciplineData = useMemo(() => {
    return DISCIPLINE_OPTIONS.map((disc) => {
      const count = institutions.filter((inst) => inst.disciplines?.includes(disc.key)).length;
      return {
        name: isAr ? disc.label_ar : disc.label_fr,
        count,
        key: disc.key,
      };
    }).filter((d) => d.count > 0);
  }, [institutions, isAr]);

  // 3. Data for Admission Type (Regulated vs Open)
  const admissionData = useMemo(() => {
    const regulated = institutions.filter((inst) => inst.admission_type === 'regulated').length;
    const open = institutions.filter((inst) => inst.admission_type === 'open').length;
    return [
      { name: isAr ? 'ولوج محدود (مباراة/انتقاء)' : 'Accès régulé', value: regulated },
      { name: isAr ? 'ولوج مفتوح' : 'Accès ouvert', value: open },
    ];
  }, [institutions, isAr]);

  return (
    <section id="academic-analytics" className="py-10 sm:py-16 bg-[#FAF8F5] border-t border-stone-200 w-full max-w-full overflow-x-clip">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 space-y-6 sm:space-y-10 w-full">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#143D30]/10 text-[#143D30] text-[11px] sm:text-xs font-semibold">
            <BarChart3 className="w-4 h-4" />
            <span>{isAr ? 'الإحصائيات والتحليلات البيانية' : 'Analyses & Statistiques'}</span>
          </div>
          <h2 className="text-lg sm:text-3xl font-bold text-stone-900 tracking-tight">
            {isAr ? 'توزيع المؤسسات حسب المدن والتخصصات' : 'Répartition par Villes et Disciplines'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {isAr
              ? 'رؤية بصرية شاملة تستند إلى السجل الوطني للتعليم العالي والبحث العلمي لتسهيل مقارنة الأقطاب الأكاديمية.'
              : 'Visualisation statistique des établissements universitaires au Maroc par région et filière.'}
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-full">
          {/* Chart 1: Institutions by City (Bar Chart) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#143D30]" />
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {isAr ? 'أبرز المدن والأقطاب الجامعية' : 'Principaux Pôles Urbains'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Recharts Bar</span>
            </div>

            <div className="h-56 sm:h-72 w-full pt-2" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
                  <XAxis
                    dataKey="city"
                    tick={{ fill: '#44403c', fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fill: '#44403c', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#143D30" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Institutions by Discipline (Bar Chart) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#143D30]" />
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {isAr ? 'توزيع التخصصات الأكاديمية' : 'Répartition par Filières'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Recharts Bar</span>
            </div>

            <div className="h-56 sm:h-72 w-full pt-2" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disciplineData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#44403c', fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fill: '#44403c', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#D97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Admission Types (Pie Chart) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 sm:space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#143D30]" />
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {isAr ? 'نسبة أنماط الولوج (محدود vs مفتوح)' : 'Modes d’Accès (Régulé vs Ouvert)'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Recharts Pie</span>
            </div>

            <div className="h-60 sm:h-64 w-full flex items-center justify-center pt-2" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={admissionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {admissionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
