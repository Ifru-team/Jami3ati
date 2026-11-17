/**
 * Helper utility for formatting and rendering Moroccan verified phone numbers.
 * Ensures proper LTR (Left-To-Right) directionality in Arabic/RTL contexts,
 * prevents visual text reversal (+212 5xx -> 212 5xx+), and provides clean tel: links.
 */

export function formatMoroccanPhone(phone: string | null | undefined): string {
  if (!phone || !phone.trim()) return '';

  let cleaned = phone.trim();

  // Standardize Moroccan prefix format
  if (cleaned.startsWith('0')) {
    cleaned = '+212 ' + cleaned.substring(1);
  }

  // Insert spacing if missing spaces (e.g., +212537771834 -> +212 537 77 18 34)
  const numericOnly = cleaned.replace(/\s+/g, '');
  if (/^\+212\d{9}$/.test(numericOnly)) {
    const country = numericOnly.substring(0, 4); // +212
    const code = numericOnly.substring(4, 5);    // 5 or 6 or 7
    const part1 = numericOnly.substring(5, 7);
    const part2 = numericOnly.substring(7, 9);
    const part3 = numericOnly.substring(9, 11);
    return `${country} ${code}${part1} ${part2} ${part3}`;
  }

  return cleaned;
}

/**
 * Returns clean tel: protocol URL for direct phone dialing
 */
export function getCleanTelUrl(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}
