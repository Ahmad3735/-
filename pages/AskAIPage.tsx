import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

const AskAIPage: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { t, lang } = useLanguage();

  const handleAskQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError(t.errorEnterQuestion);
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
        config: {
          systemInstruction: t.geminiSystemInstruction(lang),
        },
      });
      setAnswer(response.text);
    } catch (e: any) {
      setError(t.errorApiGeneral);
    } finally {
      setIsLoading(false);
    }
  }, [question, t, lang]);

  return (
    <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
             <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                🤖
             </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t.askAITitle}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t.askAIDescription}</p>
        </div>

        <Card className="mb-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="space-y-4">
                 <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.askAIPlaceholder}
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none transition-all"
                />
                <div className="flex justify-end">
                    <Button 
                        onClick={handleAskQuestion} 
                        isLoading={isLoading} 
                        disabled={isLoading || !question.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30"
                    >
                        {t.askAIButton}
                    </Button>
                </div>
            </div>
        </Card>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-6 animate-fade-in">
            {error}
          </div>
        )}

        {answer && (
          <div className="animate-slide-up">
              <div className="flex items-start gap-4">
                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                       AI
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 flex-grow">
                       <h3 className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wide">{t.aiAnswerTitle}</h3>
                       <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
                           {answer}
                       </div>
                   </div>
              </div>
          </div>
        )}
    </div>
  );
};

export default AskAIPage;