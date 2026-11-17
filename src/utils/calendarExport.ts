import { OfficialAnnouncement, University, Institution, Language } from '../types';

function toCompactYmd(dateStr: string): string {
  return dateStr.replace(/-/g, '').slice(0, 8);
}

function getNextDayCompactYmd(dateStr: string): string {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return toCompactYmd(dateStr);
  }
  const [year, month, day] = parts;
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  const y = next.getUTCFullYear();
  const m = String(next.getUTCMonth() + 1).padStart(2, '0');
  const d = String(next.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function getUtcTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${now.getUTCFullYear()}` +
    `${pad(now.getUTCMonth() + 1)}` +
    `${pad(now.getUTCDate())}T` +
    `${pad(now.getUTCHours())}` +
    `${pad(now.getUTCMinutes())}` +
    `${pad(now.getUTCSeconds())}Z`
  );
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function buildAnnouncementVEvents(ann: OfficialAnnouncement, lang: Language): string[] {
  const isAr = lang === 'ar';
  const title = isAr ? ann.title_ar : ann.title_fr;
  const instName = isAr ? ann.institution_name_ar : ann.institution_name_fr;
  const stamp = getUtcTimestamp();
  const events: string[] = [];

  const targetDeadline = ann.deadline_date || ann.event_date;

  // 1. Primary Deadline Event (with 3-day & 1-day VALARM reminders)
  if (targetDeadline) {
    const startCompact = toCompactYmd(targetDeadline);
    const endCompact = getNextDayCompactYmd(targetDeadline);
    const summaryPrefix = ann.deadline_date
      ? isAr
        ? 'آخر أجل'
        : 'Dernier délai'
      : isAr
      ? 'موعد رسمي'
      : 'Date officielle';

    const descLines = [
      `${instName} (${ann.institution_code})`,
      isAr ? `تاريخ الانطلاق: ${ann.event_date}` : `Ouverture : ${ann.event_date}`,
      ann.deadline_date
        ? isAr
          ? `آخر أجل للترشيح: ${ann.deadline_date}`
          : `Dernier délai : ${ann.deadline_date}`
        : '',
      isAr ? `المصدر الرسمي: ${ann.source_url}` : `Source officielle : ${ann.source_url}`,
    ]
      .filter(Boolean)
      .join('\n');

    events.push(
      [
        'BEGIN:VEVENT',
        `UID:${ann.id}-deadline@jami3ati.ma`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${startCompact}`,
        `DTEND;VALUE=DATE:${endCompact}`,
        `SUMMARY:${escapeIcsText(`[جامعتي] ${summaryPrefix}: ${title}`)}`,
        `DESCRIPTION:${escapeIcsText(descLines)}`,
        `LOCATION:${escapeIcsText(instName)}`,
        `URL:${ann.source_url}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeIcsText(`${summaryPrefix}: ${title}`)}`,
        'TRIGGER:-P3D',
        'END:VALARM',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeIcsText(`${summaryPrefix}: ${title}`)}`,
        'TRIGGER:-P1D',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n')
    );
  }

  // 2. Opening Date Event (when distinct from deadline_date)
  if (ann.event_date && ann.deadline_date && ann.event_date !== ann.deadline_date) {
    const startCompact = toCompactYmd(ann.event_date);
    const endCompact = getNextDayCompactYmd(ann.event_date);
    const openPrefix = isAr ? 'انطلاق' : 'Ouverture';
    const descLines = [
      `${instName} (${ann.institution_code})`,
      isAr ? `آخر أجل للترشيح: ${ann.deadline_date}` : `Dernier délai : ${ann.deadline_date}`,
      isAr ? `المصدر الرسمي: ${ann.source_url}` : `Source officielle : ${ann.source_url}`,
    ].join('\n');

    events.push(
      [
        'BEGIN:VEVENT',
        `UID:${ann.id}-start@jami3ati.ma`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${startCompact}`,
        `DTEND;VALUE=DATE:${endCompact}`,
        `SUMMARY:${escapeIcsText(`[جامعتي] ${openPrefix}: ${title}`)}`,
        `DESCRIPTION:${escapeIcsText(descLines)}`,
        `LOCATION:${escapeIcsText(instName)}`,
        `URL:${ann.source_url}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeIcsText(`${openPrefix}: ${title}`)}`,
        'TRIGGER:-P1D',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n')
    );
  }

  return events;
}

function triggerIcsDownload(filename: string, vEvents: string[]): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jami3ati//Morocco University Deadlines//AR-FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Jami3ati - Concours & Deadlines',
    'X-WR-TIMEZONE:Africa/Casablanca',
    ...vEvents,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates a direct 1-click Google Calendar event template URL.
 */
