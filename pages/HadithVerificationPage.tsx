import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

const HadithVerificationPage: React.FC = () => {
  const [hadithText, setHadithText] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const location = useLocation();
  const verificationTriggeredRef = useRef(false);
  const { t, lang } = useLanguage();

  const handleVerifyHadith = useCallback(async (textToVerify: string) => {
    if (!textToVerify.trim()) {
      setError(t.errorEnterHadith);
      return;
    }

    setIsLoading(true);
    setError('');
    setVerificationResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: textToVerify,
        config: {
          systemInstruction: t.geminiHadithVerificationInstruction(lang),
        },
      });
      
      setVerificationResult(response.text);
    } catch (e: any) {
      setError(t.errorApiGeneral);
    } finally {
      setIsLoading(false);
    }
  }, [t, lang]);
  
  useEffect(() => {
    const prefilledText = location.state?.hadithText;
    if (prefilledText && !verificationTriggeredRef.current) {
        verificationTriggeredRef.current = true;
        setHadithText(prefilledText);
        handleVerifyHadith(prefilledText);
    }
  }, [location.state, handleVerifyHadith]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2">{t.hadithVerificationPageTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.hadithVerificationDescription}</p>
      </div>

      <Card className="mb-8">
          <div className="relative">
            <textarea
                value={hadithText}
                onChange={(e) => setHadithText(e.target.value)}
                placeholder={t.hadithVerificationPlaceholder}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg bg-white text-darkText font-amiri dark:bg-slate-800 dark:text-lightText dark:border-gray-600"
            />
             <div className="absolute bottom-4 left-4">
                  <Button 
                    onClick={() => handleVerifyHadith(hadithText)} 
                    isLoading={isLoading} 
                    disabled={isLoading || !hadithText.trim()} 
                  >
                    {t.hadithVerificationButtonText}
                  </Button>
             </div>
          </div>
      </Card>

      {error && (
          <div role="alert" className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

      {verificationResult && (
          <div className="animate-slide-up relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-4 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                 <span className="text-2xl">✅</span>
             </div>
            <Card className="bg-green-50/50 dark:bg-slate-800/50 border-green-100 dark:border-green-900/30">
                 <h3 className="text-lg font-bold text-primary dark:text-primary-light mb-4 border-b border-green-100 dark:border-slate-700 pb-2">{t.hadithVerificationResultTitle}</h3>
                 <div className="prose dark:prose-invert max-w-none text-lg text-gray-800 dark:text-gray-200 leading-loose font-kufi">
                   {verificationResult}
                 </div>
            </Card>
          </div>
        )}
    </div>
  );
};

export default HadithVerificationPage;