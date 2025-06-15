
import React from 'react';

export enum AlertType {
  Error = 'error',
  Success = 'success',
  Info = 'info',
}

interface AlertMessageProps {
  message: string;
  type: AlertType;
  onClose?: () => void;
}

const typeClasses = {
  [AlertType.Error]: 'bg-red-500/20 border-red-500 text-red-300',
  [AlertType.Success]: 'bg-green-500/20 border-green-500 text-green-300',
  [AlertType.Info]: 'bg-sky-500/20 border-sky-500 text-sky-300',
};

const Icon: React.FC<{ type: AlertType }> = ({ type }) => {
  if (type === AlertType.Error) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    );
  }
  if (type === AlertType.Success) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return ( // Info icon
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
};


export const AlertMessage: React.FC<AlertMessageProps> = ({ message, type, onClose }) => {
  return (
    <div 
      className={`flex items-start p-4 rounded-md border animate-fade-in ${typeClasses[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        <Icon type={type} />
      </div>
      <div className="flex-grow text-sm">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 -my-1 -mr-1 p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
