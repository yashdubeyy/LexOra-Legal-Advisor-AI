import React from 'react';

const LogoSVG: React.FC = () => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
        <stop offset="100%" stopColor="#4F46E5" /> {/* indigo-600 */}
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
    <path 
      d="M16 19l12-6-12-6-12 6 12 6z" 
      stroke="white" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <path 
      d="M16 19l8-4.5a15 15 0 01.8 8a14.5 14.5 0 01-8.8 3 14.5 14.5 0 01-8.8-3 15 15 0 01.8-8L16 19z" 
      stroke="white" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="26" cy="6" r="3" fill="#FBBF24" /> {/* amber-400 */}
  </svg>
);

export default LogoSVG;
