import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Award,
  ExternalLink,
  CheckCircle2,
  Info,
  Clock,
  Utensils,
  Home,
  Star,
  MessageSquare,
  Plus,
  ThumbsUp,
  UserCheck,
  X,
  Calendar,
  CalendarPlus,
} from 'lucide-react';
import { Language } from '../types';
import { PhoneDisplay } from './PhoneDisplay';
import { ModalBackdrop } from './ModalBackdrop';
import { getGoogleCalendarUrl, downloadAnnouncementIcs } from '../utils/calendarExport';

import rabatDormImg from '../assets/images/cit_universitaire_rabat_1794088218025.jpg';
import casablancaDormImg from '../assets/images/cit_universitaire_casablanca_1794088217206.jpg';
import marrakechDormImg from '../assets/images/cit_universitaire_marrakech_1794088217364.jpg';
import agadirDormImg from '../assets/images/cit_universitaire_agadir_1794088232165.jpg';
import fesDormImg from '../assets/images/cit_universitaire_fes_1794088232368.jpg';

interface Props {
  lang: Language;
  onBackToHome: () => void;
  onToggleLanguage?: () => void;
  onToast?: (msg: string) => void;
}

export interface DormitoryReview {
  id: string;
  author: string;
  faculty: string;
  rating: number;
  date: string;
  comment_ar: string;
  comment_fr: string;
  likes: number;
}

export interface DormitorySite {
  id: string;
  name_ar: string;
  name_fr: string;
  city_ar: string;
  city_fr: string;
  capacity_beds: number;
  has_canteen: boolean;
  phone: string;
  address_ar: string;
  address_fr: string;
  website_url: string;
  image_url: string;
  rating_overall: number;
  rating_count: number;
  rating_breakdown: {
    security: number;
    canteen: number;
    proximity: number;
  };
  reviews: DormitoryReview[];
}

