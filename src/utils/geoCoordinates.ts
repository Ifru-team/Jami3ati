import { University, Institution } from '../types';

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

// Precise GPS coordinates for major Moroccan public universities (Headquarters / Presidencies)
export const UNIVERSITY_COORDINATES: Record<string, GeoLocation> = {
  // Mohammed V University - Rabat (Agdal/Madinat Al Irfane)
  'univ-um5-rabat': { lat: 33.9995, lng: -6.8525, address: 'شارع الأمم المتحدة، أكدال، الرباط' },
  // Hassan II University - Casablanca (Route d'El Jadida / Mers Sultan)
  'univ-uh2-casablanca': { lat: 33.5430, lng: -7.6740, address: 'طريق الجديدة، كازابلانكا' },
  // Cadi Ayyad University - Marrakech (Bd Abdelkrim Al Khattabi)
  'univ-uca-marrakech': { lat: 31.6542, lng: -8.0125, address: 'شارع عبد الكريم الخطابي، مراكش' },
  // Sidi Mohamed Ben Abdellah University - Fès (Dhar El Mehraz)
  'univ-usmba-fes': { lat: 34.0080, lng: -4.9750, address: 'طريق إيموزار، ظهر المهراز، فاس' },
  // Abdelmalek Essaâdi University - Tétouan / Tanger
  'univ-uae-tetouan': { lat: 35.5620, lng: -5.3640, address: 'المحنش الثاني، تطوان' },
  // Ibn Zohr University - Agadir
  'univ-uiz-agadir': { lat: 30.4060, lng: -9.5560, address: 'المركب الجامعي الجديد، أكادير' },
  // Ibn Tofail University - Kénitra
  'univ-uit-kenitra': { lat: 34.2540, lng: -6.5815, address: 'الحرم الجامعي، القنيطرة' },
  // Mohammed I University - Oujda
  'univ-ump-oujda': { lat: 34.6505, lng: -1.8990, address: 'مركب القدس الجامعي، وجدة' },
  // Moulay Ismail University - Meknès
  'univ-umi-meknes': { lat: 33.8820, lng: -5.5420, address: 'مرجان / الزيتون، مكناس' },
  // Hassan I University - Settat
  'univ-uh1-settat': { lat: 33.0040, lng: -7.6180, address: 'طريق الدار البيضاء، سطات' },
  // Chouaib Doukkali University - El Jadida
  'univ-ucd-eljadida': { lat: 33.2380, lng: -8.5020, address: 'طريق بن معاشو، الجديدة' },
  // Sultan Moulay Slimane University - Béni Mellal
  'univ-usms-benimellal': { lat: 32.3410, lng: -6.3450, address: 'حي مغيلة، بني ملال' },
};

