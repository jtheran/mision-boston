
import React from 'react';

export const COLORS = {
  royalBlue: '#0038A8',
  yellow: '#FFD700',
  white: '#FFFFFF',
};

export const Logo = ({ className = "w-16 h-16" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center bg-white rounded-full border-4 border-[#0038A8] overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-[#FFD700] opacity-20"></div>
    <div className="z-10 flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#0038A8" strokeWidth="2" />
        <path d="M50 15 L50 85 M15 50 L85 50" stroke="#0038A8" strokeWidth="1" />
        <rect x="35" y="35" width="30" height="30" fill="#0038A8" rx="2" />
        <text x="50" y="58" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">MB</text>
      </svg>
    </div>
  </div>
);
