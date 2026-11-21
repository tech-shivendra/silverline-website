'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';
import { Theme } from '@/types';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'minimal' | 'dropdown';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = 'minimal'
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'minimal') {
    // Cycles through: Dark -> Light -> System
    const toggleCycle = () => {
      if (theme === 'dark') setTheme('light');
      else if (theme === 'light') setTheme('system');
      else setTheme('dark');
    };

    return (
      <button
        type="button"
        onClick={toggleCycle}
        className={cn(
          'p-2 rounded-lg bg-surface border border-border text-muted hover:text-white transition-all duration-200 relative group',
          className
        )}
        title={`Current: ${theme} theme (click to switch)`}
        aria-label="Toggle visual theme"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-4 w-4 text-accent-blue transition-transform group-hover:rotate-12" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-transform group-hover:rotate-45" />
        )}
      </button>
    );
  }

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-muted hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-label="Theme selection menu"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-3.5 w-3.5 text-accent-blue" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
        <span className="capitalize">{theme}</span>
        <ChevronDown className="h-3 w-3 text-muted-dark" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-surface-elevated border border-border shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 text-xs font-mono text-left transition-colors',
              theme === 'dark' ? 'text-accent-blue bg-surface font-semibold' : 'text-muted hover:text-white'
            )}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 text-xs font-mono text-left transition-colors',
              theme === 'light' ? 'text-accent-blue bg-surface font-semibold' : 'text-muted hover:text-white'
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 text-xs font-mono text-left transition-colors',
              theme === 'system' ? 'text-accent-blue bg-surface font-semibold' : 'text-muted hover:text-white'
            )}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
};
