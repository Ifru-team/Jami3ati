import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { DEFAULT_CAMPUS_IMAGE } from './utils/imageAssets';
import {
  initialUniversities,
  initialInstitutions,
  initialAnnouncements,
  initialReports,
  initialStudentFeedbacks,
  DISCIPLINE_OPTIONS,
} from './data/seedData';
import {
  University,
  Institution,
  OfficialAnnouncement,
  InaccuracyReport,
  StudentFeedback,
  Language,
  DisciplineKey,
} from './types';
import { translations } from './data/translations';
import { UniversityCard } from './components/UniversityCard';
import { InstitutionCard } from './components/InstitutionCard';
import { DetailModal } from './components/DetailModal';
import { ReportModal } from './components/ReportModal';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { shareItem } from './utils/shareUtils';
import { AnalyticsModal } from './components/AnalyticsModal';
import { InteractiveMap } from './components/InteractiveMap';
import { ModeratorPortal } from './components/ModeratorPortal';
import { ModeratorLoginModal, type ModeratorUser } from './components/ModeratorLoginModal';
import { FilterPanel } from './components/FilterPanel';
import { SearchBar } from './components/SearchBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HelpCenterModal } from './components/HelpCenterModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useEscapeKey } from './hooks/useEscapeKey';
import { CompareModal, ComparableItem } from './components/CompareModal';
import { CompareTray } from './components/CompareTray';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useBookmarks } from './hooks/useBookmarks';
import {
  importDataGovMaData,
  loadInitialDataGovDataset,
} from './utils/dataImport';

const LoginPage = lazy(() =>
  import('./components/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const ProgramsDirectoryPage = lazy(() =>
  import('./components/ProgramsDirectoryPage').then((m) => ({
    default: m.ProgramsDirectoryPage,
  }))
);
const DormitoriesGuidePage = lazy(() =>
  import('./components/DormitoriesGuidePage').then((m) => ({
    default: m.DormitoriesGuidePage,
  }))
);
const OpenDataExportPage = lazy(() =>
  import('./components/OpenDataExportPage').then((m) => ({
    default: m.OpenDataExportPage,
  }))
);
const AboutUsPage = lazy(() =>
  import('./components/AboutUsPage').then((m) => ({ default: m.AboutUsPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./components/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  }))
);
const TermsAndGuidePage = lazy(() =>
  import('./components/TermsAndGuidePage').then((m) => ({
    default: m.TermsAndGuidePage,
  }))
);
const SourcesAndContactPage = lazy(() =>
  import('./components/SourcesAndContactPage').then((m) => ({
    default: m.SourcesAndContactPage,
  }))
);
import {
  Search,
  Building2,
  GraduationCap,
  ShieldAlert,
  Globe,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Map,
  ShieldCheck,
  Menu,
  Bookmark,
  RefreshCw,
  Database,
  BarChart3,
  BookOpen,
  Home,
  ChevronDown,
  Lock,
  FileText,
  Compass,
} from 'lucide-react';

type AppRoute =
  | 'home'
  | 'about'
  | 'login'
  | 'programs'
  | 'dormitories'
  | 'export'
  | 'privacy'
  | 'guide'
  | 'sources'
  | 'moderator';
const VALID_ROUTES: AppRoute[] = [
  'home',
  'about',
  'login',
  'programs',
  'dormitories',
  'export',
  'privacy',
  'guide',
  'sources',
  'moderator',
];

const getRouteFromHash = (): AppRoute => {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0] as AppRoute;
  return VALID_ROUTES.includes(raw) ? raw : 'home';
};

const loadSavedJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const mergeWithOverrides = <T extends { id: string }>(base: T[], overrides: T[]): T[] => {
  if (!overrides || overrides.length === 0) return base;
  const overrideMap = new globalThis.Map<string, T>(overrides.map((item) => [item.id, item]));
  const merged = base.map((item) => overrideMap.get(item.id) || item);
  const baseIds = new globalThis.Set<string>(base.map((item) => item.id));
  const newItems = overrides.filter((item) => !baseIds.has(item.id));
  return [...newItems, ...merged];
};

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [universities, setUniversities] = useState<University[]>(() =>
    mergeWithOverrides(initialUniversities, loadSavedJson<University[]>('jami3ati_custom_universities_v1', []))
  );
  const [institutions, setInstitutions] = useState<Institution[]>(() =>
    mergeWithOverrides(initialInstitutions, loadSavedJson<Institution[]>('jami3ati_custom_institutions_v1', []))
  );
  const [isLoadingDataGov, setIsLoadingDataGov] = useState<boolean>(false);
  const [announcements] = useState(initialAnnouncements);
  const [reports, setReports] = useState<InaccuracyReport[]>(() =>
    loadSavedJson<InaccuracyReport[]>('jami3ati_reports_v1', initialReports)
  );
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>(() =>
    loadSavedJson<StudentFeedback[]>('jami3ati_feedbacks_v1', initialStudentFeedbacks)
  );

  // View state: 'all' | 'universities' | 'institutions'
  const [viewFilter, setViewFilter] = useState<'all' | 'universities' | 'institutions'>('all');

  // Admission type filter: 'all' | 'regulated' | 'open'
  const [admissionFilter, setAdmissionFilter] = useState<'all' | 'regulated' | 'open'>('all');

  // Sort option for directory
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'city' | 'admission'>('default');

  // Active Dedicated Route state synchronized with window.location.hash
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromHash);
  const [isScrolled, setIsScrolled] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    setMoreMenuOpen(false);
    const targetHash = route === 'home' ? '#/' : `#/${route}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [moreMenuOpen]);

  // Persist reports & student feedbacks across reloads
  useEffect(() => {
    try {
      localStorage.setItem('jami3ati_reports_v1', JSON.stringify(reports));
    } catch {
      // Ignore storage quota errors
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('jami3ati_feedbacks_v1', JSON.stringify(feedbacks));
    } catch {
      // Ignore storage quota errors
    }
  }, [feedbacks]);

  // Only Bookmarks filter toggle
  const [onlyBookmarksFilter, setOnlyBookmarksFilter] = useState<boolean>(false);

  // Interactive map visibility toggle
  const [showMap, setShowMap] = useState(true);

  // Moderator portal & auth state
  const [showModeratorPortal, setShowModeratorPortal] = useState(false);
  const [showModeratorLoginModal, setShowModeratorLoginModal] = useState(false);
  // Moderator sessions must never be restored from browser storage.
  // Access remains disabled until a server-verified identity provider exists.
  const [currentModeratorUser, setCurrentModeratorUser] = useState<ModeratorUser | null>(null);

  const handleOpenModeratorPortal = () => {
    setMoreMenuOpen(false);
    navigateTo('moderator');
  };

  const handleModeratorLoginSuccess = (_user: ModeratorUser, _rememberMe: boolean = false) => {
    // Intentionally fail closed: a client-provided object is not authentication.
    setCurrentModeratorUser(null);
    setShowModeratorLoginModal(false);
    navigateTo('moderator');
    showToast(isAr
      ? 'المصادقة الآمنة غير مهيأة بعد؛ لم يتم منح صلاحية الدخول.'
      : 'Secure authentication is not configured; access was not granted.');
  };

  const handleModeratorSignOut = () => {
    setCurrentModeratorUser(null);
    navigateTo('moderator');
  };

  // Help Center modal toggle
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  // Analytics modal toggle
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Mobile/Tablet navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search and filter parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineKey | 'all'>('all');

  // Bookmarks hook (persisted in localStorage)
  const { bookmarkedIds, isBookmarked, toggleBookmark, clearBookmarks, bookmarksCount } = useBookmarks();

  // Recent searches hook (persisted in localStorage)
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  // Compare feature state
  const [comparedItems, setComparedItems] = useState<ComparableItem[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<{
    item: University | Institution;
    type: 'university' | 'institution';
  } | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetItem, setReportTargetItem] = useState<University | Institution | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';

  // Toggle item in comparison list (max 3 items)
  const handleToggleCompare = (item: University | Institution, type: 'university' | 'institution') => {
    setComparedItems((prev) => {
      const exists = prev.some((c) => c.item.id === item.id);
      if (exists) {
        showToast(isAr ? `تمت إزالة (${item.code}) من المقارنة` : `(${item.code}) retiré du comparatif`);
        return prev.filter((c) => c.item.id !== item.id);
      }
      if (prev.length >= 3) {
        showToast(
          isAr
            ? 'يمكنك مقارنة حتى 3 مؤسسات في نفس الوقت فقط.'
            : 'Vous pouvez comparer jusqu’à 3 établissements au maximum.'
        );
        return prev;
      }
      showToast(isAr ? `تمت إضافة (${item.code}) إلى المقارنة` : `(${item.code}) ajouté au comparatif`);
      return [...prev, { item, type }];
    });
  };

  const handleRemoveCompareItem = (id: string) => {
    setComparedItems((prev) => prev.filter((c) => c.item.id !== id));
  };

  const handleClearCompare = () => {
    setComparedItems([]);
    setCompareModalOpen(false);
  };

  // Automatically load verified dataset from data.gov.ma on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDataset() {
      try {
        setIsLoadingDataGov(true);
        const result = await loadInitialDataGovDataset();
        if (isMounted) {
          if (result.universities && result.universities.length > 0) {
            const customUnivs = loadSavedJson<University[]>('jami3ati_custom_universities_v1', []);
            setUniversities(mergeWithOverrides(result.universities, customUnivs));
          }
          if (result.institutions && result.institutions.length > 0) {
            const customInsts = loadSavedJson<Institution[]>('jami3ati_custom_institutions_v1', []);
            setInstitutions(mergeWithOverrides(result.institutions, customInsts));
          }
        }
      } catch (err) {
        console.error('Error loading initial data.gov.ma dataset:', err);
      } finally {
        if (isMounted) {
          setIsLoadingDataGov(false);
        }
      }
    }
    loadDataset();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler to fetch and sync fresh data from data.gov.ma
  const handleSyncDataGov = async () => {
    try {
      setIsLoadingDataGov(true);
      showToast(
        isAr
          ? 'جاري الاتصال ببوابة data.gov.ma وتحديث مصفوفة البيانات المفتوحة...'
          : 'Connexion à data.gov.ma et actualisation du jeu de données...'
      );
      const result = await importDataGovMaData();
      if (result.universities && result.universities.length > 0) {
        const customUnivs = loadSavedJson<University[]>('jami3ati_custom_universities_v1', []);
        setUniversities(mergeWithOverrides(result.universities, customUnivs));
      }
      if (result.institutions && result.institutions.length > 0) {
        const customInsts = loadSavedJson<Institution[]>('jami3ati_custom_institutions_v1', []);
        setInstitutions(mergeWithOverrides(result.institutions, customInsts));
      }
      showToast(
        isAr
          ? `تم بنجاح استيراد وتحديث ${result.totalRecords} سجلاً من السجل الوطني data.gov.ma`
          : `${result.totalRecords} établissements actualisés depuis data.gov.ma`
      );
    } catch (err) {
      console.error('Error syncing from data.gov.ma:', err);
      showToast(
        isAr
          ? 'تعذر التحديث المباشر من البوابة، تم الحفاظ على السجل الموثق المعتمد'
          : 'Échec de synchronisation directe, version certifiée conservée'
      );
    } finally {
      setIsLoadingDataGov(false);
    }
  };

  // Check if any modal dialog is currently active
  const isAnyModalActive = Boolean(
    selectedItem || reportModalOpen || showModeratorPortal || showModeratorLoginModal || compareModalOpen || showHelpCenter || showAnalyticsModal
  );

  // Prevent background scrolling on document.body whenever any modal is active
  useEffect(() => {
    if (isAnyModalActive) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isAnyModalActive]);

  // Global Escape key listener that closes whichever modal is open
  useEscapeKey(() => {
    if (selectedItem) {
      setSelectedItem(null);
    } else if (reportModalOpen) {
      setReportModalOpen(false);
    } else if (showModeratorLoginModal) {
      setShowModeratorLoginModal(false);
    } else if (showModeratorPortal) {
      setShowModeratorPortal(false);
    } else if (compareModalOpen) {
      setCompareModalOpen(false);
    } else if (showHelpCenter) {
      setShowHelpCenter(false);
    } else if (showAnalyticsModal) {
      setShowAnalyticsModal(false);
    }
  }, isAnyModalActive);

  // Deep linking: check URL search params for ?item=ID or ?compare=id1,id2 on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compareParam = params.get('compare');
    if (compareParam) {
      const ids = compareParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      const resolved: ComparableItem[] = [];
      ids.forEach((id) => {
        const foundUniv = universities.find(
          (u) => u.id === id || u.code.toLowerCase() === id.toLowerCase()
        );
        if (foundUniv) {
          resolved.push({ item: foundUniv, type: 'university' });
          return;
        }
        const foundInst = institutions.find(
          (i) => i.id === id || i.code.toLowerCase() === id.toLowerCase()
        );
        if (foundInst) {
          resolved.push({ item: foundInst, type: 'institution' });
        }
      });
      if (resolved.length > 0) {
        setComparedItems(resolved);
        setCompareModalOpen(true);
        return;
      }
    }

    const itemId = params.get('item');
    if (itemId) {
      const foundUniv = universities.find((u) => u.id === itemId || u.code.toLowerCase() === itemId.toLowerCase());
      if (foundUniv) {
        setSelectedItem({ item: foundUniv, type: 'university' });
        return;
      }
      const foundInst = institutions.find((i) => i.id === itemId || i.code.toLowerCase() === itemId.toLowerCase());
      if (foundInst) {
        setSelectedItem({ item: foundInst, type: 'institution' });
      }
    }
  }, [universities, institutions]);

  // Synchronize document title and direction when language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.title = isAr
      ? 'جامعتي | Jami3ati — دليل الجامعات والمؤسسات بالمغرب'
      : 'Jami3ati | Guide des universités et établissements au Maroc';
  }, [lang, isAr]);

  // Language toggle handler
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  // Open report modal for a specific item
  const handleOpenReport = (item?: University | Institution) => {
    setReportTargetItem(item || null);
    setReportModalOpen(true);
    setMobileMenuOpen(false);
  };

  // Submit report handler (local)
  const handleAddReport = (newReportData: Omit<InaccuracyReport, 'id' | 'created_at' | 'status'>) => {
    const newReport: InaccuracyReport = {
      ...newReportData,
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString(),
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  // Update report status in admin / moderator portal
  const handleUpdateReportStatus = (reportId: string, newStatus: InaccuracyReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
  };

  // Submit student feedback handler (pre-moderation, local)
  const handleAddFeedback = (newFb: Omit<StudentFeedback, 'id' | 'created_at' | 'status' | 'moderated_at'>) => {
    const newEntry: StudentFeedback = {
      ...newFb,
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setFeedbacks((prev) => [newEntry, ...prev]);
  };

  // Update student feedback status from moderator portal
  const handleUpdateFeedbackStatus = (feedbackId: string, newStatus: 'approved' | 'rejected') => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === feedbackId
          ? { ...f, status: newStatus, moderated_at: new Date().toISOString().split('T')[0] }
          : f
      )
    );
  };

  // Update institution from moderator portal (persisted locally)
  const handleUpdateInstitution = (updated: Institution) => {
    setInstitutions((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
    try {
      const existing = loadSavedJson<Institution[]>('jami3ati_custom_institutions_v1', []);
      localStorage.setItem('jami3ati_custom_institutions_v1', JSON.stringify([updated, ...existing.filter((i) => i.id !== updated.id)]));
    } catch {
      // Ignore storage errors
    }
  };

  // Update university from moderator portal (persisted locally)
  const handleUpdateUniversity = (updated: University) => {
    setUniversities((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
    try {
      const existing = loadSavedJson<University[]>('jami3ati_custom_universities_v1', []);
      localStorage.setItem('jami3ati_custom_universities_v1', JSON.stringify([updated, ...existing.filter((u) => u.id !== updated.id)]));
    } catch {
      // Ignore storage errors
    }
  };

  // Listen for '/' key to quickly focus the main search input (Desktop shortcut)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        const input = document.getElementById('main-search-input') as HTMLInputElement | null;
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered & sorted universities
  const filteredUniversities = useMemo(() => {
    const filtered = universities.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        u.name_ar.toLowerCase().includes(q) ||
        u.name_fr.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.city_ar.toLowerCase().includes(q) ||
        u.city_fr.toLowerCase().includes(q);

      const matchCity =
        selectedCity === 'all' ||
        u.city_ar === selectedCity ||
        u.city_fr === selectedCity;

      const matchStatus =
        selectedStatus === 'all' || u.data_status === selectedStatus;

      // If a specific discipline is active, show universities that host institutions with this discipline
      const matchDiscipline =
        selectedDiscipline === 'all' ||
        institutions.some(
          (inst) => inst.university_id === u.id && inst.disciplines?.includes(selectedDiscipline)
        );

      const matchAdmission =
        admissionFilter === 'all' ||
        institutions.some(
          (inst) => inst.university_id === u.id && inst.admission_type === admissionFilter
        );

      const matchBookmark = !onlyBookmarksFilter || isBookmarked(u.id);

      const matchType = selectedType === 'all';

      return matchQuery && matchCity && matchStatus && matchType && matchDiscipline && matchAdmission && matchBookmark;
    });

    if (sortBy === 'name') {
      return [...filtered].sort((a, b) =>
        (isAr ? a.name_ar : a.name_fr).localeCompare(isAr ? b.name_ar : b.name_fr)
      );
    }
    if (sortBy === 'city') {
      return [...filtered].sort((a, b) =>
        (isAr ? a.city_ar : a.city_fr).localeCompare(isAr ? b.city_ar : b.city_fr)
      );
    }
    return filtered;
  }, [universities, institutions, searchQuery, selectedCity, selectedStatus, selectedType, selectedDiscipline, admissionFilter, onlyBookmarksFilter, isBookmarked, sortBy, isAr]);

  // Filtered & sorted institutions
  const filteredInstitutions = useMemo(() => {
    const filtered = institutions.filter((inst) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        inst.name_ar.toLowerCase().includes(q) ||
        inst.name_fr.toLowerCase().includes(q) ||
        inst.code.toLowerCase().includes(q) ||
        inst.university_name_ar.toLowerCase().includes(q) ||
        inst.university_name_fr.toLowerCase().includes(q) ||
        inst.city_ar.toLowerCase().includes(q) ||
        inst.city_fr.toLowerCase().includes(q) ||
        inst.programs_summary_ar.some((p) => p.toLowerCase().includes(q)) ||
        inst.programs_summary_fr.some((p) => p.toLowerCase().includes(q));

      const matchCity =
        selectedCity === 'all' ||
        inst.city_ar === selectedCity ||
        inst.city_fr === selectedCity;

      const matchStatus =
        selectedStatus === 'all' || inst.data_status === selectedStatus;

      const matchType =
        selectedType === 'all' || inst.type === selectedType;

      const matchDiscipline =
        selectedDiscipline === 'all' ||
        Boolean(inst.disciplines?.includes(selectedDiscipline));

      const matchAdmission =
        admissionFilter === 'all' || inst.admission_type === admissionFilter;

      const matchBookmark = !onlyBookmarksFilter || isBookmarked(inst.id);

      return matchQuery && matchCity && matchStatus && matchType && matchDiscipline && matchAdmission && matchBookmark;
    });

    if (sortBy === 'name') {
      return [...filtered].sort((a, b) =>
        (isAr ? a.name_ar : a.name_fr).localeCompare(isAr ? b.name_ar : b.name_fr)
      );
    }
    if (sortBy === 'city') {
      return [...filtered].sort((a, b) =>
        (isAr ? a.city_ar : a.city_fr).localeCompare(isAr ? b.city_ar : b.city_fr)
      );
    }
    if (sortBy === 'admission') {
      return [...filtered].sort((a, b) => {
        const aVal = a.admission_type === 'regulated' ? 0 : 1;
        const bVal = b.admission_type === 'regulated' ? 0 : 1;
        return aVal - bVal;
      });
    }
    return filtered;
  }, [institutions, searchQuery, selectedCity, selectedStatus, selectedType, selectedDiscipline, admissionFilter, onlyBookmarksFilter, isBookmarked, sortBy, isAr]);

  // Discipline counts for active dataset
  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DISCIPLINE_OPTIONS.forEach((disc) => {
      counts[disc.key] = institutions.filter((inst) =>
        inst.disciplines?.includes(disc.key)
      ).length;
    });
    return counts;
  }, [institutions]);

  const totalResultsCount =
    (viewFilter === 'all' || viewFilter === 'universities' ? filteredUniversities.length : 0) +
    (viewFilter === 'all' || viewFilter === 'institutions' ? filteredInstitutions.length : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSelectedDiscipline('all');
    setViewFilter('all');
    setAdmissionFilter('all');
    setOnlyBookmarksFilter(false);
    setSortBy('default');
  };

  const toastBanner = toastMessage ? (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  ) : null;

  const routeLoadingFallback = (
    <div className="flex-1 min-h-[50vh] bg-[#FAF8F5] flex items-center justify-center p-8 text-sm font-semibold text-[#143D30]">
      {isAr ? 'جاري تحميل الصفحة...' : 'Chargement...'}
    </div>
  );

  const sharedOverlays = (
    <>
      <NavigationDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        lang={lang}
        onToggleLanguage={toggleLanguage}
        bookmarksCount={bookmarksCount}
        comparedCount={comparedItems.length}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenHelpCenter={() => setShowHelpCenter(true)}
        onOpenModerator={handleOpenModeratorPortal}
        onOpenReport={() => handleOpenReport()}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToAbout={() => navigateTo('about')}
        onNavigateToPrograms={() => navigateTo('programs')}
        onNavigateToDormitories={() => navigateTo('dormitories')}
        onNavigateToExport={() => navigateTo('export')}
        onNavigateToGuide={() => navigateTo('guide')}
        onNavigateToSources={() => navigateTo('sources')}
        onNavigateToPrivacy={() => navigateTo('privacy')}
        onFilterBookmarks={() => {
          setOnlyBookmarksFilter(true);
          if (currentRoute !== 'home') {
            navigateTo('home');
          }
          setTimeout(() => {
            document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }}
      />

      <HelpCenterModal
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
        lang={lang}
      />

      <AnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        universities={universities}
        institutions={institutions}
        lang={lang}
      />

      {selectedItem && (
        <DetailModal
          item={selectedItem.item}
          itemType={selectedItem.type}
          lang={lang}
          announcements={announcements}
          onClose={() => setSelectedItem(null)}
          onReport={(item) => handleOpenReport(item)}
          isCompared={comparedItems.some((c) => c.item.id === selectedItem.item.id)}
          onToggleCompare={(item) => handleToggleCompare(item, selectedItem.type)}
          isBookmarked={isBookmarked(selectedItem.item.id)}
          onToggleBookmark={(item) => {
            toggleBookmark(item.id);
            showToast(
              isBookmarked(item.id)
                ? isAr ? 'تمت الإزالة من المفضلة' : 'Retiré des favoris'
                : isAr ? 'تم الحفظ في المفضلة ⭐' : 'Ajouté aux favoris ⭐'
            );
          }}
          onToast={showToast}
        />
      )}

      <ReportModal
        isOpen={reportModalOpen}
        targetItem={reportTargetItem}
        lang={lang}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleAddReport}
      />

      <CompareTray
        items={comparedItems}
        lang={lang}
        onOpenCompare={() => setCompareModalOpen(true)}
        onRemoveItem={handleRemoveCompareItem}
        onClearAll={handleClearCompare}
      />

      {compareModalOpen && (
        <CompareModal
          items={comparedItems}
          lang={lang}
          onClose={() => setCompareModalOpen(false)}
          onRemoveItem={handleRemoveCompareItem}
          onClearAll={handleClearCompare}
          onCopyComparison={() =>
            showToast(isAr ? 'تم نسخ رابط المقارنة بنجاح!' : 'Lien du comparatif copié !')
          }
        />
      )}

      <BottomNavBar
        lang={lang}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenDirectory={() => {
          if (currentRoute !== 'home') {
            navigateTo('home');
          }
          setTimeout(() => {
            const el = document.getElementById('directory');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }}
        onOpenDrawer={() => setMobileMenuOpen(true)}
        bookmarksCount={bookmarksCount}
      />

      <ModeratorLoginModal
        isOpen={showModeratorLoginModal}
        onClose={() => setShowModeratorLoginModal(false)}
        onLoginSuccess={handleModeratorLoginSuccess}
        lang={lang}
      />

      {toastBanner}
    </>
  );

  const getDesktopNavClass = (active: boolean) =>
    `px-2.5 xl:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none ${
      active
        ? 'bg-[#143D30]/10 text-[#143D30] font-bold'
        : 'text-stone-700 hover:bg-stone-100 hover:text-[#143D30]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] w-full max-w-full overflow-x-clip">
      {/* Disclaimer Top Banner */}
      <div className="bg-[#143D30] text-emerald-100 text-[11px] sm:text-xs py-1 sm:py-2 px-3 sm:px-4 text-center border-b border-[#0f2e24]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 min-w-0">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
          <span className="font-normal truncate sm:whitespace-normal">{t.disclaimer_banner}</span>
        </div>
      </div>

      {/* Unified Site Header Across All Pages */}
      <header className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-stone-200'
          : 'bg-white/80 backdrop-blur-sm border-stone-200/60 shadow-xs'
      }`}>
        <div className="max-w-6xl mx-auto px-1.5 min-[375px]:px-2 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-1 sm:gap-4 xl:gap-8 w-full">
          {/* Zone 1: Logo & Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-sm min-[375px]:text-[15px] sm:text-lg font-bold tracking-tight text-[#143D30] whitespace-nowrap shrink-0 flex items-center gap-1 min-[375px]:gap-1.5 sm:gap-2 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none rounded-lg p-0.5 sm:p-1"
            aria-label={isAr ? 'العودة إلى الصفحة الرئيسية — جامعتي' : 'Retour à l’accueil — Jami3ati'}
          >
            <div className="w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#143D30]/5 ring-1 ring-[#143D30]/10 p-1 transition-transform duration-200 hover:scale-[1.03]">
              <img
                src="/assets/aistudio/jami3ati_emblem_transparent.png"
                alt={isAr ? 'شعار جامعتي' : 'Logo Jami3ati'}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="flex items-center gap-1.5 font-extrabold text-[#143D30]">
              <span>{isAr ? 'جامعتي' : 'Jami3ati'}</span>
              <span className="hidden xl:inline text-stone-300 font-light">|</span>
              <span className="hidden xl:inline text-stone-500 font-medium text-sm">
                {isAr ? 'Jami3ati' : 'جامعتي'}
              </span>
            </span>
          </button>

          {/* Zone 2: Executive Top Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3 text-xs xl:text-sm font-semibold text-stone-700" aria-label={isAr ? 'القائمة الرئيسية' : 'Menu principal'}>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={getDesktopNavClass(currentRoute === 'home')}
              aria-current={currentRoute === 'home' ? 'page' : undefined}
            >
              <Home className="w-3.5 h-3.5 text-[#143D30]" />
              <span>{isAr ? 'الرئيسية' : 'Accueil'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('programs')}
              className={getDesktopNavClass(currentRoute === 'programs')}
              aria-current={currentRoute === 'programs' ? 'page' : undefined}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#143D30]" />
              <span>{isAr ? 'المسالك والشهادات' : 'Diplômes'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('dormitories')}
              className={getDesktopNavClass(currentRoute === 'dormitories')}
              aria-current={currentRoute === 'dormitories' ? 'page' : undefined}
            >
              <Home className="w-3.5 h-3.5 text-[#143D30]" />
              <span>{isAr ? 'السكن والمنحة' : 'Logement & Bourses'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('about')}
              className={getDesktopNavClass(currentRoute === 'about')}
              aria-current={currentRoute === 'about' ? 'page' : undefined}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#143D30]" />
              <span>{isAr ? 'من نحن' : 'À propos'}</span>
            </button>

            {/* More Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="menu"
                className={`hover:text-[#143D30] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none rounded-lg px-3 py-1.5 ${
                  moreMenuOpen || ['export', 'guide', 'sources', 'privacy'].includes(currentRoute)
                    ? 'bg-stone-100 text-[#143D30]'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
                aria-label={isAr ? 'المزيد من الخدمات' : 'Plus de services'}
              >
                <span>{isAr ? 'المزيد' : 'Plus'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div
                  role="menu"
                  className="absolute top-full end-0 mt-1.5 w-60 max-h-[75vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      setShowAnalyticsModal(true);
                    }}
                    className="w-full text-start px-4 py-2 hover:bg-stone-50 text-stone-800 flex items-center gap-2 font-medium"
                  >
                    <BarChart3 className="w-4 h-4 text-[#143D30]" />
                    <span>{isAr ? 'الإحصائيات والتحليلات' : 'Analyses & Statistiques'}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => navigateTo('export')}
                    className={`w-full text-start px-4 py-2 hover:bg-stone-50 flex items-center gap-2 ${currentRoute === 'export' ? 'bg-[#143D30]/10 text-[#143D30] font-bold' : 'text-stone-800 font-medium'}`}
                  >
                    <Database className="w-4 h-4 text-[#143D30]" />
                    <span>{isAr ? 'مركز البيانات المفتوحة' : 'Export Open Data'}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => navigateTo('guide')}
                    className={`w-full text-start px-4 py-2 hover:bg-stone-50 flex items-center gap-2 ${currentRoute === 'guide' ? 'bg-[#143D30]/10 text-[#143D30] font-bold' : 'text-stone-800 font-medium'}`}
                  >
                    <Compass className="w-4 h-4 text-[#143D30]" />
                    <span>{isAr ? 'طريقة وشروط الاستخدام' : 'Guide & Conditions'}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => navigateTo('sources')}
                    className={`w-full text-start px-4 py-2 hover:bg-stone-50 flex items-center gap-2 ${currentRoute === 'sources' ? 'bg-[#143D30]/10 text-[#143D30] font-bold' : 'text-stone-800 font-medium'}`}
                  >
                    <FileText className="w-4 h-4 text-[#143D30]" />
                    <span>{isAr ? 'المصادر الرسمية والتواصل' : 'Sources & Contact'}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => navigateTo('privacy')}
                    className={`w-full text-start px-4 py-2 hover:bg-stone-50 flex items-center gap-2 ${currentRoute === 'privacy' ? 'bg-[#143D30]/10 text-[#143D30] font-bold' : 'text-stone-800 font-medium'}`}
                  >
                    <Lock className="w-4 h-4 text-[#143D30]" />
                    <span>{isAr ? 'سياسة الخصوصية' : 'Confidentialité'}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      setShowHelpCenter(true);
                    }}
                    className="w-full text-start px-4 py-2 hover:bg-stone-50 text-stone-800 flex items-center gap-2 font-medium"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'مركز المساعدة السريع' : 'Centre d’aide'}</span>
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => navigateTo('moderator')}
                    className={`w-full text-start px-4 py-2 hover:bg-stone-50 flex items-center gap-2 ${currentRoute === 'moderator' ? 'bg-[#143D30]/10 text-[#143D30] font-bold' : 'text-emerald-800 font-semibold'}`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{t.nav_moderator}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMoreMenuOpen(false);
                      handleOpenReport();
                    }}
                    className="w-full text-start px-4 py-2 hover:bg-red-50 text-[#B43425] flex items-center gap-2 font-medium"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#B43425]" />
                    <span>{t.report_inaccuracy}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Bookmarks count badge, Language Switcher, and Hamburger Button */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton lang={lang} />
            </div>

            {/* Quick Bookmark Toggle button */}
            <button
              type="button"
              onClick={() => {
                if (currentRoute !== 'home') {
                  setOnlyBookmarksFilter(true);
                  navigateTo('home');
                  setTimeout(() => {
                    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                  return;
                }
                setOnlyBookmarksFilter((prev) => !prev);
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`inline-flex items-center justify-center min-h-[34px] min-[375px]:min-h-[36px] sm:min-h-[40px] px-1.5 min-[375px]:px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none gap-1 shrink-0 ${
                onlyBookmarksFilter
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200/80'
              }`}
              title={isAr ? 'المؤسسات المحفوظة في المفضلة' : 'Favoris'}
            >
              <Bookmark className={`w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 shrink-0 ${bookmarksCount > 0 ? 'fill-amber-600 text-amber-600' : 'text-stone-500'}`} />
              <span className="font-mono text-[11px] sm:text-xs font-bold tabular-nums">{bookmarksCount}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center min-h-[34px] min-[375px]:min-h-[36px] sm:min-h-[40px] px-1.5 min-[375px]:px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors whitespace-nowrap shrink-0 border border-stone-200/80 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none gap-1"
              title="Changer de langue / تبديل اللغة"
              aria-label={isAr ? 'تغيير اللغة إلى الفرنسية' : 'Changer la langue en arabe'}
              tabIndex={0}
            >
              <Globe className="w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 text-[#143D30] shrink-0" />
              <span className="hidden sm:inline">{t.switch_lang}</span>
              <span className="sm:hidden font-mono uppercase font-bold text-[10px] min-[375px]:text-[11px]">{lang === 'ar' ? 'FR' : 'عربي'}</span>
            </button>

            {/* Hamburger Button for Mobile and Tablet (< lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-h-[34px] min-w-[34px] min-[375px]:min-h-[36px] min-[375px]:min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center p-1 min-[375px]:p-1.5 sm:p-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors border border-stone-200/80 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none shrink-0"
              aria-label={isAr ? 'فتح القائمة الرئيسية' : 'Menu principal'}
            >
              <Menu className="w-4 h-4 min-[375px]:w-4.5 min-[375px]:h-4.5 sm:w-5 sm:h-5 text-stone-800" />
            </button>
          </div>
        </div>
      </header>

      {currentRoute === 'login' ? (
        <Suspense fallback={routeLoadingFallback}>
          <LoginPage
            onBackToHome={() => navigateTo('home')}
            onLoginSuccess={(user, rememberMe) => {
              handleModeratorLoginSuccess(user, rememberMe);
              navigateTo('home');
            }}
            lang={lang}
            onToggleLanguage={toggleLanguage}
          />
        </Suspense>
      ) : currentRoute === 'programs' ? (
        <Suspense fallback={routeLoadingFallback}>
          <ProgramsDirectoryPage
            universities={universities}
            institutions={institutions}
            lang={lang}
            onToggleLanguage={toggleLanguage}
            onBackToHome={() => navigateTo('home')}
            onSelectInstitution={(inst) => {
              navigateTo('home');
              setSelectedItem({ item: inst, type: 'institution' });
            }}
          />
        </Suspense>
      ) : currentRoute === 'dormitories' ? (
        <Suspense fallback={routeLoadingFallback}>
          <DormitoriesGuidePage
            lang={lang}
            onToggleLanguage={toggleLanguage}
            onBackToHome={() => navigateTo('home')}
            onToast={showToast}
          />
        </Suspense>
      ) : currentRoute === 'export' ? (
        <Suspense fallback={routeLoadingFallback}>
          <OpenDataExportPage
            universities={universities}
            institutions={institutions}
            lang={lang}
            onToggleLanguage={toggleLanguage}
            onBackToHome={() => navigateTo('home')}
          />
        </Suspense>
      ) : currentRoute === 'about' ? (
        <Suspense fallback={routeLoadingFallback}>
          <AboutUsPage
            lang={lang}
            universities={universities}
            institutions={institutions}
            onToggleLanguage={toggleLanguage}
            onBackToHome={() => navigateTo('home')}
            onNavigateToDirectory={() => {
              navigateTo('home');
              setTimeout(() => {
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }, 80);
            }}
            onNavigateToExport={() => navigateTo('export')}
          />
        </Suspense>
      ) : currentRoute === 'privacy' ? (
        <Suspense fallback={routeLoadingFallback}>
          <PrivacyPolicyPage
            lang={lang}
            onNavigateToTerms={() => navigateTo('guide')}
            onNavigateToSources={() => navigateTo('sources')}
            onClearLocalPreferences={() => {
              clearBookmarks();
              clearRecentSearches();
            }}
            onToast={showToast}
          />
        </Suspense>
      ) : currentRoute === 'guide' ? (
        <Suspense fallback={routeLoadingFallback}>
          <TermsAndGuidePage
            lang={lang}
            onNavigateToHome={() => navigateTo('home')}
            onNavigateToPrograms={() => navigateTo('programs')}
            onNavigateToPrivacy={() => navigateTo('privacy')}
            onOpenReport={() => handleOpenReport()}
          />
        </Suspense>
      ) : currentRoute === 'sources' ? (
        <Suspense fallback={routeLoadingFallback}>
          <SourcesAndContactPage
            lang={lang}
            universities={universities}
            onToast={showToast}
          />
        </Suspense>
      ) : currentRoute === 'moderator' ? (
        <div className="flex-1 flex flex-col pb-20 lg:pb-0">
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            {currentModeratorUser ? (
              <ModeratorPortal
                universities={universities}
                institutions={institutions}
                reports={reports}
                feedbacks={feedbacks}
                lang={lang}
                currentUser={currentModeratorUser}
                onSignOut={handleModeratorSignOut}
                onUpdateInstitution={handleUpdateInstitution}
                onUpdateUniversity={handleUpdateUniversity}
                onUpdateReportStatus={handleUpdateReportStatus}
                onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
                isStandalone={true}
              />
            ) : (
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 p-8 shadow-xl text-center space-y-5 my-12">
                <div className="w-14 h-14 bg-[#143D30] text-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-stone-900">
                    {isAr ? 'فضاء المكلفين والمشرفين الأكاديميين' : 'Espace Modérateurs & Auditeurs'}
                  </h2>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isAr
                      ? 'هذا الفضاء مخصص حصرياً للمكلفين المعتمدين والمشرفين لمراجعة بلاغات الطلبة وتدقيق البيانات. يرجى تسجيل الدخول للمتابعة.'
                      : 'Espace sécurisé réservé aux modérateurs et auditeurs académiques. Veuillez vous connecter.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModeratorLoginModal(true)}
                  className="w-full py-3 px-4 bg-[#143D30] hover:bg-[#0e2c23] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? 'تسجيل الدخول لفضاء المكلفين' : 'Connexion modérateur'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline block mx-auto pt-1"
                >
                  {isAr ? 'العودة إلى الصفحة الرئيسية' : 'Retour à l’accueil'}
                </button>
              </div>
            )}
          </main>
          {sharedOverlays}
        </div>
      ) : (
        <div className="flex-1 flex flex-col pb-20 lg:pb-0">
          {/* Hero Section */}
          <section className="relative bg-[#FAF7F0] border-b border-stone-200 py-5 sm:py-10 lg:py-12 w-full max-w-full overflow-x-clip">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch w-full">
            {/* Title, Subtitle & Search */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4 min-w-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug sm:leading-tight text-balance">
                {t.hero_title}
              </h1>

              <p className="text-xs sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                {t.hero_subtitle}
              </p>

              {/* Search Box in Hero with Live Autocomplete */}
              <div className="pt-1 w-full">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  universities={universities}
                  institutions={institutions}
                  recentSearches={recentSearches}
                  onAddRecentSearch={addRecentSearch}
                  onRemoveRecentSearch={removeRecentSearch}
                  onClearRecentSearches={clearRecentSearches}
                  onSelectSuggestion={(item, type) => {
                    setSelectedItem({ item, type });
                  }}
                  lang={lang}
                />
              </div>
            </div>

            {/* Clean Campus Visual Column */}
            <div className="lg:col-span-5 relative w-full">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-[#143D30] w-full h-36 sm:h-56 lg:h-full lg:min-h-[240px]">
                <img
                  src={DEFAULT_CAMPUS_IMAGE}
                  alt={isAr ? 'الحرم الجامعي المغربي' : 'Campus universitaire marocain'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Rigor Statistics Strip (Full-width row below hero split) */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 border-t border-stone-200/80 w-full">
            <div className="bg-white/80 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="font-mono tabular-nums text-base sm:text-xl font-bold text-[#143D30] block">
                {universities.length}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {isAr ? 'جامعة عمومية' : 'Universités publiques'}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="font-mono tabular-nums text-base sm:text-xl font-bold text-[#143D30] block">
                {institutions.length}+
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {isAr ? 'مؤسسة معتمدة' : 'Établissements'}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="font-mono tabular-nums text-base sm:text-xl font-bold text-[#143D30] block">
                12
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {isAr ? 'جهة بالمملكة' : 'Régions du Maroc'}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-stone-200/70 shadow-2xs">
              <span className="font-mono tabular-nums text-base sm:text-xl font-bold text-[#143D30] block">
                100%
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
                {isAr ? 'مصادر رسمية' : 'Sources officielles'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Ministerial Announcements & Countdown Section */}
      <AnnouncementsSection announcements={announcements} lang={lang} onToast={showToast} />

      {/* Interactive Map Section (D3.js) */}
      <section id="interactive-map" className="py-7 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 w-full overflow-x-clip">
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Map className="w-5 h-5 text-[#143D30] shrink-0" />
            <h2 className="text-base sm:text-xl font-bold text-stone-900 truncate">
              {isAr ? 'الخريطة التفاعلية للأقطاب الجامعية بالمغرب' : 'Carte interactive des pôles universitaires'}
            </h2>
          </div>
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="text-xs font-semibold text-[#143D30] hover:underline shrink-0 whitespace-nowrap py-1"
          >
            {showMap ? (isAr ? 'إخفاء الخريطة' : 'Masquer la carte') : (isAr ? 'إظهار الخريطة' : 'Afficher la carte')}
          </button>
        </div>

        {showMap && (
          <InteractiveMap
            universities={universities}
            institutions={institutions}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onSelectInstitution={(inst) => setSelectedItem({ item: inst, type: 'institution' })}
            onSelectUniversity={(univ) => setSelectedItem({ item: univ, type: 'university' })}
            lang={lang}
          />
        )}
      </section>

      {/* Directory Explorer Section */}
      <section id="directory" className="py-7 sm:py-12 flex-1 w-full max-w-full overflow-x-clip">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6 w-full">
          {/* Compact Directory Top Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-5 h-5 text-[#143D30] shrink-0" />
              <h2 className="text-base sm:text-xl font-bold text-stone-900 truncate">
                {isAr ? 'دليل الجامعات والمؤسسات المعتمدة' : 'Répertoire des universités et établissements'}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSyncDataGov}
              disabled={isLoadingDataGov}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-[#143D30] border border-stone-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#143D30] focus-visible:outline-none shrink-0"
              title={isAr ? 'تحديث البيانات من data.gov.ma' : 'Synchroniser depuis data.gov.ma'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDataGov ? 'animate-spin text-emerald-700' : ''}`} />
              <span>{isLoadingDataGov ? (isAr ? 'جاري التحديث...' : 'Sync...') : (isAr ? 'تحديث data.gov.ma' : 'Actualiser')}</span>
            </button>
          </div>

          {/* Advanced Filter Panel with Study Disciplines & View Switching */}
          <FilterPanel
            lang={lang}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedDiscipline={selectedDiscipline}
            onDisciplineChange={setSelectedDiscipline}
            viewFilter={viewFilter}
            onViewFilterChange={setViewFilter}
            admissionFilter={admissionFilter}
            onAdmissionFilterChange={setAdmissionFilter}
            onlyBookmarksFilter={onlyBookmarksFilter}
            onToggleBookmarksFilter={() => setOnlyBookmarksFilter((prev) => !prev)}
            bookmarksCount={bookmarksCount}
            totalResultsCount={totalResultsCount}
            universitiesCount={filteredUniversities.length}
            institutionsCount={filteredInstitutions.length}
            disciplineCounts={disciplineCounts}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
          />

          {/* Cards Display Grid */}
          {totalResultsCount === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3 w-full">
              <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">{t.no_results_title}</h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                {t.no_results_desc}
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#143D30] text-white text-xs font-medium rounded-lg hover:bg-[#0f2e24]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clear_filters}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8 w-full">
              {/* Universities Section */}
              {(viewFilter === 'all' || viewFilter === 'universities') && filteredUniversities.length > 0 && (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 border-b border-stone-200">
                    <Building2 className="w-4 h-4 text-[#143D30] shrink-0" />
                    <h2 className="text-base sm:text-lg font-bold text-stone-900">
                      {isAr ? 'الجامعات العمومية بالمملكة' : 'Universités publiques du Royaume'} ({filteredUniversities.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {filteredUniversities.map((univ) => (
                      <UniversityCard
                        key={univ.id}
                        university={univ}
                        lang={lang}
                        onSelect={(u) => setSelectedItem({ item: u, type: 'university' })}
                        onReport={(u) => handleOpenReport(u)}
                        isCompared={comparedItems.some((c) => c.item.id === univ.id)}
                        onToggleCompare={(u) => handleToggleCompare(u, 'university')}
                        onShare={(u) => shareItem(u, lang, showToast)}
                        isBookmarked={isBookmarked(univ.id)}
                        onToggleBookmark={(u) => {
                          toggleBookmark(u.id);
                          showToast(
                            isBookmarked(u.id)
                              ? isAr ? 'تمت إزالة الجامعة من المفضلة' : 'Université retirée des favoris'
                              : isAr ? 'تم حفظ الجامعة في المفضلة ⭐' : 'Université ajoutée aux favoris ⭐'
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Institutions Section */}
              {(viewFilter === 'all' || viewFilter === 'institutions') && filteredInstitutions.length > 0 && (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 border-b border-stone-200">
                    <GraduationCap className="w-4 h-4 text-[#143D30] shrink-0" />
                    <h2 className="text-base sm:text-lg font-bold text-stone-900">
                      {isAr ? 'المدارس العليا والكليات والمعاهد' : 'Écoles supérieures, facultés et instituts'} ({filteredInstitutions.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {filteredInstitutions.map((inst) => (
                      <InstitutionCard
                        key={inst.id}
                        institution={inst}
                        lang={lang}
                        onSelect={(i) => setSelectedItem({ item: i, type: 'institution' })}
                        onReport={(i) => handleOpenReport(i)}
                        isCompared={comparedItems.some((c) => c.item.id === inst.id)}
                        onToggleCompare={(i) => handleToggleCompare(i, 'institution')}
                        onShare={(i) => shareItem(i, lang, showToast)}
                        isBookmarked={isBookmarked(inst.id)}
                        onToggleBookmark={(i) => {
                          toggleBookmark(i.id);
                          showToast(
                            isBookmarked(i.id)
                              ? isAr ? 'تمت إزالة المؤسسة من المفضلة' : 'Établissement retiré des favoris'
                              : isAr ? 'تم حفظ المؤسسة في المفضلة ⭐' : 'Établissement ajouté aux favoris ⭐'
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 pt-8 sm:pt-10 pb-24 lg:pb-10 border-t border-stone-800 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 pb-6 border-b border-stone-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 p-1">
                  <img
                    src="/assets/aistudio/jami3ati_emblem_transparent.png"
                    alt={isAr ? 'شعار جامعتي' : 'Logo Jami3ati'}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-sm sm:text-base font-bold text-white block">
                  {isAr ? 'جامعتي | Jami3ati' : 'Jami3ati | جامعتي'}
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {isAr
                  ? 'دليل موحد للتعليم العالي بالمغرب مبني على مصادر البيانات المفتوحة الرسمية (data.gov.ma) ومواقع الجامعات.'
                  : 'Guide unifié de l’enseignement supérieur au Maroc basé sur les données ouvertes officielles (data.gov.ma).'}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
                {isAr ? 'صفحات المنصة' : 'Pages & Services'}
              </span>
              <ul className="space-y-1.5 text-xs text-stone-400">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('about')}
                    className="hover:text-white text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'من نحن وميثاق الثقة' : 'À propos & Charte'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('programs')}
                    className="hover:text-white text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'دليل المسالك والمهن' : 'Répertoire des Diplômes'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('dormitories')}
                    className="hover:text-white text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'الأحياء الجامعية والمنحة' : 'Logement & Bourses'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('export')}
                    className="hover:text-white text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'البيانات المفتوحة (JSON / CSV)' : 'Données ouvertes (JSON / CSV)'}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
                {isAr ? 'الشفافية والمصادر' : 'Transparence & Sources'}
              </span>
              <ul className="space-y-1.5 text-xs text-stone-400">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('guide')}
                    className="hover:text-amber-300 text-start font-semibold text-amber-200/90 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'طريقة وشروط الاستخدام' : 'Guide & Conditions'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('sources')}
                    className="hover:text-white text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'سجل المصادر والتواصل' : 'Sources & Contact'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('privacy')}
                    className="hover:text-white text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'سياسة الخصوصية (09-08)' : 'Confidentialité (09-08)'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenReport()}
                    className="hover:text-amber-400 text-start focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none rounded"
                  >
                    {isAr ? 'الإبلاغ عن معلومة غير صحيحة' : 'Signaler une erreur'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleOpenModeratorPortal}
                    className="hover:text-emerald-400 text-start focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded"
                  >
                    {t.nav_moderator}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
            <span>
              {isAr
                ? '© 2026 جامعتي | Jami3ati — البوابة المستقلة للبيانات الجامعية بالمغرب.'
                : '© 2026 Jami3ati — Portail indépendant des données universitaires au Maroc.'}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <button type="button" onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">
                {isAr ? 'سياسة الخصوصية' : 'Confidentialité'}
              </button>
              <span className="text-stone-700">·</span>
              <button type="button" onClick={() => navigateTo('guide')} className="hover:text-white transition-colors">
                {isAr ? 'شروط الاستخدام' : 'Conditions'}
              </button>
              <span className="text-stone-700">·</span>
              <button type="button" onClick={() => navigateTo('sources')} className="hover:text-white transition-colors">
                {isAr ? 'المصادر والتواصل' : 'Sources & Contact'}
              </button>
            </div>
          </div>
        </div>
      </footer>
        </div>
      )}

      {sharedOverlays}
    </div>
  );
}
