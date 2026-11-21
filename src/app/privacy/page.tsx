import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for SilverLine Studio.'
};

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <Container size="narrow">
        <div className="font-mono text-xs uppercase tracking-widest text-silver mb-2">
          LEGAL & COMPLIANCE
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-8">
          Privacy Policy
        </h1>
        <div className="text-xs font-mono text-muted mb-12">
          Last updated: March 2026
        </div>

        <div className="space-y-8 text-sm text-muted leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-white">
              1. Information We Collect
            </h2>
            <p>
              SilverLine Studio collects information that you provide directly to us when submitting a project inquiry or using our interactive tools, such as your name, email address, phone number, company name, project specifications, and estimated budget.
            </p>
            <p>
              We do not sell, rent, or lease your personal information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-white">
              2. How We Use Information
            </h2>
            <p>
              We use collected information solely to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-silver">
              <li>Review your technical requirements and respond to your inquiry.</li>
              <li>Provide customized architecture proposals and statements of work.</li>
              <li>Improve the performance and reliability of our website and interactive tools.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-white">
              3. Data Storage & Security
            </h2>
            <p>
              Inquiries and telemetry are securely transmitted over HTTPS and stored in encrypted PostgreSQL databases managed with Row Level Security (RLS). We implement strict security standards to protect your data from unauthorized access, disclosure, or alteration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-white">
              4. Cookies & Analytics
            </h2>
            <p>
              We use privacy-friendly analytics to assess website engagement and error telemetry. We do not use intrusive cross-site tracking or commercial advertising trackers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-white">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:studio@silverline.design" className="text-accent-blue hover:underline">
                studio@silverline.design
              </a>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
