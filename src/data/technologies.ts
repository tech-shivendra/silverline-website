import { TechnologyItem } from '@/types';

export const technologiesData: TechnologyItem[] = [
  // Frontend
  {
    name: 'React',
    category: 'Frontend',
    role: 'Core declarative UI library powering reactive component state and interactive client trees.',
    icon: 'react',
    associatedProjects: ['aether-os', 'nexus-core', 'kuro-ai']
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    role: 'Production framework delivering React Server Components, hybrid SSR/SSG rendering, and edge runtime routing.',
    icon: 'nextjs',
    associatedProjects: ['aether-os', 'kuro-ai', 'synapse-graph']
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    role: 'Strict compile-time type safety preventing runtime defects and enforcing deterministic APIs across all modules.',
    icon: 'typescript',
    associatedProjects: ['aether-os', 'nexus-core', 'kuro-ai', 'vanguard-mobile']
  },
  {
    name: 'JavaScript',
    category: 'Frontend',
    role: 'High-performance ECMAScript runtime utilized for browser scripting and low-level browser APIs.',
    icon: 'javascript',
    associatedProjects: ['synapse-graph']
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    role: 'Utility-first styling system enabling strict design token adherence, custom theme variables, and zero runtime overhead.',
    icon: 'tailwind',
    associatedProjects: ['aether-os', 'kuro-ai', 'synapse-graph']
  },

  // Backend
  {
    name: 'Node.js',
    category: 'Backend',
    role: 'Asynchronous event-driven JavaScript/TypeScript engine powering high-throughput backend services and web workers.',
    icon: 'nodejs',
    associatedProjects: ['nexus-core', 'aether-os']
  },
  {
    name: 'Express',
    category: 'Backend',
    role: 'Minimalist web framework utilized for crafting robust HTTP REST endpoints and custom middleware stacks.',
    icon: 'express',
    associatedProjects: ['nexus-core']
  },
  {
    name: 'Python',
    category: 'Backend',
    role: 'Primary language for data science, algorithmic financial modeling, and multi-agent LLM pipelines.',
    icon: 'python',
    associatedProjects: ['nexus-core', 'kuro-ai']
  },
  {
    name: 'REST APIs',
    category: 'Backend',
    role: 'Contract-first API architecture designed with OpenAPI standards, strict serialization, and versioning.',
    icon: 'api',
    associatedProjects: ['nexus-core', 'vanguard-mobile', 'kuro-ai']
  },

  // Database and Infrastructure
  {
    name: 'PostgreSQL',
    category: 'Database and Infrastructure',
    role: 'ACID-compliant relational database providing rock-solid transactional safety, JSONB indexing, and advanced constraints.',
    icon: 'postgresql',
    associatedProjects: ['nexus-core', 'kuro-ai', 'aether-os']
  },
  {
    name: 'Supabase',
    category: 'Database and Infrastructure',
    role: 'Integrated platform providing PostgreSQL, Row Level Security, instant realtime subscriptions, and managed authentication.',
    icon: 'supabase',
    associatedProjects: ['aether-os', 'vanguard-mobile']
  },
  {
    name: 'Firebase',
    category: 'Database and Infrastructure',
    role: 'Cloud messaging, crash reporting, and fast prototyping infrastructure for distributed mobile clients.',
    icon: 'firebase',
    associatedProjects: ['vanguard-mobile']
  },
  {
    name: 'Docker',
    category: 'Database and Infrastructure',
    role: 'Containerization standard guaranteeing environment parity across local development, CI/CD, and production clusters.',
    icon: 'docker',
    associatedProjects: ['nexus-core', 'kuro-ai']
  },

  // Mobile
  {
    name: 'React Native',
    category: 'Mobile',
    role: 'Cross-platform native framework compiling unified TypeScript logic into native iOS and Android view hierarchies.',
    icon: 'reactnative',
    associatedProjects: ['vanguard-mobile']
  },
  {
    name: 'Expo',
    category: 'Mobile',
    role: 'Enterprise toolchain streamlining native builds, OTA updates, and native hardware API integrations.',
    icon: 'expo',
    associatedProjects: ['vanguard-mobile']
  },

  // Tools
  {
    name: 'GitHub',
    category: 'Tools',
    role: 'Distributed version control, collaborative code reviews, automated CI/CD GitHub Actions pipelines, and release management.',
    icon: 'github',
    associatedProjects: ['aether-os', 'kuro-ai', 'synapse-graph']
  },
  {
    name: 'Figma',
    category: 'Tools',
    role: 'Collaborative UI/UX design canvas used for design systems, wireframing, high-fidelity prototypes, and component specs.',
    icon: 'figma',
    associatedProjects: ['aether-os', 'nexus-core', 'vanguard-mobile']
  },
  {
    name: 'Vercel',
    category: 'Tools',
    role: 'Global edge platform for lightning-fast frontend deployments, automatic preview branches, and serverless compute.',
    icon: 'vercel',
    associatedProjects: ['aether-os', 'kuro-ai']
  },
  {
    name: 'Postman',
    category: 'Tools',
    role: 'API testing, automated regression suites, documentation generation, and endpoint mock servers.',
    icon: 'postman',
    associatedProjects: ['nexus-core', 'vanguard-mobile']
  }
];
