import React from 'react';
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'status' | 'category' | 'outline' | 'tech';
  status?: ProjectStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'category',
  status,
  className
}) => {
  const statusStyles: Record<ProjectStatus, string> = {
    live: 'bg-[#8EC7A5]/10 text-[#8EC7A5] border-[#8EC7A5]/30',
    completed: 'bg-silver/10 text-silver border-silver/30',
    in_progress: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
    internal_experiment: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    concept: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  };

  const statusLabels: Record<ProjectStatus, string> = {
    live: 'Live Product',
    completed: 'Completed',
    in_progress: 'In Progress',
    internal_experiment: 'Internal Lab',
    concept: 'Concept'
  };

  if (variant === 'status' && status) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border uppercase tracking-wider',
          statusStyles[status],
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {children || statusLabels[status]}
      </span>
    );
  }

  const variantStyles = {
    category: 'bg-surface-elevated text-silver border-border text-xs font-mono',
    outline: 'bg-transparent text-muted border-border hover:border-silver/40 text-xs font-mono',
    tech: 'bg-background-secondary text-muted hover:text-white border-border text-[11px] font-mono'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md border transition-colors',
        variantStyles[variant as 'category' | 'outline' | 'tech'],
        className
      )}
    >
      {children}
    </span>
  );
};
