import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ error = false, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-700 focus:ring-blue-500'
        } ${className}`}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;





