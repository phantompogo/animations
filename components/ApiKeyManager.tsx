
import React from 'react';

interface ApiKeyManagerProps {
  apiKeyOption: 'default' | 'custom';
  userApiKeyInput: string;
  storedUserApiKey: string | null;
  onApiOptionChange: (option: 'default' | 'custom') => void;
  onUserApiKeyInputChange: (key: string) => void;
  onSaveUserApiKey: () => void;
  onDeleteUserApiKey: () => void;
  isLoading: boolean;
  isDefaultKeyAvailable: boolean;
}

const KeyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  apiKeyOption,
  userApiKeyInput,
  storedUserApiKey,
  onApiOptionChange,
  onUserApiKeyInputChange,
  onSaveUserApiKey,
  onDeleteUserApiKey,
  isLoading,
  isDefaultKeyAvailable
}) => {
  return (
    <div className="p-4 border border-slate-700 rounded-lg space-y-4 bg-slate-800/50 animate-fade-in">
      <fieldset className="space-y-3">
        <legend className="text-md font-semibold text-slate-200 mb-2 flex items-center">
            <KeyIcon className="w-5 h-5 mr-2 text-sky-400"/>
            Pilih Sumber API Key Gemini
        </legend>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <label
            htmlFor="apiOptionDefault"
            className={`flex-1 p-3 rounded-md border-2 transition-all duration-200 cursor-pointer
                        ${apiKeyOption === 'default' ? 'bg-sky-600/30 border-sky-500 shadow-md' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}
                        ${isLoading || !isDefaultKeyAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              id="apiOptionDefault"
              name="apiKeyOption"
              value="default"
              checked={apiKeyOption === 'default'}
              onChange={() => onApiOptionChange('default')}
              className="sr-only"
              disabled={isLoading || !isDefaultKeyAvailable}
              aria-describedby="default-api-desc"
            />
            <span className="font-medium text-slate-100 block">Gunakan API Utama (Bawaan)</span>
            {!isDefaultKeyAvailable && <span id="default-api-desc" className="text-xs text-yellow-400 block mt-1">API Utama tidak terkonfigurasi di web ini.</span>}
             {isDefaultKeyAvailable && <span id="default-api-desc" className="text-xs text-slate-400 block mt-1">Menggunakan API Key yang disediakan oleh aplikasi.</span>}
          </label>

          <label
            htmlFor="apiOptionCustom"
            className={`flex-1 p-3 rounded-md border-2 transition-all duration-200 cursor-pointer
                        ${apiKeyOption === 'custom' ? 'bg-sky-600/30 border-sky-500 shadow-md' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}
                        ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              id="apiOptionCustom"
              name="apiKeyOption"
              value="custom"
              checked={apiKeyOption === 'custom'}
              onChange={() => onApiOptionChange('custom')}
              className="sr-only"
              disabled={isLoading}
            />
            <span className="font-medium text-slate-100 block">Gunakan API Saya Sendiri</span>
            <span className="text-xs text-slate-400 block mt-1">Masukkan API Key Gemini Anda sendiri.</span>
          </label>
        </div>
      </fieldset>

      {apiKeyOption === 'custom' && (
        <div className="space-y-3 pt-2 animate-fade-in">
          <div>
            <label htmlFor="userApiKey" className="block text-sm font-medium text-slate-300 mb-1">
              API Key Gemini Anda:
            </label>
            <input
              type="password"
              id="userApiKey"
              name="userApiKey"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-200 disabled:opacity-50"
              placeholder="Masukkan API Key Anda di sini"
              value={userApiKeyInput}
              onChange={(e) => onUserApiKeyInputChange(e.target.value)}
              disabled={isLoading}
              aria-label="Gemini API Key Input"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            <button
              onClick={onSaveUserApiKey}
              disabled={isLoading || !userApiKeyInput.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Simpan API Saya
            </button>
            {storedUserApiKey && (
              <button
                onClick={onDeleteUserApiKey}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Hapus API Tersimpan
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">
            API Key Anda akan disimpan dengan aman di browser Anda (local storage) dan tidak akan dikirim ke server kami selain untuk otentikasi dengan Google Gemini.
          </p>
        </div>
      )}
    </div>
  );
};
