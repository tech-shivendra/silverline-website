'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroVisual } from './HeroVisual';
import { siteConfig } from '@/data/siteConfig';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 border-b border-border/40">
      {/* Background Interactive Silver Line Visual */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <HeroVisual />
      </div>

      {/* Subtle radial ambient vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_20%,#08090B_85%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow metadata */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-border/80 backdrop-blur-md mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" />
            <span className="font-mono text-xs uppercase tracking-widest text-silver">
              {siteConfig.heroEyebrow}
            </span>
          </motion.div>

          {/* Main Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.08] mb-6"
          >
            We turn ambitious ideas into{' '}
            <span className="silver-gradient-text">
              extraordinary digital products.
            </span>
          </motion.h1>

          {/* Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {siteConfig.heroSupportingText}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              href="/work"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2 group"
            >
              <span>Explore Our Work</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              href="/contact"
              variant="metallic"
              size="lg"
              className="w-full sm:w-auto"
            >
              Start a Project
            </Button>
          </motion.div>

          {/* Telemetry / Live Status Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-6 text-left w-full max-w-3xl"
          >
            <div>
              <div className="font-mono text-[11px] text-muted-dark uppercase tracking-wider">
                CORE FOCUS
              </div>
              <div className="font-mono text-xs text-silver mt-1">
                Full-Stack Systems
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-muted-dark uppercase tracking-wider">
                RAPID MVP
              </div>
              <div className="font-mono text-xs text-silver mt-1">
                4–8 Week Sprints
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-muted-dark uppercase tracking-wider">
                TECH DISCIPLINE
              </div>
              <div className="font-mono text-xs text-silver mt-1">
                Next.js / TypeScript
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-muted-dark uppercase tracking-wider">
                LOCATION
              </div>
              <div className="font-mono text-xs text-silver mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
                <span>Worldwide Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <a
        href="#introduction"
        aria-label="Scroll to introduction"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted hover:text-white transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </a>
    </section>
  );
};