export const INITIAL_DORMITORIES: DormitorySite[] = [
  {
    id: 'dorm-1',
    name_ar: 'الحي الجامعي السويسي 1 و 2 - الرباط',
    name_fr: 'Cité Universitaire Souissi 1 & 2 - Rabat',
    city_ar: 'الرباط',
    city_fr: 'Rabat',
    capacity_beds: 4500,
    has_canteen: true,
    phone: '+212 537 77 18 34',
    address_ar: 'شارع ألال الفاسي، العرفان، الرباط',
    address_fr: 'Avenue Allal El Fassi, Madinat Al Irfane, Rabat',
    website_url: 'https://www.onousc.ma',
    image_url: rabatDormImg,
    rating_overall: 4.7,
    rating_count: 128,
    rating_breakdown: { security: 4.8, canteen: 4.6, proximity: 4.9 },
    reviews: [
      {
        id: 'rev-1',
        author: 'ياسين بناني (طالب بالطب)',
        faculty: 'كلية الطب والصيدلة بالرباط',
        rating: 5,
        date: '2026-10-15',
        comment_ar: 'حي جامعي ممتاز، قريب جداً من الكليات بالعرفان والمطعم يقدم وجبات متكاملة ومدعمة.',
        comment_fr: 'Superbe cité, très proche des facultés d’Irfane. Le restaurant universitaire est top.',
        likes: 24,
      },
      {
        id: 'rev-2',
        author: 'سارة العلمي (طالبة بالهندسة)',
        faculty: 'المدرسة المحمدية للمهندسين EMI',
        rating: 4,
        date: '2026-09-28',
        comment_ar: 'الأمن والحراسة متوفران طيلة 24 ساعة ومساحات الدراسة الهادئة ممتازة خلال الامتحانات.',
        comment_fr: 'Sécurité 24/7 et espaces d’études calmes idéaux pendant les examens.',
        likes: 18,
      },
    ],
  },
  {
    id: 'dorm-2',
    name_ar: 'الحي الجامعي طريق الجديدة - الدار البيضاء',
    name_fr: 'Cité Universitaire Route d’El Jadida - Casablanca',
    city_ar: 'الدار البيضاء',
    city_fr: 'Casablanca',
    capacity_beds: 3800,
    has_canteen: true,
    phone: '+212 522 23 07 89',
    address_ar: 'طريق الكليات، حي الحسني، الدار البيضاء',
    address_fr: 'Route des Facultés, Hay Hassani, Casablanca',
    website_url: 'https://www.onousc.ma',
    image_url: casablancaDormImg,
    rating_overall: 4.5,
    rating_count: 96,
    rating_breakdown: { security: 4.6, canteen: 4.4, proximity: 4.8 },
    reviews: [
      {
        id: 'rev-3',
        author: 'حمزة الناصري (طالب بالعلوم)',
        faculty: 'كلية العلوم عين الشق',
        rating: 4.5,
        date: '2026-10-02',
        comment_ar: 'الموقع قريب جداً من محطة الترامواي والكليات، والمطعم الجديد ممتاز.',
        comment_fr: 'Accès direct au Tramway et aux facultés de Route El Jadida.',
        likes: 15,
      },
    ],
  },
  {
    id: 'dorm-3',
    name_ar: 'الحي الجامعي السملالية - مراكش',
    name_fr: 'Cité Universitaire Semlalia - Marrakech',
    city_ar: 'مراكش',
    city_fr: 'Marrakech',
    capacity_beds: 3200,
    has_canteen: true,
    phone: '+212 524 43 48 13',
    address_ar: 'شارع عبد الكريم الخطابي، مراكش',
    address_fr: 'Avenue Abdelkrim El Khattabi, Marrakech',
    website_url: 'https://www.onousc.ma',
    image_url: marrakechDormImg,
    rating_overall: 4.6,
    rating_count: 110,
    rating_breakdown: { security: 4.7, canteen: 4.5, proximity: 4.9 },
    reviews: [
      {
        id: 'rev-4',
        author: 'أمينة الشرايبي (طالبة بالحقوق)',
        faculty: 'كلية العلوم القانونية السملالية',
        rating: 5,
        date: '2026-09-12',
        comment_ar: 'المرفق هادئ ومجهز بحدائق واسعة للتعديد والمراجعة الجماعية.',
        comment_fr: 'Grandes zones vertes pour la révision et ambiance conviviale.',
        likes: 21,
      },
    ],
  },
  {
    id: 'dorm-4',
    name_ar: 'الحي الجامعي أكرود - أكادير',
    name_fr: 'Cité Universitaire Agadir',
    city_ar: 'أكادير',
    city_fr: 'Agadir',
    capacity_beds: 2900,
    has_canteen: true,
    phone: '+212 528 22 71 25',
    address_ar: 'حي الداخلة، أكادير',
    address_fr: 'Quartier Dakhla, Agadir',
    website_url: 'https://www.onousc.ma',
    image_url: agadirDormImg,
    rating_overall: 4.8,
    rating_count: 84,
    rating_breakdown: { security: 4.9, canteen: 4.7, proximity: 4.8 },
    reviews: [
      {
        id: 'rev-5',
        author: 'عمر التازي (طالب بالاقتصاد)',
        faculty: 'ENCG Agadir',
        rating: 5,
        date: '2026-10-10',
        comment_ar: 'من أفضل الأحياء الجامعية بالمغرب نظافة وتنظيماً وطاقماً إدارياً خدوماً.',
        comment_fr: 'Propreté exemplaire et personnel très accueillant à Agadir.',
        likes: 30,
      },
    ],
  },
  {
    id: 'dorm-5',
    name_ar: 'الحي الجامعي المظهر - فاس',
    name_fr: 'Cité Universitaire Fès',
    city_ar: 'فاس',
    city_fr: 'Fès',
    capacity_beds: 3600,
    has_canteen: true,
    phone: '+212 535 60 96 60',
    address_ar: 'طريق إيموزار، ظهر المهراز، فاس',
    address_fr: 'Route d’Imouzzer, Dhar El Mehraz, Fès',
    website_url: 'https://www.onousc.ma',
    image_url: fesDormImg,
    rating_overall: 4.6,
    rating_count: 102,
    rating_breakdown: { security: 4.6, canteen: 4.6, proximity: 4.7 },
    reviews: [
      {
        id: 'rev-6',
        author: 'خالد المرابط (طالب بالآداب)',
        faculty: 'كلية الآداب ظهر المهراز',
        rating: 4.5,
        date: '2026-08-20',
        comment_ar: 'مبنى تاريخي أنيق بهندسة معمارية مغربية أصيلة وتجهيزات حديثة.',
        comment_fr: 'Superbe architecture traditionnelle et rénovations récentes.',
        likes: 19,
      },
    ],
  },
];

