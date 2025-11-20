
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { QUIZ_QUESTIONS } from '../components/ui/constants/quizData';
import { useLanguage } from '../contexts/LanguageContext';

const QuizPage: React.FC = () => {
  const { t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleAnswerClick = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
    setIsAnswerChecked(true);

    if (index === QUIZ_QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  if (!gameStarted) {
      return (
          <div className="max-w-2xl mx-auto text-center py-12">
              <Card className="animate-fade-in p-10">
                   <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                       🧠
                   </div>
                   <h1 className="text-3xl font-bold text-primary mb-4">{t.quizTitle}</h1>
                   <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                       {t.quizDescription}
                   </p>
                   <Button size="lg" onClick={() => setGameStarted(true)} className="w-full sm:w-auto px-12">
                       {t.quizStart} 🚀
                   </Button>
              </Card>
          </div>
      );
  }

  if (showScore) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 animate-slide-up">
        <Card className="p-10 border-2 border-primary">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-4">{t.quizScore}</h2>
          <p className="text-4xl font-bold text-primary mb-6">
            {score} / {QUIZ_QUESTIONS.length}
          </p>
          <div className="mb-8">
              {score === QUIZ_QUESTIONS.length ? (
                  <p className="text-emerald-600 font-bold">ماشالله! ممتاز 🌟</p>
              ) : score > QUIZ_QUESTIONS.length / 2 ? (
                  <p className="text-blue-600 font-bold">أحسنت! جيد جداً 👍</p>
              ) : (
                  <p className="text-gray-600">حاول مرة أخرى لتتعلم أكثر 📚</p>
              )}
          </div>
          <Button onClick={resetQuiz} size="lg">
            {t.quizRestart} ↺
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
           <span>{t.quizQuestion} {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
           <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">Score: {score}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
      </div>

      <Card className="mb-8 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-8 leading-relaxed font-amiri">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-primary/50 hover:bg-gray-50";
            
            if (isAnswerChecked) {
                if (index === currentQuestion.correctAnswer) {
                    buttonStyle = "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-500";
                } else if (index === selectedAnswer) {
                    buttonStyle = "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/40 dark:text-red-300 dark:border-red-500";
                } else {
                    buttonStyle = "opacity-50 cursor-not-allowed";
                }
            }

            return (
                <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={isAnswerChecked}
                    className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 font-medium text-lg ${buttonStyle}`}
                >
                    <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswerChecked && index === currentQuestion.correctAnswer && <span>✅</span>}
                        {isAnswerChecked && index === selectedAnswer && index !== currentQuestion.correctAnswer && <span>❌</span>}
                    </div>
                </button>
            );
          })}
        </div>

        {isAnswerChecked && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-slide-up">
                <div className={`p-4 rounded-xl mb-4 ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    <p className="font-bold mb-1">
                        {selectedAnswer === currentQuestion.correctAnswer ? t.quizCorrect : t.quizWrong}
                    </p>
                    <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
                </div>
                <Button onClick={handleNextQuestion} className="w-full">
                    {t.quizNext} →
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
};

export default QuizPage;
