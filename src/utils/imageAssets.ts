import heroCampusImg from '../assets/images/hero_academic_campus_1793985375880.jpg';
import um5CampusImg from '../assets/images/um5_rabat_campus_1793985376104.jpg';
import ucaCampusImg from '../assets/images/uca_marrakech_campus_1793985377664.jpg';
import ensiasInstituteImg from '../assets/images/ensias_rabat_institute_1793985376167.jpg';

const ASSET_MAP: Record<string, string> = {
  '/src/assets/images/hero_academic_campus_1793985375880.jpg': heroCampusImg,
  '/src/assets/images/um5_rabat_campus_1793985376104.jpg': um5CampusImg,
  '/src/assets/images/uca_marrakech_campus_1793985377664.jpg': ucaCampusImg,
  '/src/assets/images/ensias_rabat_institute_1793985376167.jpg': ensiasInstituteImg,
};

export const DEFAULT_CAMPUS_IMAGE = heroCampusImg;

/**
 * Resolves raw `/src/assets/images/...` paths (used in JSON/seed data)
 * to Vite-bundled asset URLs so images load reliably in production builds.
 */
export function resolveAssetImage(url?: string | null): string {
  if (!url) return DEFAULT_CAMPUS_IMAGE;
  if (ASSET_MAP[url]) return ASSET_MAP[url];
  const filename = url.split('/').pop();
  if (filename) {
    const matchedKey = Object.keys(ASSET_MAP).find((k) => k.endsWith(`/${filename}`));
    if (matchedKey) return ASSET_MAP[matchedKey];
  }
  return url;
}