const DORMITORIES_STORAGE_KEY = 'jami3ati_dormitories_v1';

export const DormitoriesGuidePage: React.FC<Props> = ({ lang, onBackToHome, onToggleLanguage, onToast }) => {
  const isAr = lang === 'ar';

  const [dormitories, setDormitories] = useState<DormitorySite[]>(() => {
    try {
      const saved = localStorage.getItem(DORMITORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_DORMITORIES;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(DORMITORIES_STORAGE_KEY, JSON.stringify(dormitories));
    } catch {
      // ignore storage quota errors
    }
  }, [dormitories]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeReviewDorm, setActiveReviewDorm] = useState<DormitorySite | null>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [targetDormForReview, setTargetDormForReview] = useState<DormitorySite | null>(null);

  // New review form buffer
  const [newAuthor, setNewAuthor] = useState('');
  const [newFaculty, setNewFaculty] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const filteredSites = dormitories.filter((site) => {
    if (selectedCity !== 'all' && site.city_ar !== selectedCity) return false;
    return true;
  });

  const handleOpenAddReview = (dorm: DormitorySite) => {
    setTargetDormForReview(dorm);
    setNewAuthor('');
    setNewFaculty('');
    setNewRating(5);
    setNewComment('');
    setShowAddReviewModal(true);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDormForReview || !newAuthor.trim() || !newComment.trim()) return;

    const newRev: DormitoryReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      faculty: newFaculty.trim() || (isAr ? 'طالب جامعي' : 'Étudiant'),
      rating: newRating,
      date: new Date().toISOString().slice(0, 10),
      comment_ar: newComment.trim(),
      comment_fr: newComment.trim(),
      likes: 1,
    };

    setDormitories((prev) =>
      prev.map((d) => {
        if (d.id === targetDormForReview.id) {
          const updatedReviews = [newRev, ...d.reviews];
          const newCount = d.rating_count + 1;
          const newOverall = parseFloat(
            ((d.rating_overall * d.rating_count + newRating) / newCount).toFixed(1)
          );
          return {
            ...d,
            rating_count: newCount,
            rating_overall: newOverall,
            reviews: updatedReviews,
          };
        }
        return d;
      })
    );

    setShowAddReviewModal(false);
  };

  const handleLikeReview = (dormId: string, reviewId: string) => {
    setDormitories((prev) =>
      prev.map((d) => {
        if (d.id !== dormId) return d;
        const updated = {
          ...d,
          reviews: d.reviews.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r)),
        };
        if (activeReviewDorm?.id === dormId) {
          setActiveReviewDorm(updated);
        }
        return updated;
      })
    );
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex-1 bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-12 space-y-5 sm:space-y-6 flex-1">
        {/* Clean Editorial Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-4 border-b border-stone-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {isAr ? 'السكن والمنحة والأحياء الجامعية' : 'Logement, bourses et cités universitaires'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isAr
                ? 'تعرّف على الأحياء والمطاعم الجامعية التابعة لـ ONOUSC، مواعيد منحتي والإيواء، وتقييمات الطلبة حول السكن والخدمات.'
                : 'Découvrez les cités et restaurants universitaires de l’ONOUSC, les calendriers de bourse Minhaty et les avis des étudiants résidents.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-medium text-stone-500 shrink-0">
            <span className="inline-flex items-center gap-1 text-stone-800 font-semibold">
              <span dir="ltr" className="font-mono font-bold text-[#143D30] tabular-nums">
                +18,000
              </span>
              <span>{isAr ? 'سرير جامعي' : 'lits'}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>ONOUSC &amp; Minhaty</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{isAr ? 'صور وتقييمات موثقة' : 'Photos et avis vérifiés'}</span>
          </div>
        </header>

        {/* Minhaty & Housing Info Strip */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-200">
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[#143D30] shrink-0" />
            <div>
              <span className="font-bold text-stone-900 block">{isAr ? 'طاقة استيعابية معتمدة' : 'Capacité certifiée'}</span>
              <span className="text-[11px] sm:text-xs text-stone-500">{isAr ? 'أكثر من 18,000 سرير مجهز للطلبة' : '+18 000 lits équipés'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-200">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 fill-amber-500" />
            <div>
              <span className="font-bold text-stone-900 block">{isAr ? 'نزاهة التقييمات الطلابية' : 'Avis vérifiés'}</span>
              <span className="text-[11px] sm:text-xs text-stone-500">{isAr ? 'مشاركة الآراء بشفافية وموضوعية' : 'Avis d’étudiants résidents'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-200">
            <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-stone-900 block">{isAr ? 'وجبات مطعم مدعمة' : 'Repas Subventionnés'}</span>
              <span className="text-[11px] sm:text-xs text-stone-500">{isAr ? 'مطاعم جامعية معتمدة بالقرب من السكن' : 'Restaurants universitaires proches'}</span>
            </div>
          </div>
        </div>

        {/* Deadlines & Calendar Sync Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-7 shadow-sm space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-5 h-5 text-[#143D30] shrink-0" />
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                {isAr ? 'مواعيد وإيداع طلبات السكن والمنحة (Calendar Sync)' : 'Calendrier & Synchronisation (Logement & Bourse)'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg shrink-0">
              {isAr ? 'تصدير 1-انقر' : 'Export 1-clic'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'ann-dorm-housing',
                institution_code: 'ONOUSC',
                institution_name_ar: 'المكتب الوطني للأعمال الجامعية الاجتماعية والثقافية',
                institution_name_fr: 'ONOUSC',
                title_ar: 'فتح باب الترشيح للإيواء بالأحياء الجامعية (ONOUSC)',
                title_fr: 'Candidature à l’hébergement des cités universitaires',
                event_date: '2026-07-01',
                deadline_date: '2026-08-15',
                source_url: 'https://www.onousc.ma',
                source_name: 'بوابة ONOUSC',
                verified_at: '2026-11-01',
                data_status: 'verified' as const,
                category: 'bourse' as const,
              },
              {
                id: 'ann-minhaty',
                institution_code: 'MINHATY',
                institution_name_ar: 'وزارة التعليم العالي والبحث العلمي والابتكار',
                institution_name_fr: 'MESRI',
                title_ar: 'آخر أجل لإيداع طلبات الاستفادة من المنحة الجامعية (منحتي)',
                title_fr: 'Dernier délai pour le dépôt des demandes de bourse Minhaty',
                event_date: '2026-06-15',
                deadline_date: '2026-07-31',
                source_url: 'https://www.minhaty.ma',
                source_name: 'بوابة منحتي',
                verified_at: '2026-11-01',
                data_status: 'verified' as const,
                category: 'bourse' as const,
              },
            ].map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#143D30] text-white">
                    {ann.institution_code}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#B43425]">
                    {isAr ? 'آخر أجل:' : 'Délai :'} {ann.deadline_date}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                  {isAr ? ann.title_ar : ann.title_fr}
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/70 text-xs">
                  <a
                    href={getGoogleCalendarUrl(ann, lang, 'deadline')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 min-h-[42px] rounded-xl bg-white hover:bg-[#143D30] text-[#143D30] hover:text-white border border-stone-300 text-xs font-bold transition-colors shadow-2xs"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{isAr ? 'تقويم جوجل' : 'Google Calendar'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      downloadAnnouncementIcs(ann, lang);
                      if (onToast) {
                        onToast(
                          isAr
                            ? 'تم تحميل ملف التقويم (.ics) لـ Apple / iCal بنجاح ✓'
                            : 'Fichier iCal (.ics) téléchargé avec succès ✓'
                        );
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 min-h-[42px] rounded-xl bg-white hover:bg-stone-900 text-stone-700 hover:text-white border border-stone-300 text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{isAr ? 'أبل / iCal (.ics)' : 'Apple iCal (.ics)'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#143D30] shrink-0" />
            <span>{isAr ? 'سجل الأحياء الجامعية المقيمة:' : 'Cités Universitaires Homologuées :'}</span>
          </h2>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 min-h-[42px] bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#143D30] cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع المدن المغربية' : 'Toutes les villes'}</option>
            <option value="الرباط">{isAr ? 'الرباط' : 'Rabat'}</option>
            <option value="الدار البيضاء">{isAr ? 'الدار البيضاء' : 'Casablanca'}</option>
            <option value="مراكش">{isAr ? 'مراكش' : 'Marrakech'}</option>
            <option value="أكادير">{isAr ? 'أكادير' : 'Agadir'}</option>
            <option value="فاس">{isAr ? 'فاس' : 'Fès'}</option>
          </select>
        </div>

        {/* Dormitory Sites Rich Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 hover:border-[#143D30] transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Gallery Banner */}
                <div className="relative h-40 sm:h-52 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={site.image_url}
                    alt={isAr ? site.name_ar : site.name_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between z-10">
                    <span className="font-mono text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/95 text-stone-900 rounded-lg shadow-xs">
                      {site.capacity_beds} {isAr ? 'سرير' : 'lits'}
                    </span>

                    <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/30">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                      <span>{site.rating_overall.toFixed(1)} / 5</span>
                      <span className="text-[10px] sm:text-[11px] text-stone-300 font-normal">({site.rating_count})</span>
                    </div>
                  </div>

                  {/* Bottom Image Metadata */}
                  <div className="absolute bottom-2.5 inset-x-3 sm:bottom-3 text-white">
                    <h3 className="text-sm sm:text-lg font-extrabold leading-snug drop-shadow-sm">
                      {isAr ? site.name_ar : site.name_fr}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-200 mt-0.5 sm:mt-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
                      <span className="truncate">{isAr ? site.address_ar : site.address_fr}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body & Rating Breakdown */}
                <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
                  {/* Rating Breakdown Bar */}
                  <div className="grid grid-cols-3 gap-2 text-[10.5px] sm:text-[11px] bg-[#FAF7F0] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#EDE8DE] text-center">
                    <div>
                      <span className="text-stone-500 block mb-0.5">{isAr ? 'الأمن والحراسة' : 'Sécurité'}</span>
                      <span className="font-bold text-[#143D30] font-mono">{site.rating_breakdown.security} ★</span>
                    </div>
                    <div className="border-r border-l border-stone-200 px-1">
                      <span className="text-stone-500 block mb-0.5">{isAr ? 'المطعم الجامعي' : 'Canteen'}</span>
                      <span className="font-bold text-[#143D30] font-mono">{site.rating_breakdown.canteen} ★</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block mb-0.5">{isAr ? 'القرب من الكليات' : 'Proximité'}</span>
                      <span className="font-bold text-[#143D30] font-mono">{site.rating_breakdown.proximity} ★</span>
                    </div>
                  </div>

                  {/* Featured Student Review snippet */}
                  {site.reviews.length > 0 && (
                    <div className="bg-stone-50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-stone-200 text-[11px] sm:text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-stone-900 flex items-center gap-1 min-w-0 truncate">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{site.reviews[0].author}</span>
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                          {Array.from({ length: Math.floor(site.reviews[0].rating) }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-600 italic leading-relaxed">
                        « {isAr ? site.reviews[0].comment_ar : site.reviews[0].comment_fr} »
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 sm:p-4 bg-stone-50/80 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <PhoneDisplay phone={site.phone} lang={lang} size="sm" showCallButton={true} />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReviewDorm(site)}
                    className="min-h-[40px] px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded-xl border border-stone-300 transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#143D30]" />
                    <span>{isAr ? `التقييمات (${site.reviews.length})` : `Avis (${site.reviews.length})`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAddReview(site)}
                    className="min-h-[40px] px-3 py-1.5 bg-[#143D30] hover:bg-[#0d2a21] text-white font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isAr ? 'تقييم الحي' : 'Évaluer'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List Modal */}
      {activeReviewDorm && (
        <ModalBackdrop onClose={() => setActiveReviewDorm(null)}>
          <div dir={isAr ? 'rtl' : 'ltr'} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  {isAr ? activeReviewDorm.name_ar : activeReviewDorm.name_fr}
                </h3>
                <span className="text-xs text-stone-500">
                  {isAr ? `تقييمات وآراء الطلبة المقيمين (${activeReviewDorm.reviews.length})` : `Avis des étudiants (${activeReviewDorm.reviews.length})`}
                </span>
              </div>
              <button
                onClick={() => setActiveReviewDorm(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-1">
              {activeReviewDorm.reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 block">{rev.author}</span>
                      <span className="text-[11px] text-stone-500 block">{rev.faculty} · {rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: Math.floor(rev.rating) }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-stone-700 leading-relaxed font-normal">
                    « {isAr ? rev.comment_ar : rev.comment_fr} »
                  </p>

                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLikeReview(activeReviewDorm.id, rev.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-[#143D30] bg-white hover:bg-emerald-50 px-2 py-0.5 rounded-lg border border-stone-200 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3 text-emerald-700" />
                      <span>{rev.likes} {isAr ? 'مفيد' : 'Utile'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const target = activeReviewDorm;
                setActiveReviewDorm(null);
                handleOpenAddReview(target);
              }}
              className="w-full py-2.5 bg-[#143D30] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'إضافة تقييمي لهذا الحي الجامعي' : 'Ajouter un avis'}</span>
            </button>
          </div>
        </ModalBackdrop>
      )}

      {/* Add Review Submission Modal */}
      {showAddReviewModal && targetDormForReview && (
        <ModalBackdrop onClose={() => setShowAddReviewModal(false)}>
          <div dir={isAr ? 'rtl' : 'ltr'} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">
                {isAr ? `تقييم ${targetDormForReview.name_ar}` : `Évaluer ${targetDormForReview.name_fr}`}
              </h3>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {isAr ? 'الاسم والصفة (مثال: أمين - طالب بالطب):' : 'Votre Nom & Faculté :'}
                </label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder={isAr ? 'أمين السبتي' : 'Amine Sebti'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#143D30]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {isAr ? 'المؤسسة أو الكلية المسجل بها:' : 'Établissement / Faculté :'}
                </label>
                <input
                  type="text"
                  value={newFaculty}
                  onChange={(e) => setNewFaculty(e.target.value)}
                  placeholder={isAr ? 'كلية العلوم السملالية' : 'Faculté des Sciences'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#143D30]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {isAr ? 'التقييم الإجمالي (من 5 نجوم):' : 'Note Globale (/5) :'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-[#143D30] font-mono ms-2">{newRating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {isAr ? 'تجربتك وتأطباعك عن الحي والمطاعم:' : 'Votre Avis et Expérience :'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={isAr ? 'اكتب انطباعك عن النظافة، الأمن، وجبات المطعم الجامعي...' : 'Votre avis sur la propreté, sécurité...'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#143D30]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#143D30] hover:bg-[#0e2c23] text-white font-bold text-xs rounded-xl transition-colors shadow-md"
              >
                <span>{isAr ? 'نشر التقييم المعتمد' : 'Publier l’avis'}</span>
              </button>
            </form>
          </div>
        </ModalBackdrop>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 pt-6 pb-20 lg:pb-6 border-t border-stone-800 text-xs text-center">
        <span>
          {isAr
            ? 'جامعتي | دليل الأحياء والصور وتقييمات الطلبة بمرجع المكتب الوطني ONOUSC 2026'
            : 'Jami3ati | Guide des cités universitaires, photos et avis étudiants (ONOUSC 2026)'}
        </span>
      </footer>
    </div>
  );
};
