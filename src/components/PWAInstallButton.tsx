import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const PWAInstallButton: React.FC<Props> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isAr = lang === 'ar';

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#143D30] hover:bg-[#0f2e24] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        title={isAr ? 'تثبيت التطبيق على جهازك' : 'Installer l’application'}
      >
        <Download className="w-3.5 h-3.5 text-emerald-300" />
        <span>{isAr ? 'تثبيت التطبيق' : 'Installer'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-semibold rounded-lg transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#143D30]" />
          <span>{isAr ? 'تثبيت على iOS' : 'Installer iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 text-stone-800 text-start">
              <h3 className="text-base font-bold text-stone-900">
                {isAr ? 'تثبيت تطبيق جامعتي على iPhone / iPad' : 'Installer sur iPhone / iPad'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr ? (
                  <>
                    1. اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari.<br />
                    2. انزل لأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </>
                ) : (
                  <>
                    1. Appuyez sur le bouton <strong>Partager</strong> dans Safari.<br />
                    2. Sélectionnez <strong>Sur l’écran d’accueil</strong>.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-[#143D30] text-white text-xs font-semibold rounded-xl"
              >
                {isAr ? 'حسناً، فهمت' : 'Compris'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
