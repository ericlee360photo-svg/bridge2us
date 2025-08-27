'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'blue' | 'gray';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    white: 'border-white',
    blue: 'border-blue-500',
    gray: 'border-gray-500'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        border-2 border-t-transparent rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LoadingState({ 
  message = 'Loading...', 
  children,
  className = ''
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <LoadingSpinner size="lg" />
      <p className="mt-3 text-gray-600 text-sm">{message}</p>
      {children}
    </div>
  );
}
