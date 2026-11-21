import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { faqData } from '@/data/faq';
import { Reveal } from '@/components/animations/Reveal';

export const FAQSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-background-secondary relative border-t border-border/50">
      <Container size="narrow">
        <Reveal>
          <SectionHeading
            eyebrow="FREQUENTLY ASKED QUESTIONS"
            title="Everything You Need to Know."
            description="Clear answers regarding our engineering process, pricing approach, timelines, and ongoing support."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <Accordion items={faqData} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
