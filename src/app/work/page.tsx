import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WorkPortfolioView } from '@/components/projects/WorkPortfolioView';
import { projectsData } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Our Work & Case Studies',
  description: 'Explore production applications, SaaS platforms, and experimental software systems engineered by SilverLine Studio.'
};

export default function WorkPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="PORTFOLIO & CASE STUDIES"
          title="Digital Products Built for Scale."
          description="A curated selection of client platforms, decentralized systems, mobile apps, and internal laboratories."
        />

        <WorkPortfolioView initialProjects={projectsData} />
      </Container>
    </div>
  );
}
