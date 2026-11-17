import React, { useState } from 'react';
import { University, Institution, InaccuracyReport, Language, DataStatus } from '../types';
import { translations } from '../data/translations';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Globe,
  ExternalLink,
  History,
  TrendingUp,
  UserCheck,
  Edit3,
  Save,
  X,
  Sparkles,
  Search,
  Filter,
  MessageSquare,
  Star,
  LogOut,
  Download,
  Printer,
} from 'lucide-react';
import { ModalBackdrop } from './ModalBackdrop';
import { PhoneDisplay } from './PhoneDisplay';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { ModeratorUser } from './ModeratorLoginModal';

interface Props {
  universities: University[];
  institutions: Institution[];
  reports: InaccuracyReport[];
  feedbacks?: import('../types').StudentFeedback[];
  lang: Language;
  onUpdateInstitution: (updated: Institution) => void;
  onUpdateUniversity: (updated: University) => void;
  onUpdateReportStatus: (reportId: string, newStatus: InaccuracyReport['status'], notes?: string) => void;
  onUpdateFeedbackStatus?: (feedbackId: string, newStatus: 'approved' | 'rejected') => void;
  onClosePortal?: () => void;
  currentUser?: ModeratorUser | null;
  onSignOut?: () => void;
  isStandalone?: boolean;
}

interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  target: string;
  status: 'success' | 'warning' | 'info';
}

