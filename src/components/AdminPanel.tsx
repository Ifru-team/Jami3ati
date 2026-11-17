import React, { useState } from 'react';
import { University, Institution, InaccuracyReport, Language, DataStatus } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Plus, Download, AlertCircle, Check, X, FileSpreadsheet, Eye, RefreshCw, Database } from 'lucide-react';
import { ModalBackdrop } from './ModalBackdrop';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { DEFAULT_CAMPUS_IMAGE } from '../utils/imageAssets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  universities: University[];
  institutions: Institution[];
  reports: InaccuracyReport[];
  lang: Language;
  onAddInstitution: (inst: Institution) => void;
  onUpdateReportStatus: (reportId: string, newStatus: InaccuracyReport['status']) => void;
  onSyncDataGov?: () => Promise<void>;
  isLoadingDataGov?: boolean;
}

export const AdminPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  universities,
  institutions,
  reports,
  lang,
  onAddInstitution,
  onUpdateReportStatus,
  onSyncDataGov,
  isLoadingDataGov = false,
}) => {
  useEscapeKey(onClose, isOpen);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'reports' | 'add_institution' | 'data_gov'>('reports');

  // Form state for adding an institution
  const [code, setCode] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [parentUnivId, setParentUnivId] = useState(universities[0]?.id || '');
  const [cityAr, setCityAr] = useState('الرباط');
  const [cityFr, setCityFr] = useState('Rabat');
  const [campusAr, setCampusAr] = useState('');
  const [campusFr, setCampusFr] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [sourceName, setSourceName] = useState('البوابة الرسمية للمؤسسة');
  const [sourceUrl, setSourceUrl] = useState('');
  const [dataStatus, setDataStatus] = useState<DataStatus>('verified');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parentUniv = universities.find((u) => u.id === parentUnivId) || universities[0];

    const newInst: Institution = {
      id: `inst-${code.toLowerCase().trim()}-${Date.now()}`,
      code: code.toUpperCase().trim(),
      university_id: parentUniv.id,
      university_name_ar: parentUniv.name_ar,
      university_name_fr: parentUniv.name_fr,
      name_ar: nameAr,
      name_fr: nameFr,
      type: 'engineering_school',
      type_label_ar: 'مؤسسة جامعية موثقة',
      type_label_fr: 'Établissement universitaire',
      city_ar: cityAr,
      city_fr: cityFr,
      campus_ar: campusAr || 'الحرم الجامعي الرئيسي',
      campus_fr: campusFr || 'Campus Universitaire Principal',
      website_url: websiteUrl,
      phone: phone.trim() ? phone : null,
      email: null,
      source_name: sourceName,
      source_url: sourceUrl,
      verified_at: new Date().toISOString().split('T')[0],
      data_status: dataStatus,
      programs_summary_ar: ['مسالك التكوين الأساسي والمستمر'],
      programs_summary_fr: ['Formations fondamentales et spécialisées'],
      access_mode_ar: 'مباراة وطنية أو انتقاء رسمي منشور',
      access_mode_fr: 'Concours ou sélection sur dossier officiel',
      image_url: DEFAULT_CAMPUS_IMAGE,
    };

    onAddInstitution(newInst);
    setSuccessNotice(
      isAr
        ? `تم إدراج المؤسسة (${newInst.code}) وتوثيق المصدر بنجاح في قاعدة البيانات المحلية!`
        : `L'établissement (${newInst.code}) a été ajouté avec sa source validée !`
    );

    // reset form
    setCode('');
    setNameAr('');
    setNameFr('');
    setWebsiteUrl('');
    setSourceUrl('');
    setPhone('');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleExportJSON = () => {
    const dataset = {
      meta: {
        platform: 'Jami3ati - Moroccan Higher Education Open Data Guide',
        version: '1.0.0-hackathon-mvp',
        exported_at: new Date().toISOString(),
        sources_origin: 'data.gov.ma & official published domains (.ac.ma)',
      },
      universities,
      institutions,
      reports_count: reports.length,
    };

    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jami3ati_morocco_universities_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ModalBackdrop onClose={onClose} ariaLabelledBy="admin-modal-title" mobileBottomSheet>
      <div className="relative w-full max-w-4xl max-h-[92dvh] sm:my-auto flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden select-text animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#FAF7F0] border-b border-stone-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#143D30] text-white flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 id="admin-modal-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                {t.admin_title}
              </h2>
              <p className="text-xs text-stone-500">
                مساحة العمل الإدارية المستقلة (Demo Admin Portal)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-[#143D30] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                البلاغات ({reports.length})
              </button>
              <button
                onClick={() => setActiveTab('add_institution')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'add_institution'
                    ? 'bg-[#143D30] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                + إضافة مؤسسة
              </button>
              <button
                onClick={() => setActiveTab('data_gov')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'data_gov'
                    ? 'bg-[#143D30] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>بوابة data.gov.ma</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-b border-stone-200 bg-stone-50 p-2 gap-1.5 text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-center transition-colors ${
              activeTab === 'reports' ? 'bg-[#143D30] text-white font-bold' : 'bg-stone-200/80 text-stone-700'
            }`}
          >
            البلاغات ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('add_institution')}
            className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-center transition-colors ${
              activeTab === 'add_institution' ? 'bg-[#143D30] text-white font-bold' : 'bg-stone-200/80 text-stone-700'
            }`}
          >
            + إضافة
          </button>
          <button
            onClick={() => setActiveTab('data_gov')}
            className={`flex-1 min-h-[42px] py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1 transition-colors ${
              activeTab === 'data_gov' ? 'bg-[#143D30] text-white font-bold' : 'bg-stone-200/80 text-stone-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 shrink-0" />
            <span>data.gov.ma</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 overscroll-contain">
          {/* Tab 1: Reports Moderation */}
          {activeTab === 'reports' && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 overflow-hidden">
              <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900">
                  بلاغات التدقيق والتصحيح الواردة من المستخدمين
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  {reports.filter((r) => r.status === 'pending').length} بلاغات قيد الدراسة
                </span>
              </div>

              {reports.length === 0 ? (
                <div className="p-12 text-center text-stone-500 text-sm">
                  لا توجد بلاغات حاليًا. كل المعلومات متطابقة مع مصادرها.
                </div>
              ) : (
                <div className="divide-y divide-stone-200">
                  {reports.map((report) => (
                    <div key={report.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-bold">
                            {report.id}
                          </span>
                          <span className="font-bold text-sm text-stone-900">
                            {report.target_name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium ${
                              report.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : report.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {report.status === 'pending' ? 'قيد المراجعة' : report.status === 'approved' ? 'معتمد' : 'مرفوض'}
                          </span>
                        </div>

                        <div className="text-xs text-stone-700">
                          <span className="text-stone-500 font-medium">الحقل: </span>
                          <span>{report.field_name}</span>
                          <span className="mx-2">←</span>
                          <span className="text-stone-500 font-medium">التصحيح المقترح: </span>
                          <span className="font-medium text-emerald-800">{report.proposed_correction}</span>
                        </div>

                        <div className="text-xs text-stone-600">
                          <span className="text-stone-500 font-medium">مصدر الإثبات: </span>
                          <a
                            href={report.source_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#143D30] hover:underline font-mono"
                          >
                            {report.source_proof_url}
                          </a>
                        </div>
                        {report.user_notes && (
                          <p className="text-xs text-stone-500 italic">« {report.user_notes} »</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onUpdateReportStatus(report.id, 'approved')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>قبول وتحديث</span>
                            </button>
                            <button
                              onClick={() => onUpdateReportStatus(report.id, 'rejected')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>رفض</span>
                            </button>
                          </>
                        )}
                        {report.status !== 'pending' && (
                          <span className="text-xs text-stone-400">تم البت في البلاغ</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Add Institution Form */}
          {activeTab === 'add_institution' && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-6">
              <h3 className="font-bold text-base text-stone-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#143D30]" />
                <span>إضافة مؤسسة جامعية جديدة مع توثيق المصدر الإلزامي</span>
              </h3>

              {successNotice && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium">
                  {successNotice}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    الاسم بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: المدرسة العليا للتكنولوجيا بسلا"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    الاسم بالفرنسية *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: École Supérieure de Technologie de Salé"
                    value={nameFr}
                    onChange={(e) => setNameFr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    رمز المؤسسة (Acronyme) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: EST-SALE"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    الجامعة التابعة لها *
                  </label>
                  <select
                    value={parentUnivId}
                    onChange={(e) => setParentUnivId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name_ar} ({u.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityAr}
                    onChange={(e) => {
                      setCityAr(e.target.value);
                      setCityFr(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    رابط الموقع الرسمي *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    اسم المصدر المعتمد *
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    رابط المصدر أو المنشور الرسمي *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://data.gov.ma/..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    حالة توثيق البيانات *
                  </label>
                  <select
                    value={dataStatus}
                    onChange={(e) => setDataStatus(e.target.value as DataStatus)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  >
                    <option value="verified">موثق بمصدر رسمي (Verified)</option>
                    <option value="needs_review">قيد التدقيق (Needs Review)</option>
                    <option value="demo">بيانات تجريبية (Demo Seed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    الهاتف الرسمي (اتركه فارغاً إن لم يكن موثقاً)
                  </label>
                  <input
                    type="text"
                    placeholder="+212 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div className="md:col-span-2 pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#143D30] hover:bg-[#0f2e24] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs"
                  >
                    حفظ وتوثيق المؤسسة
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: data.gov.ma Open Data Management */}
          {activeTab === 'data_gov' && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#143D30] text-emerald-300 rounded-xl flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      بوابة البيانات المفتوحة (data.gov.ma)
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      السجل الوطني الموحد لمؤسسات التعليم العالي والبحث العلمي
                    </p>
                  </div>
                </div>

                {onSyncDataGov && (
                  <button
                    type="button"
                    onClick={() => onSyncDataGov()}
                    disabled={isLoadingDataGov}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#143D30] hover:bg-[#0f2e24] disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDataGov ? 'animate-spin' : ''}`} />
                    <span>{isLoadingDataGov ? 'جاري المزامنة...' : 'مزامنة واستيراد JSON الآن'}</span>
                  </button>
                )}
              </div>

              {/* Status & Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[11px] text-stone-500 block mb-1">الجامعات العمومية</span>
                  <span className="font-mono text-xl font-bold text-[#143D30]">{universities.length}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[11px] text-stone-500 block mb-1">المؤسسات والكليات</span>
                  <span className="font-mono text-xl font-bold text-[#143D30]">{institutions.length}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[11px] text-stone-500 block mb-1">إجمالي السجلات</span>
                  <span className="font-mono text-xl font-bold text-stone-900">{universities.length + institutions.length}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[11px] text-stone-500 block mb-1">حالة السجل الوطني</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    بيانات مفتوحة معتمدة
                  </span>
                </div>
              </div>

              {/* Source Details Box */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="font-bold text-stone-800">بيانات المصدر والناشر:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
                  <div>
                    <span className="text-stone-400 font-medium">الجهة الناشرة: </span>
                    <span className="font-medium text-stone-800">وزارة التعليم العالي والبحث العلمي والابتكار / data.gov.ma</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">الترخيص: </span>
                    <span className="font-medium text-stone-800">رخصة البيانات المفتوحة للمملكة المغربية (ODL)</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-400 font-medium">رابط الحزمة: </span>
                    <a
                      href="https://data.gov.ma/data/dataset/etablissements-enseignement-superieur"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#143D30] hover:underline font-mono"
                    >
                      https://data.gov.ma/data/dataset/etablissements-enseignement-superieur
                    </a>
                  </div>
                </div>
              </div>

              {/* Export Button Area */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-600">
                  <span className="font-bold text-stone-800 block">تصدير مجموعة البيانات الكاملة:</span>
                  تنزيل ملف JSON يحتوي على كافة الجامعات والمؤسسات وروابط التحقق الرسمية.
                </div>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors shrink-0"
                >
                  <Download className="w-4 h-4 text-[#143D30]" />
                  <span>تنزيل نسخة JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
};
