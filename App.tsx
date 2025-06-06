
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedPrompt } from './components/GeneratedPrompt';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AlertMessage, AlertType } from './components/AlertMessage';
import { analyzeImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: AlertType } | null>(null);
  const [detailLevel, setDetailLevel] = useState<number>(3); // 1: Simple, 3: Moderate, 5: Very Detailed

  const [isModel3D, setIsModel3D] = useState<boolean>(false);
  const [isModelAsli, setIsModelAsli] = useState<boolean>(false);
  const [isModelAnime, setIsModelAnime] = useState<boolean>(false);
  const [isModelGreenScreen, setIsModelGreenScreen] = useState<boolean>(false);

  const handleImageSelected = useCallback((file: File, previewUrl: string, b64: string) => {
    setSelectedImageFile(file);
    setImagePreviewUrl(previewUrl);
    setImageBase64(b64);
    setGeneratedPrompt(null);
    setAlert(null);
  }, []);

  const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetailLevel(parseInt(event.target.value, 10));
  };

  const detailLevelDescriptors = [
    { level: 1, text: "Simple (Wan AI)" },
    { level: 2, text: "Concise (PIKA)" },
    { level: 3, text: "Moderate (Kling AI)" },
    { level: 4, text: "Detailed (VEO 2)" },
    { level: 5, text: "Very Detailed (Kling2.1 Or VEO 3)" },
  ];

  const handleAnalyzeImage = useCallback(async () => {
    if (!selectedImageFile || !imageBase64) {
      setAlert({ message: 'Please select an image first.', type: AlertType.Error });
      return;
    }

    setIsLoading(true);
    setGeneratedPrompt(null);
    setAlert(null);

    try {
      const promptText = await analyzeImageWithGemini(
        imageBase64, 
        selectedImageFile.type, 
        detailLevel,
        isModel3D,
        isModelAsli,
        isModelAnime,
        isModelGreenScreen
      );
      setGeneratedPrompt(promptText);
      setAlert({ message: 'Animation prompt generated successfully!', type: AlertType.Success });
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the image.';
      setAlert({ message: `Error: ${errorMessage}. Ensure API key is configured.`, type: AlertType.Error });
    } finally {
      setIsLoading(false);
    }
  }, [selectedImageFile, imageBase64, detailLevel, isModel3D, isModelAsli, isModelAnime, isModelGreenScreen]);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const checkboxOptions = [
    { id: "model3d", label: "Model 3D", description: "Realistic, photorealistic style.", checked: isModel3D, setter: setIsModel3D },
    { id: "modelasli", label: "Model Asli", description: "Visual effects, smooth & natural motion.", checked: isModelAsli, setter: setIsModelAsli },
    { id: "modelanime", label: "Model Anime", description: "Static hair, light particle overlay.", checked: isModelAnime, setter: setIsModelAnime },
    { id: "modelgreenscreen", label: "Mode Green Screen", description: "Vivid object motion, static green screen.", checked: isModelGreenScreen, setter: setIsModelGreenScreen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-sky-400 selection:text-sky-900">
      <div className="bg-slate-800/70 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-2xl space-y-8 transform transition-all duration-500 hover:shadow-sky-500/20">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-2">
            Image To Video Animations
          </h1>
          <p className="text-slate-400 text-md sm:text-lg">Upload Gambar Kamu Lalu Jadikan Prompt Animasi Videonya</p>
        </header>

        <ImageUploader
          onImageSelected={handleImageSelected}
          imagePreviewUrl={imagePreviewUrl}
          isLoading={isLoading}
        />

        {imagePreviewUrl && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            <fieldset className="space-y-3">
              <legend className="block text-sm font-medium text-slate-300 mb-2">Animation Style Modifiers:</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {checkboxOptions.map(opt => (
                  <div key={opt.id} className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id={opt.id}
                        name={opt.id}
                        type="checkbox"
                        checked={opt.checked}
                        onChange={(e) => opt.setter(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-500 text-sky-500 focus:ring-sky-500 bg-slate-700 focus:ring-offset-slate-800 disabled:opacity-50"
                        disabled={isLoading}
                        aria-describedby={`${opt.id}-description`}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor={opt.id} className="font-medium text-slate-200">
                        {opt.label}
                      </label>
                      <p id={`${opt.id}-description`} className="text-slate-400 text-xs">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
            
            <div className="space-y-3">
              <label htmlFor="detailLevel" className="block text-sm font-medium text-slate-300 mb-1">
                Prompt Detail Level:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-2 gap-y-1 mb-2 text-xs">
                {detailLevelDescriptors.map((desc) => (
                  <span
                    key={desc.level}
                    className={`text-center px-1 py-0.5 rounded-sm
                                ${detailLevel === desc.level 
                                  ? 'font-semibold text-sky-300 bg-sky-700/50' 
                                  : 'text-slate-400'
                                }`}
                  >
                    {desc.text}
                  </span>
                ))}
              </div>
              <input
                type="range"
                id="detailLevel"
                name="detailLevel"
                min="1"
                max="5"
                value={detailLevel}
                onChange={handleDetailChange}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-label="Prompt detail level"
              />
            </div>

            <button
              onClick={handleAnalyzeImage}
              disabled={isLoading || !selectedImageFile}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 00-3.09 3.09zM18.25 12L15.404 9.813a4.5 4.5 0 00-3.09-3.09L9.516 3.75l2.846.813a4.5 4.5 0 003.09 3.09L18.25 9l-.813 2.846a4.5 4.5 0 00-3.09 3.09L11.596 18l.813-2.846a4.5 4.5 0 003.09-3.09L18.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.516 3.75L9 5.25l-.516-1.5M18.25 9l1.5-.516L18.25 6M11.596 18l.516 1.5.516-1.5M5.25 9.516L3.75 9l1.5.516" />
              </svg>
              <span>Analyze for Animation</span>
            </button>
          </div>
        )}

        {alert && (
          <AlertMessage
            message={alert.message}
            type={alert.type}
            onClose={clearAlert}
          />
        )}
        
        {isLoading && <LoadingSpinner />}
        
        {generatedPrompt && !isLoading && (
          <GeneratedPrompt prompt={generatedPrompt} />
        )}
      </div>
      <footer className="text-center mt-10 mb-4 text-slate-500 text-sm space-y-1">
        <p>Powered by <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">Gemini API</a> & React</p>
        <p>Versi 1.0</p>
      </footer>
    </div>
  );
};

export default App;
