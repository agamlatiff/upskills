import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  className?: string;
  options?: SelectOption[];
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className = '', options, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-700 focus:ring-blue-500'
        } ${className}`}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;




