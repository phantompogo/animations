
import React, { useRef, useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string, base64: string) => void;
  imagePreviewUrl: string | null;
  isLoading: boolean;
}

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-12 h-12 text-slate-500 group-hover:text-sky-400 transition-colors"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75m3.75 0V21a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 21V5.25A2.25 2.25 0 015.25 3h9.75l2.25 2.25H15.75zM12 3v3.75m0 0c-1.036 0-2 .984-2 2.25s.964 2.25 2 2.25 2-.984 2-2.25S13.036 3.75 12 3.75z" />
  </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, imagePreviewUrl, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        const base64 = previewUrl.split(',')[1];
        onImageSelected(file, previewUrl, base64);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow re-uploading the same file
    if (event.target) {
        event.target.value = ""; 
    }
  }, [onImageSelected]);

  const handleAreaClick = useCallback(() => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  }, [isLoading]);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isLoading) setIsDragging(true);
  }, [isLoading]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (isLoading) return;

    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        const base64 = previewUrl.split(',')[1];
        onImageSelected(file, previewUrl, base64);
      };
      reader.readAsDataURL(file);
    }
  }, [isLoading, onImageSelected]);


  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={isLoading}
      />
      <div
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group w-full p-6 border-2 border-dashed rounded-lg transition-all duration-300 ease-in-out
                    ${isLoading ? 'cursor-not-allowed bg-slate-700/50 border-slate-600' : 'cursor-pointer hover:border-sky-500 hover:bg-slate-700/50'}
                    ${isDragging ? 'border-sky-500 bg-slate-700/70 scale-105' : 'border-slate-600 bg-slate-700/30'}
                    flex flex-col items-center justify-center text-center min-h-[150px]`}
      >
        {imagePreviewUrl && !isDragging ? (
          <img src={imagePreviewUrl} alt="Preview" className="max-h-48 w-auto object-contain rounded-md shadow-lg" />
        ) : (
          <>
            <UploadIcon className={`w-10 h-10 mb-3 ${isDragging ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400'} transition-colors`} />
            <p className={`font-semibold ${isDragging ? 'text-sky-300' : 'text-slate-300 group-hover:text-sky-300'} transition-colors`}>
              {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">PNG, JPG, GIF, WEBP</p>
          </>
        )}
      </div>
      {imagePreviewUrl && (
         <button
            onClick={handleAreaClick} // Re-opens file dialog
            disabled={isLoading}
            className="text-sm text-sky-400 hover:text-sky-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors w-full text-center mt-2"
          >
            Change image
        </button>
      )}
    </div>
  );
};
