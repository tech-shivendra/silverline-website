import { TeamMember } from '@/types';

export const teamData: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Shivendra Pratap Singh',
    role: 'Founder & Head of Product Engineering',
    bio: 'Passionate product builder and systems engineer. Leads architectural vision, product strategy, and high-performance engineering at SilverLine Studio.',
    avatar_url: '/images/team/shivendra.svg',
    skills: ['Product Architecture', 'Next.js', 'TypeScript', 'System Design', 'Supabase', 'AI Systems'],
    linkedin_url: 'https://linkedin.com/in/shivendrapratapsingh',
    github_url: 'https://github.com/shivendrapratapsingh',
    display_order: 1,
    published: true
  },
  {
    id: 'team-02',
    name: 'SilverLine Engineering Core',
    role: 'Design & Engineering Collective',
    bio: 'Our multidisciplinary team of product designers, full-stack engineers, and systems architects dedicated to crafting next-generation digital products.',
    avatar_url: '/images/team/collective.svg',
    skills: ['UI/UX Design', 'React / Next.js', 'React Native', 'PostgreSQL', 'Cloud Infrastructure', 'Motion Design'],
    linkedin_url: 'https://linkedin.com/company/silverlinestudio',
    github_url: 'https://github.com/silverlinestudio',
    display_order: 2,
    published: true
  }
];
