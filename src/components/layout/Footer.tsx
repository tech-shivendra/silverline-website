import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/data/siteConfig';
import { servicesData } from '@/data/services';
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background-secondary border-t border-border overflow-hidden pt-16 pb-12">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-border">
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              {siteConfig.supportingStatement}
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs uppercase tracking-widest text-silver">
                Official Inquiries:
              </span>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="block font-mono text-sm text-white hover:text-accent-blue transition-colors mt-1"
              >
                {siteConfig.links.email}
              </a>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-white hover:border-silver/40 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-white hover:border-silver/40 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-white hover:border-silver/40 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-silver font-medium mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-silver font-medium mb-4">
              Capabilities
            </h3>
            <ul className="space-y-2.5 text-sm">
              {servicesData.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href="/services"
                    className="text-muted hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio & Legal */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-silver font-medium mb-4">
              Playground & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/playground"
                  className="text-muted hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Product Architect</span>
                  <ArrowUpRight className="h-3 w-3 text-silver opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Interactive Terminal</span>
                  <ArrowUpRight className="h-3 w-3 text-silver opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Pixel Rush Game</span>
                  <ArrowUpRight className="h-3 w-3 text-silver opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Closing Silver-Line Dynamic Visual Motif */}
        <div className="py-8 my-2 relative flex items-center justify-center">
          <svg
            className="w-full max-w-4xl h-8 overflow-visible"
            viewBox="0 0 800 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 12 H 320 C 360 12, 380 4, 400 4 C 420 4, 440 20, 460 20 C 480 20, 500 12, 540 12 H 800"
              stroke="url(#footerSilverLine)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="400" cy="4" r="3" fill="#8DA8FF" />
            <circle cx="460" cy="20" r="3" fill="#C6C9CE" />
            <defs>
              <linearGradient id="footerSilverLine" x1="0" y1="12" x2="800" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#282C33" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#C6C9CE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#C6C9CE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#282C33" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted-dark pt-2 gap-4">
          <p>© {new Date().getFullYear()} SilverLine Studio. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
            <span>Systems Normal — Worldwide Deployment</span>
          </p>
        </div>
      </Container>
    </footer>
  );
};
