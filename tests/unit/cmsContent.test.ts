import { describe, it, expect } from 'vitest';
import {
  getPublishedProjects,
  getPublishedProjectBySlug,
  getPublishedServices,
  getPublishedTechnologies,
  getPublishedTeam,
  getPublishedFaqs,
  getSiteSettings
} from '@/lib/cms/content';

describe('Dynamic CMS Content Layer', () => {
  it('returns only published projects from getPublishedProjects', async () => {
    const projects = await getPublishedProjects();
    expect(projects.length).toBeGreaterThan(0);
    // Every project returned must have published: true
    projects.forEach((project) => {
      expect(project.published).toBe(true);
      expect(project.title).toBeDefined();
      expect(project.slug).toBeDefined();
    });
  });

  it('retrieves an existing published project by slug', async () => {
    const project = await getPublishedProjectBySlug('aether-os');
    expect(project).not.toBeNull();
    expect(project?.slug).toBe('aether-os');
    expect(project?.published).toBe(true);
  });

  it('returns null when querying a non-existent slug', async () => {
    const project = await getPublishedProjectBySlug('non-existent-secret-project');
    expect(project).toBeNull();
  });

  it('retrieves published services list', async () => {
    const services = await getPublishedServices();
    expect(services.length).toBeGreaterThan(0);
    services.forEach((service) => {
      expect(service.published).toBe(true);
      expect(service.title).toBeDefined();
      expect(service.capabilities.length).toBeGreaterThan(0);
    });
  });

  it('retrieves published technologies ecosystem items', async () => {
    const tech = await getPublishedTechnologies();
    expect(tech.length).toBeGreaterThan(0);
    const categories = ['Frontend', 'Backend', 'Database and Infrastructure', 'Mobile', 'Tools'];
    tech.forEach((item) => {
      expect(categories).toContain(item.category);
      expect(item.name).toBeDefined();
    });
  });

  it('retrieves published team members', async () => {
    const team = await getPublishedTeam();
    expect(team.length).toBeGreaterThan(0);
    team.forEach((member) => {
      expect(member.published).toBe(true);
      expect(member.name).toBeDefined();
      expect(member.role).toBeDefined();
    });
  });

  it('retrieves published FAQs', async () => {
    const faqs = await getPublishedFaqs();
    expect(faqs.length).toBeGreaterThan(0);
    faqs.forEach((faq) => {
      expect(faq.question).toBeDefined();
      expect(faq.answer).toBeDefined();
    });
  });

  it('retrieves site settings with brand positioning', async () => {
    const settings = await getSiteSettings();
    expect(settings.name).toBe('SilverLine Studio');
    expect(settings.brandStatement).toContain("We don't just build products");
  });
});
