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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <SelectedProjectsSection />
      <ServicesSection />
      <TechEcosystemSection />
      <ProcessSection />
      <StudioSection />
      <PlaygroundTeaserSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
