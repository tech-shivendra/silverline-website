import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPublishedTeam } from '@/lib/cms/content';
import { siteConfig } from '@/data/siteConfig';
import { Github, Linkedin, ShieldCheck, Terminal, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SilverLine Studio',
  description: 'The philosophy, engineering collective, and technical capabilities behind SilverLine Studio.'
};

export const revalidate = 60;

export default async function StudioPage() {
  const team = await getPublishedTeam();
  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Header */}
        <SectionHeading
          eyebrow="ABOUT OUR STUDIO"
          title="Engineered for Longevity."
          description="SilverLine Studio was founded to bridge the gap between creative product design and uncompromising technical execution."
        />

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-7 space-y-6 text-base text-muted leading-relaxed">
            <p className="text-xl text-white font-heading font-medium">
              We don't just build products. We build what comes next.
            </p>
            <p>
              In an industry saturated with outsourced templates, rushed MVP prototypes, and fragile codebases, SilverLine Studio operates as a high-conviction product studio.
            </p>
            <p>
              We treat every client engagement as our own product. That means we don't just ask for a spec and write code — we challenge assumptions, map real user workflows, evaluate technical trade-offs, and engineer scalable architectures from day one.
            </p>
            <p>
              Whether you are an early-stage founder seeking investor-ready traction or an established organization building next-generation software, we deliver with clarity, speed, and precision.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-xl bg-surface border border-border">
              <div className="font-mono text-xs uppercase tracking-wider text-accent-blue mb-1">
                STANDARDS
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Zero Technical Debt Tolerance
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Every line of TypeScript is strictly typed. Database schemas are guarded by foreign keys and RLS. Codebases are delivered production-ready.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-border">
              <div className="font-mono text-xs uppercase tracking-wider text-status-success mb-1">
                TRANSPARENCY
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Direct Engineering Collaboration
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                You communicate directly with the engineers and designers architecting your software — no layers of bureaucratic project managers.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership & Collective Team */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-8">
            The Studio Core
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member) => (
              <Card key={member.id} className="p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-surface-elevated border border-border shrink-0">
                    {member.avatar_url && (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <h3 className="font-heading text-xl font-bold text-white">
                      {member.name}
                    </h3>
                    <div className="font-mono text-xs text-accent-blue">
                      {member.role}
                    </div>
                    <p className="text-xs text-muted leading-relaxed pt-1">
                      {member.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {member.skills.map((s) => (
                        <Badge key={s} variant="tech">
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-white transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-white transition-colors"
                          aria-label={`${member.name} GitHub`}
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-12 border-t border-border">
          <h3 className="font-heading text-2xl font-bold text-white mb-3">
            Want to collaborate with our engineering team?
          </h3>
          <p className="text-sm text-muted mb-6">
            Let's discuss your product goals, technical stack, and milestone roadmaps.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Start a Conversation
          </Button>
        </div>
      </Container>
    </div>
  );
}
