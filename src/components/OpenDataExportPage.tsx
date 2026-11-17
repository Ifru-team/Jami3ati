import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Database,
  CheckCircle2,
  ExternalLink,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import { University, Institution, Language } from '../types';
import { exportDatasetToJson, DATA_GOV_MA_DATASET_URL } from '../utils/dataImport';

interface Props {
  universities: University[];
  institutions: Institution[];
  lang: Language;
  onBackToHome: () => void;
  onToggleLanguage?: () => void;
}

export const OpenDataExportPage: React.FC<Props> = ({
  universities,
  institutions,
  lang,
  onBackToHome,
  onToggleLanguage,
}) => {
  const isAr = lang === 'ar';

  const [copiedApi, setCopiedApi] = useState(false);

  const handleDownloadJson = () => {
    exportDatasetToJson(universities, institutions);
  };

  const handleDownloadCsv = () => {
    const headers = ['Code', 'Name_AR', 'Name_FR', 'City_AR', 'City_FR', 'University', 'Access_Mode', 'Phone', 'Website'];
    const rows = institutions.map((inst) => [
      inst.code,
      `"${inst.name_ar}"`,
      `"${inst.name_fr}"`,
      `"${inst.city_ar}"`,
      `"${inst.city_fr}"`,
      `"${inst.university_name_ar}"`,
      `"${inst.access_mode_ar}"`,
      `"${inst.phone || ''}"`,
      `"${inst.website_url || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jami3ati_moroccan_universities_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyApiUrl = () => {
    navigator.clipboard.writeText(DATA_GOV_MA_DATASET_URL);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-5 sm:space-y-6 flex-1">
        {/* Clean Editorial Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-4 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr ? 'مركز البيانات المفتوحة' : 'Centre de données ouvertes'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'حمّل السجل الموحد للجامعات والمؤسسات العمومية بالمغرب بصيغ مفتوحة جاهزة للبحث والتحليل البرمجي.'
                : 'Téléchargez le répertoire unifié des universités et établissements publics marocains dans des formats ouverts prêts pour l’analyse.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-medium text-stone-500 shrink-0">
            <span dir="ltr" className="font-mono font-bold text-[#143D30]">
              JSON · CSV · Excel
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{isAr ? 'بيانات مفتوحة للجميع' : 'Open Data 100%'}</span>
          </div>
        </header>

        {/* Dataset Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] sm:text-xs text-stone-500 font-bold block mb-1">{isAr ? 'الجامعات الموثقة' : 'Universités'}</span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#143D30]">{universities.length}</span>
            <span className="text-[10px] sm:text-[11px] text-stone-400 block mt-0.5 sm:mt-1">{isAr ? 'سجل حكومي معتمد' : 'Certifiées'}</span>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] sm:text-xs text-stone-500 font-bold block mb-1">{isAr ? 'المؤسسات والكليات' : 'Établissements'}</span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-emerald-800">{institutions.length}</span>
            <span className="text-[10px] sm:text-[11px] text-stone-400 block mt-0.5 sm:mt-1">{isAr ? 'سجل تفصيلي' : 'Détaillés'}</span>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] sm:text-xs text-stone-500 font-bold block mb-1">{isAr ? 'دقة المصادر' : 'Précision Source'}</span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-amber-700">100%</span>
            <span className="text-[10px] sm:text-[11px] text-stone-400 block mt-0.5 sm:mt-1">{isAr ? 'data.gov.ma' : 'Conforme'}</span>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] sm:text-xs text-stone-500 font-bold block mb-1">{isAr ? 'ترخيص البيانات' : 'Licence'}</span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-[#143D30]">Open</span>
            <span className="text-[10px] sm:text-[11px] text-stone-400 block mt-0.5 sm:mt-1">{isAr ? 'استخدام حر للجميع' : 'Utilisation Libre'}</span>
          </div>
        </div>

        {/* Download Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* JSON Export Option */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 hover:border-[#143D30] transition-all shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <FileCode className="w-6 h-6 text-emerald-800" />
              </div>

              <h3 className="text-lg font-bold text-stone-900">
                {isAr ? 'تصدير قاعدة البيانات بصيغة JSON' : 'Exportation Format JSON'}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr
                  ? 'ملف JSON مكتمل يتضمن معايير الجغرافيا، الإحداثيات الدقيقة، أرقام الهاتف المعتمدة، وشروط القبول.'
                  : 'Fichier JSON complet avec coordonnées géographiques, téléphones vérifiés et modes d’accès.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="w-full py-3 px-4 bg-[#143D30] hover:bg-[#0e2c23] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'تحميل ملف JSON (كامل البيانات)' : 'Télécharger JSON'}</span>
            </button>
          </div>

          {/* CSV Export Option */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 hover:border-[#143D30] transition-all shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {isAr ? 'تصدير الجدول بصيغة CSV / Excel' : 'Exportation CSV / Excel'}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr
                  ? 'جدول بيانات متوافق مع البرامج الإحصائية وتطبيقات جدول البيانات (Microsoft Excel / Google Sheets).'
                  : 'Fichier CSV compatible avec Excel et outils d’analyse de données.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="w-full min-h-[44px] py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>{isAr ? 'تحميل ملف CSV (Excel Ready)' : 'Télécharger CSV'}</span>
            </button>
          </div>
        </div>

        {/* API Endpoint Documentation Box */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-md space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Code2 className="w-5 h-5 text-[#143D30] shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {isAr ? 'رابط مصدر البيانات الحكومي المباشر (data.gov.ma)' : 'Source API data.gov.ma'}
              </h3>
            </div>

            <a
              href="https://data.gov.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#143D30] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{isAr ? 'البوابة الوطنية data.gov.ma' : 'Portail Officiel'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div dir="ltr" className="p-3 bg-stone-900 text-emerald-400 font-mono text-[11px] sm:text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="break-all sm:truncate sm:me-2">{DATA_GOV_MA_DATASET_URL}</span>
            <button
              type="button"
              onClick={handleCopyApiUrl}
              className="w-full sm:w-auto min-h-[40px] sm:min-h-[32px] px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
            >
              {copiedApi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedApi ? (isAr ? 'تم النسخ!' : 'Copié !') : (isAr ? 'نسخ الرابط' : 'Copier le lien')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 border-t border-stone-800 text-xs text-center">
        <span>
          {isAr
            ? 'جامعتي | مركز تصدير البيانات المفتوحة وفق ترخيص الاستخدام الحر بالمغرب 2026'
            : 'Jami3ati | Centre d’exportation Open Data selon la licence ouverte au Maroc 2026'}
        </span>
      </footer>
    </div>
  );
};
