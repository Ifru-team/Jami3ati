import React, { useState } from 'react';
import { Phone, Copy, Check } from 'lucide-react';
import { formatMoroccanPhone, getCleanTelUrl } from '../utils/phoneUtils';
import { Language } from '../types';

interface PhoneDisplayProps {
  phone: string | null | undefined;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
  showCallButton?: boolean;
  showCopyButton?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  phone,
  lang = 'ar',
  size = 'md',
  showCallButton = true,
  showCopyButton = true,
  showBadge = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  if (!phone || !phone.trim()) {
    return (
      <span className={`text-stone-400 italic font-normal ${size === 'sm' ? 'text-xs' : 'text-sm'} ${className}`}>
        {isAr ? 'غير متاح' : 'Non disponible'}
      </span>
    );
  }

  const formattedPhone = formatMoroccanPhone(phone);
  const telUrl = getCleanTelUrl(phone);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formattedPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5 gap-1.5',
    md: 'text-xs sm:text-sm py-1 px-2.5 gap-2',
    lg: 'text-sm sm:text-base py-1.5 px-3 gap-2.5',
  };

  return (
    <div className={`inline-flex items-center flex-wrap gap-2 ${className}`}>
      {/* Phone container forced to LTR so Arabic text direction doesn't reverse +212 or spacing */}
      <div
        dir="ltr"
        style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
        className={`inline-flex items-center bg-stone-100 hover:bg-stone-200/80 text-stone-900 border border-stone-200 rounded-lg transition-colors font-mono font-medium ${sizeClasses[size]}`}
      >
        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0 select-none" />
        <span className="tracking-wide select-all text-stone-900 font-semibold">{formattedPhone}</span>

        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className="ms-1 p-1 text-stone-500 hover:text-stone-900 transition-colors rounded hover:bg-white/60 focus:outline-none focus:ring-1 focus:ring-stone-400"
            title={copied ? (isAr ? 'تم النسخ!' : 'Copié !') : (isAr ? 'نسخ رقم الهاتف' : 'Copier')}
            aria-label={isAr ? 'نسخ رقم الهاتف' : 'Copier le numéro'}
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {showCallButton && (
        <a
          href={telUrl}
          onClick={(e) => e.stopPropagation()}
          dir="ltr"
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all shadow-xs hover:shadow focus:ring-2 focus:ring-emerald-500/50"
          title={isAr ? 'اتصال مباشر' : 'Appeler'}
        >
          <Phone className="w-3 h-3" />
          <span>{isAr ? 'اتصل الآن' : 'Appeler'}</span>
        </a>
      )}

      {showBadge && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
          {isAr ? 'هاتف معتمد' : 'Téléphone vérifié'}
        </span>
      )}
    </div>
  );
};
