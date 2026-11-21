import { describe, it, expect } from 'vitest';
import { projectsData } from '@/data/projects';
import { servicesData } from '@/data/services';
import { technologiesData } from '@/data/technologies';
import { teamData } from '@/data/team';
import { faqData } from '@/data/faq';

describe('Centralized Content Data Integrity', () => {
  it('contains at least 5 structured case studies with all PRD fields', () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(5);

    projectsData.forEach((project) => {
      expect(project.id).toBeDefined();
      expect(project.title).toBeTruthy();
      expect(project.slug).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.project_status).toBeTruthy();
      expect(project.tech_stack.length).toBeGreaterThan(0);
      expect(project.problem_statement).toBeTruthy();
      expect(project.solution).toBeTruthy();
    });
  });

  it('contains the 8 mandatory studio capabilities', () => {
    expect(servicesData.length).toBe(8);
    const slugs = servicesData.map(s => s.slug);
    expect(slugs).toContain('product-strategy');
    expect(slugs).toContain('ui-ux-design');
    expect(slugs).toContain('web-development');
    expect(slugs).toContain('mobile-development');
    expect(slugs).toContain('backend-api');
    expect(slugs).toContain('ai-integration');
    expect(slugs).toContain('mvp-development');
    expect(slugs).toContain('maintenance-scaling');
  });

  it('contains technologies across all 5 PRD categories', () => {
    const categories = Array.from(new Set(technologiesData.map(t => t.category)));
    expect(categories).toContain('Frontend');
    expect(categories).toContain('Backend');
    expect(categories).toContain('Database and Infrastructure');
    expect(categories).toContain('Mobile');
    expect(categories).toContain('Tools');
  });

  it('contains team data without fabrication', () => {
    expect(teamData.length).toBeGreaterThanOrEqual(2);
    expect(teamData[0].name).toBe('Shivendra Pratap Singh');
    expect(teamData[0].role).toContain('Product Engineering');
  });

  it('contains all 8 core studio FAQs', () => {
    expect(faqData.length).toBe(8);
  });
});
