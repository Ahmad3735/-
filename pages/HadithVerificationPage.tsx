
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ARABIC_UI } from '../components/ui/constants/arabicUI';

// Assume process.env.API_KEY is available in the execution environment
const API_KEY = process.env.API_KEY;

const HadithVerificationPage: React.FC = () => {
  const [hadithText, setHadithText] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleVerifyHadith = useCallback(async () => {
    if (!hadithText.trim()) {
      setError(ARABIC_UI.errorEnterHadith);
      return;
    }
    if (!API_KEY) {
      setError(ARABIC_UI.errorApiKeyMissing);
      console.error("API_KEY is not defined in process.env");
      return;
    }

    setIsLoading(true);
    setError('');
    setVerificationResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: hadithText,
        config: {
          systemInstruction: ARABIC_UI.geminiHadithVerificationInstruction,
        },
      });
      
      setVerificationResult(response.text);
    } catch (e: any) {
      console.error("Error calling Gemini API for Hadith verification:", e);
      setError(`${ARABIC_UI.errorApiGeneral}: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [hadithText]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card title={ARABIC_UI.hadithVerificationPageTitle}>
        <p className="mb-6 text-lg text-gray-700 text-right" dir="rtl">
          {ARABIC_UI.hadithVerificationDescription}
        </p>
        
        <div className="space-y-4">
          <textarea
            value={hadithText}
            onChange={(e) => setHadithText(e.target.value)}
            placeholder={ARABIC_UI.hadithVerificationPlaceholder}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-lg bg-white text-darkText font-kufi"
            dir="rtl"
            aria-label={ARABIC_UI.hadithVerificationPlaceholder}
          />
          <Button 
            onClick={handleVerifyHadith} 
            isLoading={isLoading} 
            disabled={isLoading || !hadithText.trim()} 
            className="w-full text-xl py-3"
            aria-live="polite" // Announces changes when loading state changes
            aria-busy={isLoading}
          >
            {isLoading ? ARABIC_UI.hadithVerificationLoading : ARABIC_UI.hadithVerificationButtonText}
          </Button>
        </div>

        {error && (
          <div role="alert" className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center text-lg" dir="rtl">
            {error}
          </div>
        )}

        {isLoading && !verificationResult && !error && <LoadingSpinner size="md" />}

        {verificationResult && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg shadow" aria-live="polite">
            <h3 className="text-2xl font-semibold text-primary mb-4 text-right" dir="rtl">{ARABIC_UI.hadithVerificationResultTitle}</h3>
            <div className="whitespace-pre-wrap text-xl leading-loose text-darkText text-right font-kufi" dir="rtl">
              {verificationResult}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HadithVerificationPage;