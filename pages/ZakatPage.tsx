
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

const ZakatPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Money State
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cashZakat, setCashZakat] = useState<number | null>(null);

  // Gold State
  const [goldPrice, setGoldPrice] = useState<string>('');
  const [goldWeight, setGoldWeight] = useState<string>('');
  const [goldZakat, setGoldZakat] = useState<number | null>(null);
  const [goldNisabReached, setGoldNisabReached] = useState<boolean | null>(null);

  const calculateCashZakat = () => {
    const amount = parseFloat(cashAmount);
    if (!isNaN(amount)) {
      // Usually Zakat is due if amount > Nisab. 
      // For simplicity, we calculate 2.5% and let user decide if they reached Nisab
      // OR we can ask for Gold price to calc Nisab for cash too.
      // Let's stick to simple 2.5% calculation as requested.
      setCashZakat(amount * 0.025);
    }
  };

  const calculateGoldZakat = () => {
    const price = parseFloat(goldPrice);
    const weight = parseFloat(goldWeight);
    
    if (!isNaN(price) && !isNaN(weight)) {
      if (weight >= 85) {
        const totalValue = weight * price;
        setGoldZakat(totalValue * 0.025);
        setGoldNisabReached(true);
      } else {
        setGoldZakat(0);
        setGoldNisabReached(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div className="text-center animate-fade-in">
        <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-4 text-yellow-600 dark:text-yellow-400 shadow-lg">
            <span className="text-3xl">💰</span>
        </div>
        <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-2 font-amiri">{t.zakatPageTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.zakatDescription}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Money Zakat */}
        <Card className="animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                💵 {t.zakatMoneyTitle}
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.zakatEnterAmount}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                        />
                        <span className="absolute right-3 top-3 text-gray-400 text-sm">{t.currency}</span>
                    </div>
                </div>
                <Button onClick={calculateCashZakat} disabled={!cashAmount} className="w-full">
                    {t.zakatCalculate}
                </Button>
                
                {cashZakat !== null && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800 text-center">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">{t.zakatResultDue}</p>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                            {cashZakat.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-base font-normal">{t.currency}</span>
                        </p>
                    </div>
                )}
            </div>
        </Card>

        {/* Gold Zakat */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                🥇 {t.zakatGoldTitle}
            </h2>
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.zakatEnterGoldPrice}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={goldPrice}
                            onChange={(e) => setGoldPrice(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                        />
                         <span className="absolute right-3 top-3 text-gray-400 text-sm">{t.currency}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.zakatEnterGoldWeight}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={goldWeight}
                            onChange={(e) => setGoldWeight(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                        />
                        <span className="absolute right-3 top-3 text-gray-400 text-sm">{t.gram}</span>
                    </div>
                </div>

                <Button onClick={calculateGoldZakat} disabled={!goldPrice || !goldWeight} className="w-full" variant="secondary">
                    {t.zakatCalculate}
                </Button>
                
                {goldNisabReached === false && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl text-center">
                         <p className="text-gray-500">{t.zakatNotDue}</p>
                         <p className="text-xs text-gray-400 mt-1">{t.zakatGoldNisabNote}</p>
                    </div>
                )}

                {goldNisabReached === true && goldZakat !== null && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-100 dark:border-amber-800 text-center">
                        <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">{t.zakatResultDue}</p>
                        <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                            {goldZakat.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-base font-normal">{t.currency}</span>
                        </p>
                    </div>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default ZakatPage;
