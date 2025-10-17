
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ARABIC_UI } from '../components/ui/constants/arabicUI';

// Assume process.env.API_KEY is available in the execution environment
const API_KEY = process.env.API_KEY;

const AskAIPage: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAskQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError(ARABIC_UI.errorEnterQuestion);
      return;
    }
    if (!API_KEY) {
      setError(ARABIC_UI.errorApiKeyMissing);
      console.error("API_KEY is not defined in process.env");
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
        config: {
          systemInstruction: ARABIC_UI.geminiSystemInstruction,
        },
      });
      
      setAnswer(response.text);
    } catch (e: any) {
      console.error("Error calling Gemini API:", e);
      setError(`${ARABIC_UI.errorApiGeneral}: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [question]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card title={ARABIC_UI.askAITitle}>
        <p className="mb-6 text-lg text-gray-700">
          {ARABIC_UI.askAIDescription}
        </p>
        
        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={ARABIC_UI.askAIPlaceholder}
            rows={6} // Increased rows for potentially longer Hadith texts
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-lg bg-white text-darkText"
            dir="rtl"
            aria-label={ARABIC_UI.askAIPlaceholder}
          />
          <Button onClick={handleAskQuestion} isLoading={isLoading} disabled={isLoading || !question.trim()} className="w-full">
            {isLoading ? ARABIC_UI.loading : ARABIC_UI.askAIButton}
          </Button>
        </div>

        {error && (
          <div role="alert" className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        {isLoading && !answer && !error && <LoadingSpinner />}

        {answer && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg shadow" aria-live="polite">
            <h3 className="text-xl font-semibold text-primary mb-3">{ARABIC_UI.aiAnswerTitle}</h3>
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-darkText text-right" dir="rtl">
              {answer}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AskAIPage;