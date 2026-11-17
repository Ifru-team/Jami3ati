import React, { useMemo, useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Search,
  Send,
  CheckCircle2,
  Building2,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { Language, University } from '../types';

interface Props {
  lang: Language;
  universities: University[];
  onToast?: (msg: string) => void;
}

interface ContactMessage {
  id: string;
  sender: string;
  category: string;
  subject: string;
  details: string;
  referenceUrl?: string;
  createdAt: string;
}

export const SourcesAndContactPage: React.FC<Props> = ({
  lang,
  universities,
  onToast,
}) => {
  const isAr = lang === 'ar';
  const [sourceFilter, setSourceFilter] = useState('');

  // Contact / Suggestion Form state
  const [sender, setSender] = useState('');
  const [category, setCategory] = useState<'suggestion' | 'university_admin' | 'partnership' | 'general'>('suggestion');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const nationalPortals = [
    {
      name_ar: 'البوابة الوطنية للبيانات المفتوحة (data.gov.ma)',
      name_fr: 'Portail National Open Data (data.gov.ma)',
      desc_ar: 'المصدر المرجعي الأول لقوائم مؤسسات التعليم العالي العمومية ومعطياتها الأساسية.',
      desc_fr: 'Source de référence principale pour le répertoire des établissements publics.',
      url: 'https://data.gov.ma/data/dataset/etablissements-enseignement-superieur',
      tag: 'Open Data',
    },
    {
      name_ar: 'وزارة التعليم العالي والبحث العلمي والابتكار',
      name_fr: 'Ministère de l’Enseignement Supérieur (MESRSI)',
      desc_ar: 'المذكرات الوزارية المنظمة للولوج، دفتر الضوابط البيداغوجية، والاعتراف بالشهادات.',
      desc_fr: 'Notes ministérielles d’accès, cahiers des normes pédagogiques et accréditations.',
      url: 'https://www.enssup.gov.ma',
      tag: 'enssup.gov.ma',
    },
    {
      name_ar: 'المكتب الوطني للأعمال الجامعية (ONOUSC)',
      name_fr: 'Office National des Œuvres Universitaires (ONOUSC)',
      desc_ar: 'إحصائيات الأحياء الجامعية، طاقة الإيواء، وشروط التسجيل في السكن والإطعام الجامعي.',
      desc_fr: 'Données officielles des cités universitaires, restauration et critères d’hébergement.',
      url: 'https://www.onousc.ma',
      tag: 'onousc.ma',
    },
    {
      name_ar: 'البوابة الوطنية للمنح الدراسية (منحتي)',
      name_fr: 'Portail National des Bourses (Minhaty)',
      desc_ar: 'مواعيد إيداع طلبات المنحة الجامعية ومساطر التتبع السنوية.',
      desc_fr: 'Calendrier annuel et procédures officielles de demande de bourse universitaire.',
      url: 'https://www.minhaty.ma',
      tag: 'minhaty.ma',
    },
  ];

  const filteredUniversities = useMemo(() => {
    const q = sourceFilter.trim().toLowerCase();
    if (!q) return universities;
    return universities.filter(
      (u) =>
        u.name_ar.toLowerCase().includes(q) ||
        u.name_fr.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.city_ar.toLowerCase().includes(q) ||
        u.city_fr.toLowerCase().includes(q)
    );
  }, [universities, sourceFilter]);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !subject.trim() || !details.trim()) return;

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      sender: sender.trim(),
      category,
      subject: subject.trim(),
      details: details.trim(),
      referenceUrl: referenceUrl.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      const existingRaw = localStorage.getItem('jami3ati_contact_messages_v1');
      const existing = existingRaw ? (JSON.parse(existingRaw) as ContactMessage[]) : [];
      localStorage.setItem('jami3ati_contact_messages_v1', JSON.stringify([newMsg, ...existing]));
    } catch {
      // Ignore storage quota errors
    }

    setSender('');
    setSubject('');
    setDetails('');
    setReferenceUrl('');
    setSubmittedSuccess(true);

    if (onToast) {
      onToast(
        isAr
          ? 'تم استلام رسالتك وحفظها بنجاح للمراجعة!'
          : 'Votre message a bien été enregistré pour examen !'
      );
    }
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-7 sm:space-y-9">
        {/* Clean Editorial Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr ? 'سجل المصادر الرسمية والتواصل' : 'Registre des sources officielles et contact'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'القائمة الكاملة للبوابات الوزارية والجامعية المعتمدة في التحقق من البيانات، مع قناة مباشرة لاقتراح مؤسسات أو تحديثات.'
                : 'Répertoire complet des portails ministériels et universitaires utilisés pour vérifier nos données, accompagné d’un formulaire de contact.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-medium text-stone-500 shrink-0">
            <span className="font-mono font-bold text-[#143D30]">
              {universities.length} {isAr ? 'جامعة' : 'universités'}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{nationalPortals.length} {isAr ? 'بوابات وطنية' : 'portails nationaux'}</span>
          </div>
        </header>

        {/* National & Ministerial Portals */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#143D30] shrink-0" />
            <h2 className="text-base sm:text-xl font-extrabold text-stone-900">
              {isAr ? 'البوابات الحكومية والمؤسساتية المرجعية' : 'Portails institutionnels de référence'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nationalPortals.map((portal) => (
              <a
                key={portal.tag}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-stone-200 hover:border-[#143D30] p-4 sm:p-5 shadow-2xs transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span dir="ltr" className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#143D30] border border-emerald-200">
                      {portal.tag}
                    </span>
                    <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#143D30] shrink-0" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-[#143D30] transition-colors">
                    {isAr ? portal.name_ar : portal.name_fr}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isAr ? portal.desc_ar : portal.desc_fr}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Verified University Portals Directory */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#143D30] shrink-0" />
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                {isAr ? 'مواقع الجامعات العمومية المعتمدة' : 'Sites officiels des universités publiques'}
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                placeholder={isAr ? 'تصفية حسب الجامعة أو المدينة...' : 'Filtrer par université ou ville...'}
                className="w-full ps-9 pe-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#143D30]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredUniversities.map((uni) => (
              <a
                key={uni.id}
                href={uni.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-[#FAF8F5] hover:bg-emerald-50/40 border border-stone-200/80 hover:border-[#143D30]/50 transition-colors flex flex-col justify-between gap-2 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#143D30]">
                      {uni.code}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {isAr ? uni.city_ar : uni.city_fr}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#143D30] leading-snug">
                    {isAr ? uni.name_ar : uni.name_fr}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-stone-500 font-mono truncate max-w-[180px]">
                    <Globe className="w-3 h-3 text-[#143D30] shrink-0" />
                    <span dir="ltr" className="truncate">
                      {uni.website_url.replace(/^https?:\/\//, '')}
                    </span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#143D30] shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contact & Institution Suggestion Form */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="space-y-1 border-b border-stone-100 pb-3.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143D30]">
              <MessageSquare className="w-4 h-4" />
              <span>{isAr ? 'تواصل معنا أو اقترح إضافة' : 'Contact & Suggestions'}</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-stone-900">
              {isAr
                ? 'تواصل إداري أو اقتراح مؤسسة جديدة'
                : 'Contacter l’équipe ou suggérer un établissement'}
            </h2>
            <p className="text-xs text-stone-600">
              {isAr
                ? 'مخصص لطلبات الأندية الطلابية، إدارات المؤسسات الجامعية، أو اقتراح مصادر مفتوحة إضافية.'
                : 'Pour les administrations, associations étudiantes, partenariats Open Data ou suggestions.'}
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isAr
                  ? 'شكراً لتواصلك! تم حفظ مقترحك بنجاح وسيُؤخذ بعين الاعتبار في التحديث القادم.'
                  : 'Merci ! Votre message a été enregistré et sera examiné lors de la prochaine mise à jour.'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmitContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                {isAr ? 'الاسم أو اسم الجهة:' : 'Nom ou organisme :'}
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={isAr ? 'مثال: سلمى العلمي / نادي التوجيه' : 'Ex : Salma Alami / Club orientation'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#143D30]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                {isAr ? 'طبيعة الرسالة:' : 'Type de demande :'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#143D30]"
              >
                <option value="suggestion">{isAr ? 'اقتراح مؤسسة أو تخصص جديد' : 'Suggérer un établissement'}</option>
                <option value="university_admin">{isAr ? 'تحديث بيانات من إدارة جامعية' : 'Mise à jour institutionnelle'}</option>
                <option value="partnership">{isAr ? 'شراكة بيانات مفتوحة / بحث' : 'Partenariat Open Data'}</option>
                <option value="general">{isAr ? 'استفسار أو ملاحظة عامة' : 'Question générale'}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                {isAr ? 'الموضوع:' : 'Objet :'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isAr ? 'عنوان مختصر للرسالة' : 'Objet succinct'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#143D30]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                {isAr ? 'رابط رسمي مرجعي (اختياري):' : 'Lien officiel de référence (optionnel) :'}
              </label>
              <input
                type="url"
                dir="ltr"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://example.ac.ma"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#143D30]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-800 mb-1">
                {isAr ? 'تفاصيل الرسالة:' : 'Détails :'}
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتب تفاصيل المؤسسة المقترحة أو التحديث المطلوب...'
                    : 'Décrivez votre demande ou suggestion...'
                }
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#143D30]"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2.5 rounded-xl bg-[#143D30] hover:bg-[#0e2c23] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{isAr ? 'إرسال الرسالة' : 'Envoyer le message'}</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};
