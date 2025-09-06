import React from 'react';

interface LogoProps {
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ height = 40, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width={height * 3} height={height} viewBox="0 0 180 60">
        {/* Stylized water drop with three colors - moved down and made smaller */}
        <path d="M100,10 C130,10 150,30 150,60 C150,90 130,110 100,110 C70,110 50,90 50,60 C50,30 70,10 100,10 Z" transform="scale(0.4) translate(50, 30)" fill="#4285F4" />
        <path d="M100,10 C130,10 150,30 150,60 C150,90 130,110 100,110 C70,110 50,90 50,60 C50,30 70,10 100,10 Z" transform="scale(0.3) translate(80, 60) rotate(15)" fill="#EA4335" />
        <path d="M100,10 C130,10 150,30 150,60 C150,90 130,110 100,110 C70,110 50,90 50,60 C50,30 70,10 100,10 Z" transform="scale(0.35) translate(20, 40) rotate(-15)" fill="#34A853" />
        
        {/* Company name - adjusted position */}
        <text x="80" y="35" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#0047AB">NOMAC</text>
        <text x="80" y="50" fontFamily="Arial, sans-serif" fontSize="12" fill="#0047AB">First Aid</text>
      </svg>
    </div>
  );
};

export default Logo;