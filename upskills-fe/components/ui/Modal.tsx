import React, { useEffect } from 'react';
import { XIcon } from '../Icons';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  children,
  maxWidth = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && show) {
        onClose();
      }
    };

    if (show && closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, closeOnEscape, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || closeOnEscape) && (
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            {title && (
              <h3 className="text-xl font-bold text-white">{title}</h3>
            )}
            {closeOnEscape && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;


