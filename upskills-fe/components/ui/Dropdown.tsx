import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../Icons';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  buttonClassName = '',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${buttonClassName}`}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 text-slate-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left text-slate-300 hover:bg-slate-700 transition-colors ${
                  value === option.value ? 'bg-slate-700 text-white' : ''
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;




