import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', noPadding = false, style }) => {
  return (
    <div 
      // Removed 'backdrop-blur-sm' and 'border-white/50' transparency which lags on low RAM devices
      className={`bg-white dark:bg-darkSurface rounded-3xl shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-200 overflow-hidden ${className}`}
      style={style}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
          <h3 className="text-xl font-bold text-primary-dark dark:text-primary-light">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5 sm:p-6'}>{children}</div>
    </div>
  );
};

export default Card;