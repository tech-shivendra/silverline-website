import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { IntroSection } from '@/components/sections/IntroSection';
import { SelectedProjectsSection } from '@/components/sections/SelectedProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TechEcosystemSection } from '@/components/sections/TechEcosystemSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { StudioSection } from '@/components/sections/StudioSection';
import { PlaygroundTeaserSection } from '@/components/sections/PlaygroundTeaserSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';
import {
  getPublishedProjects,
  getPublishedServices,
  getPublishedTechnologies,
  getPublishedTeam,
  getPublishedFaqs
} from '@/lib/cms/content';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, services, technologies, team, faqs] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getPublishedTechnologies(),
    getPublishedTeam(),
    getPublishedFaqs()
  ]);

  return (
    <>
      <HeroSection />
      <IntroSection />
      <SelectedProjectsSection initialProjects={projects} />
      <ServicesSection initialServices={services} />
      <TechEcosystemSection initialTechnologies={technologies} />
      <ProcessSection />
      <StudioSection initialTeam={team} />
      <PlaygroundTeaserSection />
      <FAQSection initialFaqs={faqs} />
      <FinalCTASection />
    </>
  );
}
