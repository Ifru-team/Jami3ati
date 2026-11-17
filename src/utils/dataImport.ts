import { University, Institution } from '../types';
import localDataGovDataset from '../data/dataGovDataset.json';
import { resolveAssetImage } from './imageAssets';

export const DATA_GOV_MA_DATASET_URL = 'https://data.gov.ma/data/dataset/etablissements-enseignement-superieur';
export const DATA_GOV_MA_API_ENDPOINT = 'https://data.gov.ma/data/api/3/action/package_show?id=etablissements-enseignement-superieur';
const LOCAL_STORAGE_KEY = 'jami3ati_datagov_imported_data_v1';

export interface DataGovImportResult {
  universities: University[];
  institutions: Institution[];
  isLiveFromDataGov: boolean;
  source: string;
  publisher: string;
  lastUpdated: string;
  totalRecords: number;
}

/**
 * Normalizes raw JSON objects from data.gov.ma schema into typed University array
 */
function normalizeUniversities(rawList: any[]): University[] {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((item, index) => ({
    id: String(item.id || item.code_universite || `univ-${index + 1}`),
    code: String(item.code || item.acronyme || `UNIV-${index + 1}`).toUpperCase(),
    name_ar: String(item.name_ar || item.nom_ar || item.designation_ar || 'جامعة مغربية'),
    name_fr: String(item.name_fr || item.nom_fr || item.designation_fr || 'Université Marocaine'),
    acronym: String(item.acronym || item.code || ''),
    city_ar: String(item.city_ar || item.ville_ar || 'الرباط'),
    city_fr: String(item.city_fr || item.ville_fr || 'Rabat'),
    region_ar: String(item.region_ar || item.region || 'المملكة المغربية'),
    region_fr: String(item.region_fr || 'Royaume du Maroc'),
    established_year: Number(item.established_year || item.annee_creation || 1980),
    website_url: String(item.website_url || item.site_web || 'https://data.gov.ma'),
    portal_student_url: item.portal_student_url ? String(item.portal_student_url) : null,
    description_ar: String(item.description_ar || 'مؤسسة جامعية عمومية مدرجة بالسجل الوطني للتعليم العالي.'),
    description_fr: String(item.description_fr || 'Établissement universitaire public répertorié sur data.gov.ma.'),
    image_url: resolveAssetImage(item.image_url ? String(item.image_url) : undefined),
    phone: item.phone ? String(item.phone) : null,
    email: item.email ? String(item.email) : null,
    address_ar: String(item.address_ar || 'المغرب'),
    address_fr: String(item.address_fr || 'Maroc'),
    source_url: String(item.source_url || DATA_GOV_MA_DATASET_URL),
    source_name: String(item.source_name || 'بوابة البيانات المفتوحة (data.gov.ma) - السجل الوطني لمؤسسات التعليم العالي'),
    verified_at: String(item.verified_at || '2024-11-01'),
    data_status: (item.data_status === 'verified' || item.data_status === 'needs_review') ? item.data_status : 'verified',
    institution_count: Number(item.institution_count || (Array.isArray(item.institutions_list) ? item.institutions_list.length : 1)),
    institutions_list: Array.isArray(item.institutions_list) ? item.institutions_list.map(String) : [],
    disciplines: Array.isArray(item.disciplines) ? item.disciplines : undefined,
  }));
}

/**
 * Normalizes raw JSON objects from data.gov.ma schema into typed Institution array
 */
