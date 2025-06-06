
import React, { useState, useCallback } from 'react';

interface GeneratedPromptProps {
  prompt: string;
}

const CopyIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625m0 0H12m3.75 0l-3.75-3.75M12 17.25h3.75" />
  </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


export const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy prompt:', err);
        // Optionally show an error message to the user
      }
    }
  }, [prompt]);

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="text-xl font-semibold text-sky-300">Generated Prompt:</h3>
      <div className="relative bg-slate-700/50 p-4 rounded-lg shadow-inner">
        <p className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
          {prompt}
        </p>
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy prompt"}
          className={`absolute top-2 right-2 p-2 rounded-md transition-all duration-200 
                      ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-sky-600 hover:bg-sky-500'} 
                      text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75`}
        >
          {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
