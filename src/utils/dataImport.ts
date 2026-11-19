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

const text = (value: unknown): string => value == null ? '' : String(value).trim();
const optionalText = (value: unknown): string | null => text(value) || null;
const numberOrZero = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const dataStatus = (item: Record<string, any>): 'verified' | 'needs_review' | 'demo' => {
  if (item.data_status === 'demo') return 'demo';
  const hasProvenance = Boolean(text(item.source_url) && text(item.source_name) && text(item.verified_at));
  return item.data_status === 'verified' && hasProvenance ? 'verified' : 'needs_review';
};

/** Normalize source records without inventing provenance or verification dates. */
function normalizeUniversities(rawList: any[]): University[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item, index) => ({
    id: text(item.id || item.code_universite) || `univ-${index + 1}`,
    code: text(item.code || item.acronyme || `UNIV-${index + 1}`).toUpperCase(),
    name_ar: text(item.name_ar || item.nom_ar || item.designation_ar),
    name_fr: text(item.name_fr || item.nom_fr || item.designation_fr),
    acronym: text(item.acronym || item.code),
    city_ar: text(item.city_ar || item.ville_ar),
    city_fr: text(item.city_fr || item.ville_fr),
    region_ar: text(item.region_ar || item.region),
    region_fr: text(item.region_fr),
    established_year: numberOrZero(item.established_year || item.annee_creation),
    website_url: text(item.website_url || item.site_web),
    portal_student_url: optionalText(item.portal_student_url),
    description_ar: text(item.description_ar),
    description_fr: text(item.description_fr),
    image_url: resolveAssetImage(item.image_url ? String(item.image_url) : undefined),
    phone: optionalText(item.phone),
    email: optionalText(item.email),
    address_ar: text(item.address_ar),
    address_fr: text(item.address_fr),
    source_url: text(item.source_url),
    source_name: text(item.source_name),
    verified_at: text(item.verified_at),
    data_status: dataStatus(item),
    institution_count: numberOrZero(item.institution_count || (Array.isArray(item.institutions_list) ? item.institutions_list.length : 0)),
    institutions_list: Array.isArray(item.institutions_list) ? item.institutions_list.map(String) : [],
    disciplines: Array.isArray(item.disciplines) ? item.disciplines : undefined,
  }));
}

/** Normalize institution records; missing fields remain visibly incomplete for review. */
function normalizeInstitutions(rawList: any[]): Institution[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item, index) => ({
    id: text(item.id || item.code_etablissement) || `inst-${index + 1}`,
    code: text(item.code || `INST-${index + 1}`).toUpperCase(),
    university_id: text(item.university_id || item.id_universite),
    university_name_ar: text(item.university_name_ar || item.universite_ar),
    university_name_fr: text(item.university_name_fr || item.universite_fr),
    name_ar: text(item.name_ar || item.nom_ar),
    name_fr: text(item.name_fr || item.nom_fr),
    type: (item.type === 'engineering_school' || item.type === 'faculty' || item.type === 'institute' || item.type === 'business_school') ? item.type : 'faculty',
    type_label_ar: text(item.type_label_ar),
    type_label_fr: text(item.type_label_fr),
    city_ar: text(item.city_ar || item.ville_ar),
    city_fr: text(item.city_fr || item.ville_fr),
    campus_ar: text(item.campus_ar || item.campus),
    campus_fr: text(item.campus_fr),
    website_url: text(item.website_url || item.site_web),
    phone: optionalText(item.phone),
    email: optionalText(item.email),
    source_url: text(item.source_url),
    source_name: text(item.source_name),
    verified_at: text(item.verified_at),
    data_status: dataStatus(item),
    admission_type: item.admission_type === 'regulated' || item.admission_type === 'open'
      ? item.admission_type
      : (String(item.access_mode_ar || '').includes('محدود') || String(item.access_mode_ar || '').includes('مباراة') ? 'regulated' : 'open'),
    disciplines: Array.isArray(item.disciplines) ? item.disciplines : undefined,
    disciplines_labels_ar: Array.isArray(item.disciplines_labels_ar) ? item.disciplines_labels_ar : [],
    disciplines_labels_fr: Array.isArray(item.disciplines_labels_fr) ? item.disciplines_labels_fr : [],
    programs_summary_ar: Array.isArray(item.programs_summary_ar) ? item.programs_summary_ar : [],
    programs_summary_fr: Array.isArray(item.programs_summary_fr) ? item.programs_summary_fr : [],
    access_mode_ar: text(item.access_mode_ar),
    access_mode_fr: text(item.access_mode_fr),
    image_url: resolveAssetImage(item.image_url ? String(item.image_url) : undefined),
  }));
}

/** Fetch the CKAN dataset; fall back to the bundled snapshot when unavailable. */
export async function importDataGovMaData(): Promise<DataGovImportResult> {
  let isLive = false;
  let parsedRawData: any = null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(DATA_GOV_MA_API_ENDPOINT, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      const json = await response.json();
      if (json?.success && json?.result && Array.isArray(json.result.universities)) {
        parsedRawData = json.result;
        isLive = true;
      }
    }
  } catch (err) {
    console.info('Live data.gov.ma fetch unavailable; using bundled dataset snapshot.', err);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!parsedRawData) {
    parsedRawData = localDataGovDataset;
    isLive = false;
  }

  const universities = normalizeUniversities(parsedRawData.universities || []);
  const institutions = normalizeInstitutions(parsedRawData.institutions || []);
  const result: DataGovImportResult = {
    universities,
    institutions,
    isLiveFromDataGov: isLive,
    source: text(parsedRawData.source),
    publisher: text(parsedRawData.publisher),
    lastUpdated: text(parsedRawData.last_updated),
    totalRecords: universities.length + institutions.length,
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
  } catch (error) {
    console.warn('Could not cache imported dataset in localStorage.', error);
  }
  return result;
}

export function getCachedDataGovData(): DataGovImportResult | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.universities) && Array.isArray(parsed.institutions) && parsed.universities.length > 0) {
        return parsed as DataGovImportResult;
      }
    }
  } catch (error) {
    console.warn('Failed to parse cached data.gov.ma dataset.', error);
  }
  return null;
}

export async function loadInitialDataGovDataset(): Promise<DataGovImportResult> {
  const cached = getCachedDataGovData();
  if (cached && cached.universities.length >= 10) return cached;
  return importDataGovMaData();
}

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
