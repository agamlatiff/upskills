import React from 'react';

interface InputErrorProps {
  messages?: string | string[];
  className?: string;
}

export const InputError: React.FC<InputErrorProps> = ({
  messages,
  className = '',
}) => {
  if (!messages) return null;

  const messageArray = Array.isArray(messages) ? messages : [messages];

  return (
    <div className={`mt-1 ${className}`}>
      {messageArray.map((message, index) => (
        <p key={index} className="text-xs text-red-400">
          {message}
        </p>
      ))}
    </div>
  );
};

export default InputError;