export const ModeratorPortal: React.FC<Props> = ({
  universities,
  institutions,
  reports,
  feedbacks = [],
  lang,
  onUpdateInstitution,
  onUpdateUniversity,
  onUpdateReportStatus,
  onUpdateFeedbackStatus,
  onClosePortal,
  currentUser,
  onSignOut,
  isStandalone = false,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'queue' | 'feedbacks' | 'institutions' | 'logs' | 'metrics'>('queue');
  const [selectedRole, setSelectedRole] = useState<'lead_verifier' | 'open_data_specialist'>('lead_verifier');

  // Search filter inside moderator table
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'needs_review'>('all');
  const [editingInstId, setEditingInstId] = useState<string | null>(null);

  // Edit buffer
  const [editBuffer, setEditBuffer] = useState<{
    phone: string;
    website_url: string;
    data_status: DataStatus;
    verified_at: string;
  }>({
    phone: '',
    website_url: '',
    data_status: 'verified',
    verified_at: '',
  });

  // Local audit log for demo session
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      action: 'اعتماد مطابقة علاقة ENSIAS بجامعة محمد الخامس وفق مرسوم الإحداث',
      actor: 'مدقق البيانات المفتوحة',
      timestamp: '2026-11-04 11:20:00',
      target: 'ENSIAS - UM5',
      status: 'success',
    },
    {
      id: 'log-2',
      action: 'تحديث رابط البوابة المركزية لجامعة القاضي عياض ومطابقة شهادة SSL',
      actor: 'المشرف الأكاديمي',
      timestamp: '2026-11-03 16:45:00',
      target: 'UCA Marrakech',
      status: 'info',
    },
    {
      id: 'log-3',
      action: 'إحالة سجل جامعة الحسن الثاني على المراجعة بانتظار نشر مرسوم التوزيع الجديد',
      actor: 'مدقق البيانات المفتوحة',
      timestamp: '2026-11-02 09:15:00',
      target: 'UH2 Casablanca',
      status: 'warning',
    },
  ]);

  // Statistics
  const totalVerified = institutions.filter((i) => i.data_status === 'verified').length +
                        universities.filter((u) => u.data_status === 'verified').length;
  const totalNeedsReview = institutions.filter((i) => i.data_status === 'needs_review').length +
                           universities.filter((u) => u.data_status === 'needs_review').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const pendingFeedbacksCount = feedbacks.filter((f) => f.status === 'pending').length;

  const handleProcessFeedback = (id: string, decision: 'approved' | 'rejected') => {
    onUpdateFeedbackStatus?.(id, decision);

    const targetFb = feedbacks.find((f) => f.id === id);
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action: decision === 'approved'
        ? `اعتماد ونشر تقييم طالب لمؤسسة ${targetFb?.institution_code || ''}`
        : `رفض تقييم طالب لمخالفته ميثاق النزاهة والموضوعية`,
      actor: selectedRole === 'lead_verifier' ? 'المشرف الأكاديمي الرئيسي' : 'أخصائي البيانات المفتوحة',
      target: targetFb?.institution_name_ar || 'تقييم طالب',
      timestamp: new Date().toLocaleString('ar-MA'),
      status: decision === 'approved' ? 'success' : 'warning',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleStartEdit = (inst: Institution) => {
    setEditingInstId(inst.id);
    setEditBuffer({
      phone: inst.phone || '',
      website_url: inst.website_url,
      data_status: inst.data_status,
      verified_at: inst.verified_at,
    });
  };

  const handleSaveEdit = (inst: Institution) => {
    const updated: Institution = {
      ...inst,
      phone: editBuffer.phone.trim() ? editBuffer.phone : null,
      website_url: editBuffer.website_url,
      data_status: editBuffer.data_status,
      verified_at: new Date().toISOString().split('T')[0],
    };

    onUpdateInstitution(updated);
    setEditingInstId(null);

    // append to audit log
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action: `تحديث بيانات المؤسسة وتغيير حالة التوثيق إلى (${editBuffer.data_status})`,
      actor: selectedRole === 'lead_verifier' ? 'المشرف الأكاديمي الرئيسي' : 'أخصائي البيانات المفتوحة',
      timestamp: new Date().toLocaleString('ar-MA'),
      target: inst.name_ar,
      status: 'success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleProcessReport = (report: InaccuracyReport, decision: 'approved' | 'rejected') => {
    onUpdateReportStatus(report.id, decision);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action: decision === 'approved' ? `قبول واعتماد بلاغ الطالب: ${report.field_name}` : `رفض بلاغ لعدم كفاية المصدر الرسمي`,
      actor: selectedRole === 'lead_verifier' ? 'المشرف الأكاديمي الرئيسي' : 'أخصائي البيانات المفتوحة',
      target: report.target_name,
      timestamp: new Date().toLocaleString('ar-MA'),
      status: decision === 'approved' ? 'success' : 'warning',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jami3ati_audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportReportsCSV = () => {
    const headers = ['Report ID', 'Target Name', 'Field Name', 'Current Value', 'Proposed Correction', 'Source Proof URL', 'Status', 'Date'];
    const rows = reports.map(r => [
      r.id,
      `"${(r.target_name || '').replace(/"/g, '""')}"`,
      `"${(r.field_name || '').replace(/"/g, '""')}"`,
      `"${(r.current_value || '').replace(/"/g, '""')}"`,
      `"${(r.proposed_correction || '').replace(/"/g, '""')}"`,
      `"${(r.source_proof_url || '').replace(/"/g, '""')}"`,
      r.status,
      r.created_at || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jami3ati_inaccuracy_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action: 'تصدير قائمة بلاغات عدم الدقة (CSV) للأرشفة الإدارية',
      actor: selectedRole === 'lead_verifier' ? 'المشرف الأكاديمي الرئيسي' : 'أخصائي البيانات المفتوحة',
      target: 'قائمة البلاغات والشكايات',
      timestamp: new Date().toLocaleString('ar-MA'),
      status: 'info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleExportReportsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير بلاغات تدقيق البيانات والأخطاء - منصة جامعتي</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; padding: 25px; color: #1c1917; direction: rtl; }
          h1 { font-size: 20px; color: #143D30; border-bottom: 2px solid #143D30; padding-bottom: 8px; margin-bottom: 5px; }
          .meta { font-size: 12px; color: #78716c; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          th, td { border: 1px solid #d6d3d1; padding: 8px 10px; text-align: right; vertical-align: top; }
          th { background-color: #f5f5f4; color: #292524; font-weight: bold; }
          tr:nth-child(even) { background-color: #fafaf9; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          .pending { background: #fef3c7; color: #92400e; }
          .approved { background: #d1fae5; color: #065f46; }
          .rejected { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 30px; font-size: 11px; text-align: center; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>منصة جامعتي الأكاديمية - تقرير بلاغات وتصحيحات البيانات (أرشفة إدارية)</h1>
        <div class="meta">تاريخ التقرير: ${new Date().toLocaleString('ar-MA')} | إجمالي البلاغات: ${reports.length}</div>
        <table>
          <thead>
            <tr>
              <th>معرف البلاغ</th>
              <th>الهدف / المؤسسة</th>
              <th>الحقل المعني</th>
              <th>القيمة المقترحة</th>
              <th>رابط الإثبات الرسمي</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(r => `
              <tr>
                <td><code>${r.id}</code></td>
                <td><strong>${r.target_name}</strong></td>
                <td>${r.field_name}</td>
                <td><span style="color: #047857; font-family: monospace;">${r.proposed_correction}</span></td>
                <td><a href="${r.source_proof_url}" target="_blank">${r.source_proof_url}</a></td>
                <td>
                  <span class="badge ${r.status}">
                    ${r.status === 'pending' ? 'قيد الفحص' : r.status === 'approved' ? 'معتمد' : 'مرفوض'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          منصة جامعتي الوطنية · سجل إداري رسمي موثق ومطابق لبيانات التعليم العالي المغربي.
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action: 'تصدير وطباعة تقرير بلاغات عدم الدقة (PDF / Print)',
      actor: selectedRole === 'lead_verifier' ? 'المشرف الأكاديمي الرئيسي' : 'أخصائي البيانات المفتوحة',
      target: 'تقرير بلاغات الأخطاء',
      timestamp: new Date().toLocaleString('ar-MA'),
      status: 'success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Listen for Escape key globally to close this modal if not standalone
  useEscapeKey(() => onClosePortal?.(), Boolean(onClosePortal) && !isStandalone);

  const portalContent = (
    <div className={`relative w-full ${isStandalone ? 'max-w-none' : 'max-w-5xl max-h-[90vh] my-auto'} flex flex-col bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden select-text`}>
        {/* Modal Top Header - Fixed */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#143D30] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  فضاء الحكامة والمطابقة
                </span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-mono">Open Data Governance</span>
              </div>
              <h2 id="moderator-portal-title" className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                لوحة المكلفين بالموقع وتدقيق البيانات الجامعية
              </h2>
            </div>
          </div>

          {/* Authenticated User Badge, Role selector & dismiss */}
          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#FAF7F0] border border-[#EDE8DE] px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-[#143D30] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.avatar_code}
                </div>
                <div className="text-start leading-tight min-w-0">
                  <span className="text-xs font-bold text-stone-900 block truncate">
                    {isAr ? currentUser.name_ar : currentUser.name_fr}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold block truncate">
                    {isAr ? currentUser.role_title_ar : currentUser.role_title_fr}
                  </span>
                </div>

                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="ms-1.5 p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                    title={isAr ? 'تسجيل الخروج من حساب المكلف' : 'Déconnexion'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isAr ? 'خروج' : 'Déconnexion'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-stone-600 bg-stone-100 p-1.5 rounded-lg border border-stone-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#143D30]" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="lead_verifier">المشرف الأكاديمي الرئيسي (Auditeur en chef)</option>
                  <option value="open_data_specialist">أخصائي البيانات المفتوحة (Data Steward)</option>
                </select>
              </div>
            )}

            {onClosePortal && (
              <button
                onClick={onClosePortal}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                title="إغلاق لوحة المكلفين (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6 flex-1">

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">المؤسسات الموثقة رسميًا</span>
            <span className="text-2xl font-bold font-mono text-emerald-800">{totalVerified}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">مطابقة 100% مع data.gov.ma</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">سجلات قيد المراجعة</span>
            <span className="text-2xl font-bold font-mono text-amber-700">{totalNeedsReview}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">تتطلب تحديثاً أو إعادة تدقيق</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">بلاغات الطلبة المعلقة</span>
            <span className="text-2xl font-bold font-mono text-[#B43425]">{pendingReportsCount}</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">تنتظر فحص روابط الإثبات</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 block mb-1">نزاهة المصادر (Domain Trust)</span>
            <span className="text-2xl font-bold font-mono text-[#143D30]">100%</span>
            <span className="text-[11px] text-stone-400 block mt-0.5">نطاقات حكومية وجامعية معتمدة</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-[#143D30] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>طابور فحص البلاغات ({pendingReportsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'feedbacks'
                ? 'bg-[#143D30] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>تدقيق تقييمات الطلبة ({pendingFeedbacksCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'institutions'
                ? 'bg-[#143D30] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>إدارة وتدقيق المؤسسات ({institutions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-[#143D30] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>سجل عمليات التدقيق (Audit Trail)</span>
          </button>
        </div>

        {/* Tab 1: Queue Moderation */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  طلبات تدقيق وتصحيح المعلومات الواردة من عموم المستخدمين
                </h3>
                <p className="text-xs text-stone-500">
                  لا يُقبل أي تعديل إلا بعد فتح رابط الإثبات والتأكد من صدوره عن نطاق رسمي (.ac.ma / .gov.ma).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportReportsCSV}
                  className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold transition-colors border border-stone-300 flex items-center gap-1.5 shadow-2xs"
                  title="تصدير البلاغات إلى ملف CSV"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>تصدير CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportReportsPDF}
                  className="px-3 py-1.5 bg-[#143D30] hover:bg-[#0e2c23] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="تصدير وطباعة تقرير PDF للبلاغات"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>تصدير وطباعة PDF</span>
                </button>
                <span className="font-mono text-xs font-semibold px-2.5 py-1.5 rounded bg-amber-100 text-amber-800">
                  {pendingReportsCount} في الانتظار
                </span>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center text-stone-400 text-sm">
                لا توجد بلاغات حالية. قاعدة البيانات مستقرة ومحققة بالكامل.
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {reports.map((report) => (
                  <div key={report.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-200 font-bold text-stone-800">
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
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {report.status === 'pending'
                            ? 'قيد الفحص والمطابقة'
                            : report.status === 'approved'
                            ? 'تم الاعتماد والتحديث'
                            : 'مرفوض'}
                        </span>
                      </div>

                      <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                        <div>
                          <span className="text-stone-500 font-medium">الحقل المعني: </span>
                          <span className="font-semibold">{report.field_name}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 font-medium">القيمة المقترحة: </span>
                          <span className="font-semibold text-emerald-800 font-mono">{report.proposed_correction}</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-600 flex items-center gap-2 flex-wrap">
                        <span className="text-stone-500 font-medium">رابط الإثبات المقدم: </span>
                        <a
                          href={report.source_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#143D30] hover:underline font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200"
                        >
                          <span>{report.source_proof_url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>

                      {report.user_notes && (
                        <p className="text-xs text-stone-500 bg-[#FAF7F0] p-2 rounded border border-[#E7E2D6] italic">
                          ملاحظة الطالب: « {report.user_notes} »
                        </p>
                      )}
                    </div>

                    {/* Actions for moderator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {report.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleProcessReport(report, 'approved')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>اعتماد التعديل</span>
                          </button>
                          <button
                            onClick={() => handleProcessReport(report, 'rejected')}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors border border-stone-300"
                          >
                            <span>رفض (المصدر غير كافٍ)</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-stone-400 font-medium">
                          تم اتخاذ القرار
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Student Feedbacks Moderation Queue */}
        {activeTab === 'feedbacks' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  طابور مراجعة تقييمات وآراء الطلبة المجهولة (Pre-moderation Queue)
                </h3>
                <p className="text-xs text-stone-500">
                  وفق ميثاق النزاهة وحماية الخصوصية، يتم التدقيق لمنع أي تجريح شخصي أو إشاعات قبل النشر في الواجهة العامة.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800">
                {pendingFeedbacksCount} قيد التدقيق
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="p-12 text-center text-stone-400 text-sm">
                لا توجد تقييمات طلابية مسجلة حالياً.
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF7F0] font-bold text-[#143D30] border border-[#E7E2D6]">
                          {fb.institution_code}
                        </span>
                        <span className="font-bold text-sm text-stone-900">
                          {isAr ? fb.institution_name_ar : fb.institution_name_fr}
                        </span>
                        <span className="text-xs text-emerald-800 font-medium">
                          ({isAr ? fb.service_label_ar : fb.service_label_fr})
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            fb.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : fb.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {fb.status === 'pending'
                            ? 'بانتظار المراجعة'
                            : fb.status === 'approved'
                            ? 'معتمد ومنشور'
                            : 'مرفوض لمخالفة الميثاق'}
                        </span>
                      </div>

                      {/* Stars & Level */}
                      <div className="flex items-center gap-3 text-xs text-stone-600">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                          <span className="ms-1 font-mono font-bold text-stone-800">
                            ({fb.rating}/5)
                          </span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <span>الصفة: {isAr ? fb.student_level_ar : fb.student_level_fr}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-stone-400">{fb.created_at}</span>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs sm:text-sm text-stone-800 bg-[#FAF8F5] p-3 rounded-lg border border-stone-200 leading-relaxed">
                        « {isAr ? fb.comment_ar : fb.comment_fr} »
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {fb.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleProcessFeedback(fb.id, 'approved')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>اعتماد ونشر التقييم</span>
                          </button>
                          <button
                            onClick={() => handleProcessFeedback(fb.id, 'rejected')}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors border border-red-200"
                          >
                            <span>رفض (مخالف للميثاق)</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400 font-medium">
                            {fb.status === 'approved' ? 'منشور في المنصة' : 'محجوب عن النشر'}
                          </span>
                          <button
                            onClick={() => handleProcessFeedback(fb.id, fb.status === 'approved' ? 'rejected' : 'approved')}
                            className="text-xs text-stone-500 hover:text-stone-800 underline"
                          >
                            تغيير القرار
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Institution Data Steward */}
        {activeTab === 'institutions' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-sm text-stone-900">
                قائمة المؤسسات وتدقيق حالات التوثيق والبيانات
              </h3>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute inset-y-0 start-2.5 my-auto text-stone-400" />
                  <input
                    type="text"
                    placeholder="ابحث في المؤسسات..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full ps-8 pe-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="verified">موثق فقط</option>
                  <option value="needs_review">يحتاج مراجعة</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-stone-800 text-start">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3 text-start">الرمز</th>
                    <th className="p-3 text-start">المؤسسة</th>
                    <th className="p-3 text-start">الجامعة الأم</th>
                    <th className="p-3 text-start">حالة التوثيق</th>
                    <th className="p-3 text-start">الهاتف الرسمي</th>
                    <th className="p-3 text-start">تاريخ المراجعة</th>
                    <th className="p-3 text-end">إجراء التدقيق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {institutions
                    .filter((inst) => {
                      if (statusFilter !== 'all' && inst.data_status !== statusFilter) return false;
                      if (!searchFilter) return true;
                      return (
                        inst.name_ar.includes(searchFilter) ||
                        inst.name_fr.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        inst.code.includes(searchFilter.toUpperCase())
                      );
                    })
                    .map((inst) => {
                      const isEditing = editingInstId === inst.id;

                      return (
                        <tr key={inst.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3 font-mono font-bold text-[#143D30]">
                            {inst.code}
                          </td>
                          <td className="p-3 font-semibold text-stone-900">
                            {inst.name_ar}
                            <span className="block text-[11px] text-stone-500 font-normal">
                              {inst.city_ar} · {inst.campus_ar}
                            </span>
                          </td>
                          <td className="p-3 text-stone-600">
                            {inst.university_name_ar}
                          </td>
                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editBuffer.data_status}
                                onChange={(e) =>
                                  setEditBuffer({ ...editBuffer, data_status: e.target.value as DataStatus })
                                }
                                className="px-2 py-1 bg-white border border-stone-300 rounded text-xs"
                              >
                                <option value="verified">موثق (verified)</option>
                                <option value="needs_review">قيد التدقيق (needs_review)</option>
                                <option value="demo">تجريبي (demo)</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  inst.data_status === 'verified'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : inst.data_status === 'needs_review'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {inst.data_status === 'verified' ? 'موثق' : inst.data_status === 'needs_review' ? 'يحتاج مراجعة' : 'تجريبي'}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {isEditing ? (
                              <input
                                type="text"
                                dir="ltr"
                                value={editBuffer.phone}
                                onChange={(e) => setEditBuffer({ ...editBuffer, phone: e.target.value })}
                                placeholder="+212 537 77 18 34"
                                className="px-2 py-1 bg-white border border-stone-300 rounded text-xs w-36 font-mono dir-ltr text-left"
                              />
                            ) : (
                              <PhoneDisplay phone={inst.phone} lang="ar" size="sm" showCallButton={false} showCopyButton={true} />
                            )}
                          </td>
                          <td className="p-3 font-mono text-stone-500">
                            {inst.verified_at}
                          </td>
                          <td className="p-3 text-end">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveEdit(inst)}
                                  className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded transition-colors"
                                  title="حفظ التعديلات"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingInstId(null)}
                                  className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition-colors"
                                  title="إلغاء"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(inst)}
                                className="inline-flex items-center gap-1 text-xs text-[#143D30] hover:underline font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل وحفظ</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Audit Trail Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900">
                سجل تتبع القرارات والتعديلات (Immutable Audit Trail)
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 font-mono">
                  {auditLogs.length} عمليات مسجلة
                </span>
                <button
                  type="button"
                  onClick={handleExportAuditLogs}
                  className="px-3 py-1.5 bg-[#143D30] hover:bg-[#0e2c23] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  تصدير سجل التتبع (JSON)
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.status === 'success'
                          ? 'bg-emerald-600'
                          : log.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-stone-900">{log.action}</span>
                      <span className="text-stone-500 block text-[11px] mt-0.5">
                        الهدف: <strong className="text-stone-700">{log.target}</strong> · المنفذ: {log.actor}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-stone-400 shrink-0">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    );

  if (isStandalone) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {portalContent}
      </div>
    );
  }

  return (
    <ModalBackdrop onClose={() => onClosePortal?.()} ariaLabelledBy="moderator-portal-title">
      {portalContent}
    </ModalBackdrop>
  );
};
