import React, { useRef } from 'react';

interface FileUploadProps {
  accept?: string;
  onChange?: (file: File | null) => void;
  error?: boolean;
  className?: string;
  id?: string;
  label?: string;
  preview?: string | null;
  onRemove?: () => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  onChange,
  error = false,
  className = '',
  id,
  label = 'Upload File',
  preview,
  onRemove,
  maxSize,
  acceptedTypes,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file size
      if (maxSize && file.size > maxSize) {
        alert(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file type
      if (acceptedTypes && !acceptedTypes.includes(file.type)) {
        alert(`File type must be one of: ${acceptedTypes.join(', ')}`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }

    onChange?.(file);
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id={id}
      />
      
      {preview ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-slate-700"
            />
            {onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <label
            htmlFor={id}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 cursor-pointer transition-colors"
          >
            Change File
          </label>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            error
              ? 'bg-red-600/20 border border-red-500 text-red-400 hover:bg-red-600/30'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default FileUpload;











