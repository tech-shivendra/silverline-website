import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Start a Project',
  description: 'Submit your product requirements, MVP roadmap, or engineering specifications to SilverLine Studio.'
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <Container size="default">
        <SectionHeading
          eyebrow="COMMENCE COLLABORATION"
          title="Start a Project."
          description="Tell us about what you want to build. Our engineering leadership reviews all submissions with direct technical feasibility and roadmap proposals."
          align="center"
        />

        <Suspense fallback={<div className="text-center font-mono text-xs text-muted">Loading inquiry engine...</div>}>
          <ContactForm />
        </Suspense>
      </Container>
    </div>
  );
}
