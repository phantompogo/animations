
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-4 animate-fade-in" aria-label="Loading...">
      <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Analyzing your image...</p>
    </div>
  );
};
