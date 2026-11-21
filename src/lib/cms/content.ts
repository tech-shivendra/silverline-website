import { projectsData } from '@/data/projects';
import { servicesData } from '@/data/services';
import { technologiesData } from '@/data/technologies';
import { teamData } from '@/data/team';
import { faqData } from '@/data/faq';
import { testimonialsData } from '@/data/testimonials';
import { siteConfig } from '@/data/siteConfig';
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Project, Service, TechnologyItem, TeamMember, FAQItem, Testimonial } from '@/types';

/**
 * Retrieves all published projects for the public portfolio.
 * Draft projects (published = false) are never returned to public visitors.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return projectsData.filter((p) => p.published);
  }

  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return projectsData.filter((p) => p.published);
    }

    return data as Project[];
  } catch {
    return projectsData.filter((p) => p.published);
  }
}

/**
 * Retrieves a single published project by its unique slug.
 */
export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return projectsData.find((p) => p.slug === slug && p.published) || null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return projectsData.find((p) => p.slug === slug && p.published) || null;
    }

    return data as Project;
  } catch {
    return projectsData.find((p) => p.slug === slug && p.published) || null;
  }
}

/**
 * Retrieves all published studio capabilities/services.
 */
export async function getPublishedServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return servicesData.filter((s) => s.published);
  }

  try {
    const { data, error } = await supabaseClient
      .from('services')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return servicesData.filter((s) => s.published);
    }

    return data as Service[];
  } catch {
    return servicesData.filter((s) => s.published);
  }
}

/**
 * Retrieves all published engineering technologies.
 */
export async function getPublishedTechnologies(): Promise<TechnologyItem[]> {
  if (!isSupabaseConfigured()) {
    return technologiesData;
  }

  try {
    const { data, error } = await supabaseClient
      .from('technologies')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return technologiesData;
    }

    return data.map((t) => ({
      name: t.name,
      category: t.category,
      role: t.role,
      icon: t.icon,
      associatedProjects: t.associated_projects || []
    }));
  } catch {
    return technologiesData;
  }
}

/**
 * Retrieves all published team members.
 */
export async function getPublishedTeam(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) {
    return teamData.filter((t) => t.published);
  }

  try {
    const { data, error } = await supabaseClient
      .from('team_members')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return teamData.filter((t) => t.published);
    }

    return data as TeamMember[];
  } catch {
    return teamData.filter((t) => t.published);
  }
}

/**
 * Retrieves all published FAQs.
 */
export async function getPublishedFaqs(): Promise<FAQItem[]> {
  if (!isSupabaseConfigured()) {
    return faqData;
  }

  try {
    const { data, error } = await supabaseClient
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return faqData;
    }

    return data.map((f) => ({
      question: f.question,
      answer: f.answer
    }));
  } catch {
    return faqData;
  }
}

/**
 * Retrieves all published testimonials.
 */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return testimonialsData.filter((t) => t.published);
  }

  try {
    const { data, error } = await supabaseClient
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return testimonialsData.filter((t) => t.published);
    }

    return data as Testimonial[];
  } catch {
    return testimonialsData.filter((t) => t.published);
  }
}

/**
 * Retrieves dynamic site settings or falls back to default siteConfig.
 */
export async function getSiteSettings() {
  if (!isSupabaseConfigured()) {
    return siteConfig;
  }

  try {
    const { data, error } = await supabaseClient
      .from('site_settings')
      .select('*')
      .eq('key', 'general')
      .single();

    if (error || !data || !data.value) {
      return siteConfig;
    }

    const val = data.value;
    return {
      ...siteConfig,
      heroEyebrow: val.heroEyebrow || siteConfig.heroEyebrow,
      heroHeading: val.heroHeading || siteConfig.heroHeading,
      heroSupportingText: val.heroSupportingText || siteConfig.heroSupportingText,
      brandStatement: val.brandStatement || siteConfig.brandStatement,
      supportingStatement: val.supportingStatement || siteConfig.supportingStatement,
      links: {
        ...siteConfig.links,
        email: val.contactEmail || siteConfig.links.email,
        github: val.githubUrl || siteConfig.links.github,
        linkedin: val.linkedinUrl || siteConfig.links.linkedin,
        twitter: val.twitterUrl || siteConfig.links.twitter
      }
    };
  } catch {
    return siteConfig;
  }
}
