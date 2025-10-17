
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white shadow-xl rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-primary">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;