// Precise GPS coordinates for flagship higher education colleges, faculties, and institutes
export const INSTITUTION_COORDINATES: Record<string, GeoLocation> = {
  // Rabat
  'inst-ensias-rabat': { lat: 33.9842, lng: -6.8675, address: 'مدينة العرفان، الرباط' },
  'inst-emi-rabat': { lat: 33.9992, lng: -6.8545, address: 'شارع ابن سينا، أكدال، الرباط' },
  'inst-fmd-rabat': { lat: 33.9815, lng: -6.8652, address: 'مدينة العرفان، الرباط' },
  'inst-inpt-rabat': { lat: 33.9790, lng: -6.8660, address: 'مدينة العرفان، الرباط' },
  'inst-est-sale': { lat: 34.0535, lng: -6.7975, address: 'طريق القنيطرة، سلا' },
  'inst-fsjes-agdal': { lat: 34.0040, lng: -6.8490, address: 'أكدال، الرباط' },
  'inst-fsjes-souissi': { lat: 33.9780, lng: -6.8570, address: 'السويسي، الرباط' },

  // Casablanca
  'inst-ensam-casablanca': { lat: 33.5932, lng: -7.5338, address: 'عين السبع، الدار البيضاء' },
  'inst-ensem-casablanca': { lat: 33.5432, lng: -7.6745, address: 'طريق الجديدة، الدار البيضاء' },
  'inst-fmp-casablanca': { lat: 33.5780, lng: -7.6120, address: 'شارع طارق بن زياد، الدار البيضاء' },
  'inst-encg-casablanca': { lat: 33.6065, lng: -7.5320, address: 'عين السبع، الدار البيضاء' },
  'inst-est-casablanca': { lat: 33.5390, lng: -7.6710, address: 'طريق الجديدة، الدار البيضاء' },

  // Marrakech
  'inst-ensa-marrakech': { lat: 31.6445, lng: -8.0205, address: 'شارع عبد الكريم الخطابي، مراكش' },
  'inst-fmp-marrakech': { lat: 31.6492, lng: -8.0267, address: 'سيدي يوسف بن علي / جليز، مراكش' },
  'inst-encg-marrakech': { lat: 31.6510, lng: -8.0160, address: 'شارع عبد الكريم الخطابي، مراكش' },
  'inst-fst-marrakech': { lat: 31.6480, lng: -8.0220, address: 'جليز، مراكش' },

  // Settat & Chaouia
  'inst-fst-settat': { lat: 33.0034, lng: -7.6160, address: 'كلم 3 طريق الدار البيضاء، سطات' },
  'inst-encg-settat': { lat: 33.0060, lng: -7.6175, address: 'طريق الدار البيضاء، سطات' },

  // Tanger & Tétouan
  'inst-ensa-tanger': { lat: 35.7371, lng: -5.8942, address: 'حي الزياتن، طنجة' },
  'inst-encg-tanger': { lat: 35.7420, lng: -5.8910, address: 'الزياتن، طنجة' },
  'inst-ens-tetouan': { lat: 35.5680, lng: -5.3710, address: 'مرتيل، تطوان' },
  'inst-ensa-tetouan': { lat: 35.5790, lng: -5.3560, address: 'شارع القدس، تطوان' },

  // Agadir & Souss
  'inst-ensa-agadir': { lat: 30.4070, lng: -9.5620, address: 'حي الداخلة، أكادير' },
  'inst-fmp-agadir': { lat: 30.3950, lng: -9.5340, address: 'حي تيليلا، أكادير' },
  'inst-encg-agadir': { lat: 30.4090, lng: -9.5650, address: 'حي الداخلة، أكادير' },
  'inst-fpt-taroudant': { lat: 30.4710, lng: -8.8750, address: 'تارودانت' },

  // Kénitra
  'inst-ensa-kenitra': { lat: 34.2530, lng: -6.5820, address: 'الحرم الجامعي، القنيطرة' },
  'inst-encg-kenitra': { lat: 34.2550, lng: -6.5840, address: 'الحرم الجامعي، القنيطرة' },

  // Fès
  'inst-fst-fes': { lat: 34.0041, lng: -4.9740, address: 'طريق إيموزار، فاس' },
  'inst-ens-fes': { lat: 34.0110, lng: -4.9810, address: 'بنسودة، فاس' },
  'inst-fmp-fes': { lat: 34.0020, lng: -4.9780, address: 'طريق سيدي حرازم، فاس' },

  // Oujda
  'inst-ensao-oujda': { lat: 34.6514, lng: -1.8988, address: 'مركب القدس، وجدة' },
  'inst-fmp-oujda': { lat: 34.6530, lng: -1.9010, address: 'وجدة' },

  // Meknès
  'inst-ensam-meknes': { lat: 33.8860, lng: -5.5450, address: 'مرجان، مكناس' },
  'inst-est-meknes': { lat: 33.8810, lng: -5.5400, address: 'الزيتون، مكناس' },

  // El Jadida
  'inst-ensa-eljadida': { lat: 33.2410, lng: -8.5050, address: 'طريق بن معاشو، الجديدة' },

  // Béni Mellal
  'inst-fst-benimellal': { lat: 32.3420, lng: -6.3470, address: 'مغيلة، بني ملال' },

  // Southern Provinces & Others
  'inst-est-guelmim': { lat: 28.9880, lng: -10.0520, address: 'كلميم' },
  'inst-est-layoune': { lat: 27.1420, lng: -13.1950, address: 'العيون' },
  'inst-est-dakhla': { lat: 23.7210, lng: -15.9320, address: 'الداخلة' },
  'inst-fste-errachidia': { lat: 31.9320, lng: -4.4280, address: 'الرشيدية' },
};

