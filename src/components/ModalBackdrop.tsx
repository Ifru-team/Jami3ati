import React, { ReactNode } from 'react';

interface Props {
  onClose: () => void;
  children: ReactNode;
  ariaLabelledBy?: string;
  className?: string;
  mobileBottomSheet?: boolean;
}

/**
 * Consistent fixed-position modal backdrop component with rgba(0,0,0,0.5) overlay
 * and centered content alignment (or bottom-sheet alignment on mobile when enabled).
 */
export const ModalBackdrop: React.FC<Props> = ({
  onClose,
  children,
  ariaLabelledBy,
  className = '',
  mobileBottomSheet = false,
}) => {
  return (
    <div
      className={`fixed inset-0 flex ${
        mobileBottomSheet ? 'items-end sm:items-center p-0 sm:p-6' : 'items-center p-3 sm:p-6'
      } justify-center z-50 bg-[rgba(0,0,0,0.5)] select-none animate-in fade-in duration-150 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
};
