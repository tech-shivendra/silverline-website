import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'metallic';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      href,
      external,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-silver/50 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 rounded-md gap-1.5 font-mono tracking-wider',
      md: 'text-sm px-5 py-2.5 rounded-lg gap-2',
      lg: 'text-base px-7 py-3.5 rounded-lg gap-2.5 font-medium'
    };

    const variantStyles = {
      primary:
        'bg-white text-background-primary hover:bg-silver-light shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]',
      secondary:
        'bg-surface-elevated text-white hover:bg-surface border border-border hover:border-silver/40',
      outline:
        'bg-transparent text-silver border border-border hover:border-silver hover:text-white',
      ghost:
        'bg-transparent text-muted hover:text-white hover:bg-surface/50',
      metallic:
        'bg-gradient-to-r from-[#20242B] via-[#2A303A] to-[#20242B] text-white border border-silver/30 hover:border-silver shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    };

    const classes = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
