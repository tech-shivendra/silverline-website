'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/types';

interface AccordionProps {
  items: FAQItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="py-5">
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between text-left font-heading text-lg font-medium text-white transition-colors hover:text-silver focus:outline-none focus-visible:text-accent-blue"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-muted transition-transform duration-200 shrink-0 ml-4',
                  isOpen && 'rotate-180 text-silver'
                )}
              />
            </button>
            {isOpen && (
              <div className="mt-3 text-base text-muted leading-relaxed pr-8">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