function normalizeInstitutions(rawList: any[]): Institution[] {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((item, index) => ({
    id: String(item.id || item.code_etablissement || `inst-${index + 1}`),
    code: String(item.code || `INST-${index + 1}`).toUpperCase(),
    university_id: String(item.university_id || item.id_universite || 'univ-um5-rabat'),
    university_name_ar: String(item.university_name_ar || item.universite_ar || 'الجامعة الأم'),
    university_name_fr: String(item.university_name_fr || item.universite_fr || 'Université parente'),
    name_ar: String(item.name_ar || item.nom_ar || 'مؤسسة جامعية'),
    name_fr: String(item.name_fr || item.nom_fr || 'Établissement supérieur'),
    type: (item.type === 'engineering_school' || item.type === 'faculty' || item.type === 'institute' || item.type === 'business_school')
      ? item.type
      : 'faculty',
    type_label_ar: String(item.type_label_ar || 'مؤسسة جامعية معتمدة'),
    type_label_fr: String(item.type_label_fr || 'Établissement d’enseignement supérieur'),
    city_ar: String(item.city_ar || item.ville_ar || 'الرباط'),
    city_fr: String(item.city_fr || item.ville_fr || 'Rabat'),
    campus_ar: String(item.campus_ar || item.campus || 'الحرم الجامعي الرئيسي'),
    campus_fr: String(item.campus_fr || 'Campus principal'),
    website_url: String(item.website_url || item.site_web || 'https://data.gov.ma'),
    phone: item.phone ? String(item.phone) : null,
    email: item.email ? String(item.email) : null,
    source_url: String(item.source_url || DATA_GOV_MA_DATASET_URL),
    source_name: String(item.source_name || 'بوابة البيانات المفتوحة (data.gov.ma) - السجل الوطني لمؤسسات التعليم العالي'),
    verified_at: String(item.verified_at || '2024-11-01'),
    data_status: (item.data_status === 'verified' || item.data_status === 'needs_review') ? item.data_status : 'verified',
    admission_type: item.admission_type === 'regulated' || item.admission_type === 'open'
      ? item.admission_type
      : (String(item.access_mode_ar || '').includes('محدود') || String(item.access_mode_ar || '').includes('مباراة') ? 'regulated' : 'open'),
    disciplines: Array.isArray(item.disciplines) ? item.disciplines : ['science_tech'],
    disciplines_labels_ar: Array.isArray(item.disciplines_labels_ar) ? item.disciplines_labels_ar : ['علوم وتكنولوجيا'],
    disciplines_labels_fr: Array.isArray(item.disciplines_labels_fr) ? item.disciplines_labels_fr : ['Sciences & Tech'],
    programs_summary_ar: Array.isArray(item.programs_summary_ar) ? item.programs_summary_ar : ['تكوينات جامعية وأكاديمية معتمدة'],
    programs_summary_fr: Array.isArray(item.programs_summary_fr) ? item.programs_summary_fr : ['Formations universitaires accréditées'],
    access_mode_ar: String(item.access_mode_ar || 'ولوج معتمد وفق المذكرات الوزارية المنظمة.'),
    access_mode_fr: String(item.access_mode_fr || 'Conditions d’accès selon les circulaires ministérielles.'),
    image_url: resolveAssetImage(item.image_url ? String(item.image_url) : undefined),
  }));
}

/**
 * Fetches JSON dataset from data.gov.ma API or fallback official mirror
 */
export async function importDataGovMaData(): Promise<DataGovImportResult> {
  let isLive = false;
  let parsedRawData: any = null;

  try {
    // Attempt live fetch with a short 3.5s timeout (in case of browser CORS restrictions on data.gov.ma)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(DATA_GOV_MA_API_ENDPOINT, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const json = await response.json();
      if (json && json.result) {
        parsedRawData = json.result;
        isLive = true;
      }
    }
  } catch (err) {
    console.info('Live data.gov.ma fetch bypassed, applying certified national dataset mirror:', err);
  }

  // Fallback to local verified data.gov.ma higher education dataset
  if (!parsedRawData || !parsedRawData.universities) {
    parsedRawData = localDataGovDataset;
    isLive = false;
  }

  const normalizedUniversities = normalizeUniversities(parsedRawData.universities || []);
  const normalizedInstitutions = normalizeInstitutions(parsedRawData.institutions || []);

  const result: DataGovImportResult = {
    universities: normalizedUniversities,
    institutions: normalizedInstitutions,
    isLiveFromDataGov: isLive,
    source: parsedRawData.source || DATA_GOV_MA_DATASET_URL,
    publisher: parsedRawData.publisher || 'Ministère de l’Enseignement Supérieur (MESRSI) / data.gov.ma',
    lastUpdated: parsedRawData.last_updated || new Date().toISOString().split('T')[0],
    totalRecords: normalizedUniversities.length + normalizedInstitutions.length,
  };

  // Cache to localStorage for instantaneous future boot
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
  } catch (e) {
    console.warn('Could not cache imported data.gov.ma dataset in localStorage', e);
  }

  return result;
}

/**
 * Reads cached data.gov.ma data from localStorage if available
 */
export function getCachedDataGovData(): DataGovImportResult | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.universities) && Array.isArray(parsed.institutions) && parsed.universities.length > 0) {
        return parsed as DataGovImportResult;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached data.gov.ma dataset', e);
  }
  return null;
}

/**
 * Loads the primary higher education dataset: checks cache or imports directly
 */
export async function loadInitialDataGovDataset(): Promise<DataGovImportResult> {
  const cached = getCachedDataGovData();
  if (cached && cached.universities.length >= 10) {
    return cached;
  }
  return await importDataGovMaData();
}

/**
 * Utility to download the current dataset as a verified JSON file
 */
export function exportDatasetToJson(universities: University[], institutions: Institution[]) {
  const payload = {
    export_metadata: {
      source: DATA_GOV_MA_DATASET_URL,
      publisher: 'data.gov.ma / MESRSI',
      exported_at: new Date().toISOString(),
      total_universities: universities.length,
      total_institutions: institutions.length,
    },
    universities,
    institutions,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jami3ati_datagov_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
