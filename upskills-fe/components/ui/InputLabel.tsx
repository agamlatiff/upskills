import React from 'react';

interface InputLabelProps {
  htmlFor?: string;
  value?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const InputLabel: React.FC<InputLabelProps> = ({
  htmlFor,
  value,
  required = false,
  className = '',
  children,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-slate-300 mb-2 ${className}`}
    >
      {children || value}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
};

export default InputLabel;








