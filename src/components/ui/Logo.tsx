import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className,
  showWordmark = true,
  size = 'md'
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 44, text: 'text-2xl' }
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-silver/50 rounded-sm',
        className
      )}
      aria-label="SilverLine Studio Home"
    >
      {/* Abstract Continuous Geometric Silver Line S Symbol */}
      <div className="relative flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        >
          <defs>
            <linearGradient id="silverGradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#C6C9CE" />
              <stop offset="100%" stopColor="#858B94" />
            </linearGradient>
            <linearGradient id="glowGradient" x1="0" y1="24" x2="48" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8DA8FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C6C9CE" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Outer framing geometric brackets */}
          <path
            d="M 12 6 H 6 V 12"
            stroke="#282C33"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 36 42 H 42 V 36"
            stroke="#282C33"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Continuous SilverLine geometric S curve */}
          <path
            d="M 34 14 C 34 9.58 30.42 6 26 6 H 18 C 12.48 6 8 10.48 8 16 C 8 21.52 12.48 24 18 24 H 30 C 35.52 24 40 26.48 40 32 C 40 37.52 35.52 42 30 42 H 22 C 17.58 42 14 38.42 14 34"
            stroke="url(#silverGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Focal Precision Point */}
          <circle
            cx="24"
            cy="24"
            r="2"
            fill="#8DA8FF"
            className="transition-all duration-300 group-hover:fill-white"
          />
        </svg>
      </div>

      {showWordmark && (
        <span className={cn('font-heading font-semibold tracking-tight text-white flex items-center', textSize)}>
          SILVER<span className="text-silver font-light">LINE</span>
          <span className="ml-1.5 inline-block h-1 w-1 rounded-full bg-accent-blue" />
        </span>
      )}
    </Link>
  );
};
