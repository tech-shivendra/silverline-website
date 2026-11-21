import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/animations/Reveal';
import { teamData } from '@/data/team';
import { siteConfig } from '@/data/siteConfig';
import { TeamMember } from '@/types';
import { Github, Linkedin, ShieldCheck } from 'lucide-react';

interface StudioSectionProps {
  initialTeam?: TeamMember[];
}

export const StudioSection: React.FC<StudioSectionProps> = ({ initialTeam }) => {
  const team = initialTeam && initialTeam.length > 0 ? initialTeam : teamData.filter((t) => t.published);

  return (
    <section id="studio" className="py-24 md:py-32 bg-background-secondary relative border-t border-border/50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="ABOUT SILVERLINE"
              title="Built by engineers. Driven by craft."
              description="SilverLine Studio was founded on the belief that product engineering should be transparent, uncompromising, and deeply collaborative."
            />
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
                We partner with high-ambition founders, startups, and product organizations to turn complex ideas into refined, production-ready software.
              </p>
              <p>
                We do not outsource engineering to opaque third parties. Every line of TypeScript, every database migration, and every interaction curve is designed and executed by our core collective.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button href="/studio" variant="secondary" size="md">
                Learn More About The Studio
              </Button>
            </div>
          </div>

          {/* Team Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.15}>
                <Card className="h-full flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full rounded-lg overflow-hidden mb-5 bg-surface-elevated border border-border">
                      {member.avatar_url && (
                        <Image
                          src={member.avatar_url}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white">
                      {member.name}
                    </h3>
                    <div className="font-mono text-xs text-accent-blue mb-3">
                      {member.role}
                    </div>
                    <p className="text-xs text-muted leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {member.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="tech">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Profile Links */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
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
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
