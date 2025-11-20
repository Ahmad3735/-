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
      className={`bg-white dark:bg-darkSurface rounded-3xl shadow-lg dark:shadow-black/20 border border-white/50 dark:border-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl overflow-hidden ${className}`}
      style={style}
    >
      {title && (
        <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-slate-800/30">
          <h3 className="text-xl font-bold text-primary-dark dark:text-primary-light">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6 sm:p-8'}>{children}</div>
    </div>
  );
};

export default Card;