export function getGoogleCalendarUrl(
  ann: OfficialAnnouncement,
  lang: Language,
  dateKind: 'deadline' | 'event' = 'deadline'
): string {
  const isAr = lang === 'ar';
  const title = isAr ? ann.title_ar : ann.title_fr;
  const instName = isAr ? ann.institution_name_ar : ann.institution_name_fr;

  const targetDate =
    dateKind === 'event' ? ann.event_date : ann.deadline_date || ann.event_date;

  const startCompact = toCompactYmd(targetDate);
  const endCompact = getNextDayCompactYmd(targetDate);

  const prefix =
    dateKind === 'event' || !ann.deadline_date
      ? isAr
        ? 'انطلاق'
        : 'Ouverture'
      : isAr
      ? 'آخر أجل'
      : 'Dernier délai';

  const details = [
    `${instName} (${ann.institution_code})`,
    isAr ? `تاريخ الانطلاق: ${ann.event_date}` : `Date d'ouverture : ${ann.event_date}`,
    ann.deadline_date
      ? isAr
        ? `آخر أجل للترشيح: ${ann.deadline_date}`
        : `Dernier délai : ${ann.deadline_date}`
      : '',
    isAr ? `الرابط الرسمي للتحقق: ${ann.source_url}` : `Lien officiel : ${ann.source_url}`,
  ]
    .filter(Boolean)
    .join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[جامعتي] ${prefix}: ${title}`,
    dates: `${startCompact}/${endCompact}`,
    details,
    location: instName,
    ctz: 'Africa/Casablanca',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Downloads an RFC 5545 .ics file for Apple Calendar / iCal / Outlook for a single announcement.
 */
export function downloadAnnouncementIcs(ann: OfficialAnnouncement, lang: Language): void {
  const events = buildAnnouncementVEvents(ann, lang);
  const safeCode = ann.institution_code.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerIcsDownload(`jami3ati_${safeCode}_deadline.ics`, events);
}

/**
 * Batch exports a list of announcements into one .ics calendar file.
 */
export function downloadAllAnnouncementsIcs(
  announcements: OfficialAnnouncement[],
  lang: Language
): void {
  const events = announcements.flatMap((ann) => buildAnnouncementVEvents(ann, lang));
  if (events.length === 0) return;
  triggerIcsDownload('jami3ati_all_deadlines.ics', events);
}

/**
 * Matches relevant verified announcements/deadlines for a specific University or Institution
 * so users can also add them directly from the DetailModal.
 */
export function getMatchingAnnouncementsForItem(
  item: University | Institution,
  itemType: 'university' | 'institution',
  announcements: OfficialAnnouncement[]
): OfficialAnnouncement[] {
  const code = item.code.toUpperCase();
  const univName =
    itemType === 'university'
      ? item.code.toUpperCase()
      : (item as Institution).university_id.toUpperCase();

  return announcements.filter((ann) => {
    const annCode = ann.institution_code.toUpperCase();

    // Direct match by code or university
    if (annCode === code || (univName.includes('UM5') && annCode === 'UM5')) {
      return true;
    }

    // National Tawjihi platform covers ENSA, ENCG, ENSAM, FST, EST
    if (
      annCode === 'MESRSI-TAWJIHI' &&
      ['ENSA', 'ENCG', 'ENSAM', 'FST', 'EST'].some((prefix) => code.includes(prefix))
    ) {
      return true;
    }

    // National Common Concours Medicine (FMP / FMD)
    if (
      annCode === 'FMP-COMMUN' &&
      ['FMP', 'FMD'].some((prefix) => code.includes(prefix))
    ) {
      return true;
    }

    // CNC Engineering Schools (EMI, ENSIAS, ENSEM, ENSAM, INSEA, EHTP, INPT)
    if (
      annCode === 'CNC-MAROC' &&
      ['EMI', 'ENSIAS', 'ENSEM', 'ENSAM', 'INSEA', 'EHTP', 'INPT'].some((prefix) =>
        code.includes(prefix)
      )
    ) {
      return true;
    }

    // Open-access UM5 faculties (FS, FSJES, FLSH under UM5)
    if (
      annCode === 'UM5' &&
      itemType === 'institution' &&
      (item as Institution).university_id === 'univ-um5-rabat' &&
      (item as Institution).admission_type === 'open'
    ) {
      return true;
    }

    return false;
  });
}

export interface CountdownInfo {
  daysLeft: number;
  label: string;
  tone: 'urgent' | 'upcoming' | 'open' | 'expired';
}

/**
 * Computes days remaining until a YYYY-MM-DD deadline relative to local today.
 */
export function getCountdownInfo(dateStr: string | undefined, isAr: boolean): CountdownInfo | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const [y, m, d] = parts;
  const targetUtc = Date.UTC(y, m - 1, d);
  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const daysLeft = Math.round((targetUtc - todayUtc) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      daysLeft,
      label: isAr ? 'انتهى الأجل' : 'Clôturé',
      tone: 'expired',
    };
  }
  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      label: isAr ? 'اليوم آخر أجل!' : 'Dernier jour !',
      tone: 'urgent',
    };
  }
  if (daysLeft <= 14) {
    return {
      daysLeft,
      label: isAr ? `متبقي ${daysLeft} يوم` : `J-${daysLeft} (Urgent)`,
      tone: 'urgent',
    };
  }
  if (daysLeft <= 45) {
    return {
      daysLeft,
      label: isAr ? `متبقي ${daysLeft} يوماً` : `J-${daysLeft}`,
      tone: 'upcoming',
    };
  }
  return {
    daysLeft,
    label: isAr ? `متبقي ${daysLeft} يوماً` : `Dans ${daysLeft} j`,
    tone: 'open',
  };
}