// Fallback regional city centers
export const CITY_CENTERS: Record<string, GeoLocation> = {
  'الرباط': { lat: 34.0209, lng: -6.8416 },
  'Rabat': { lat: 34.0209, lng: -6.8416 },
  'الدار البيضاء': { lat: 33.5731, lng: -7.5898 },
  'Casablanca': { lat: 33.5731, lng: -7.5898 },
  'مراكش': { lat: 31.6295, lng: -7.9811 },
  'Marrakech': { lat: 31.6295, lng: -7.9811 },
  'فاس': { lat: 34.0331, lng: -5.0003 },
  'Fès': { lat: 34.0331, lng: -5.0003 },
  'طنجة': { lat: 35.7595, lng: -5.8340 },
  'Tanger': { lat: 35.7595, lng: -5.8340 },
  'تطوان': { lat: 35.5785, lng: -5.3684 },
  'Tétouan': { lat: 35.5785, lng: -5.3684 },
  'أكادير': { lat: 30.4278, lng: -9.5981 },
  'Agadir': { lat: 30.4278, lng: -9.5981 },
  'القنيطرة': { lat: 34.2610, lng: -6.5802 },
  'Kénitra': { lat: 34.2610, lng: -6.5802 },
  'وجدة': { lat: 34.6867, lng: -1.9114 },
  'Oujda': { lat: 34.6867, lng: -1.9114 },
  'مكناس': { lat: 33.8938, lng: -5.5473 },
  'Meknès': { lat: 33.8938, lng: -5.5473 },
  'سطات': { lat: 33.0010, lng: -7.6166 },
  'Settat': { lat: 33.0010, lng: -7.6166 },
  'الجديدة': { lat: 33.2316, lng: -8.5007 },
  'El Jadida': { lat: 33.2316, lng: -8.5007 },
  'بني ملال': { lat: 32.3394, lng: -6.3533 },
  'Béni Mellal': { lat: 32.3394, lng: -6.3533 },
  'آسفي': { lat: 32.2994, lng: -9.2372 },
  'Safi': { lat: 32.2994, lng: -9.2372 },
  'سلا': { lat: 34.0531, lng: -6.7985 },
  'Salé': { lat: 34.0531, lng: -6.7985 },
  'العيون': { lat: 27.1536, lng: -13.2033 },
  'Laâyoune': { lat: 27.1536, lng: -13.2033 },
  'الداخلة': { lat: 23.7136, lng: -15.9388 },
  'Dakhla': { lat: 23.7136, lng: -15.9388 },
  'الرشيدية': { lat: 31.9315, lng: -4.4285 },
  'Errachidia': { lat: 31.9315, lng: -4.4285 },
  'كلميم': { lat: 28.9869, lng: -10.0574 },
  'Guelmim': { lat: 28.9869, lng: -10.0574 },
  'تارودانت': { lat: 30.4703, lng: -8.8770 },
  'Taroudant': { lat: 30.4703, lng: -8.8770 },
};

/**
 * Deterministically resolves accurate coordinates for an institution or university
 */
export function getCoordinates(item: University | Institution, type: 'university' | 'institution'): GeoLocation {
  const normalizedId = item.id.toLowerCase();

  if (type === 'university') {
    if (UNIVERSITY_COORDINATES[normalizedId]) {
      return UNIVERSITY_COORDINATES[normalizedId];
    }
  } else {
    if (INSTITUTION_COORDINATES[normalizedId]) {
      return INSTITUTION_COORDINATES[normalizedId];
    }
  }

  // Fallback by city
  const cityKey = (item.city_ar || item.city_fr || '').trim();
  const cityMeta = CITY_CENTERS[cityKey] || CITY_CENTERS[item.city_fr] || CITY_CENTERS['الرباط'];

  // Add a small deterministic jitter based on item ID hash to prevent marker collision
  let hash = 0;
  for (let i = 0; i < item.id.length; i++) {
    hash = (hash << 5) - hash + item.id.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 100) - 50) * 0.00035;
  const lngOffset = ((Math.abs(hash >> 3) % 100) - 50) * 0.00035;

  return {
    lat: cityMeta.lat + latOffset,
    lng: cityMeta.lng + lngOffset,
    address: `${item.city_ar}، المغرب`,
  };
}

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Generates OpenStreetMap Navigation Directions URL
 */
export function getOpenStreetMapDirectionsUrl(destLat: number, destLng: number, startLat?: number, startLng?: number): string {
  if (startLat !== undefined && startLng !== undefined) {
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${startLat}%2C${startLng}%3B${destLat}%2C${destLng}`;
  }
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${destLat}%2C${destLng}#map=16/${destLat}/${destLng}`;
}

/**
 * Generates Google Maps Directions URL (GPS Navigation)
 */
export function getGoogleMapsDirectionsUrl(destLat: number, destLng: number, startLat?: number, startLng?: number): string {
  if (startLat !== undefined && startLng !== undefined) {
    return `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
}
