import { Service } from '@/types';

export const servicesData: Service[] = [
  {
    id: 'srv-01',
    title: 'Product Strategy',
    slug: 'product-strategy',
    description: 'We define market opportunity, technical viability, and scalable roadmaps to turn raw concepts into viable, high-impact digital ventures.',
    capabilities: [
      'Market & Competitor Analysis',
      'Product Opportunity Mapping',
      'Technical Feasibility Studies',
      'MVP Scoping & Feature Prioritization',
      'User Persona & Journey Architecture'
    ],
    icon: 'Compass',
    display_order: 1,
    published: true
  },
  {
    id: 'srv-02',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Crafting bespoke, dark-futuristic and editorial visual interfaces backed by rigorous human-computer interaction principles and scalable design systems.',
    capabilities: [
      'Design Systems & Component Libraries',
      'High-Fidelity Interactive Prototypes',
      'Wireframing & Information Architecture',
      'Micro-Interactions & Motion Design',
      'Design Audits & Usability Testing'
    ],
    icon: 'Palette',
    display_order: 2,
    published: true
  },
  {
    id: 'srv-03',
    title: 'Web Development',
    slug: 'web-development',
    description: 'Engineering lightning-fast, highly responsive web experiences using modern Next.js, React, TypeScript, and modern edge architectures.',
    capabilities: [
      'Next.js Server & Client Architectures',
      'High-Performance Interactive WebGL / Canvas',
      'Responsive Cross-Platform Web Apps',
      'SEO & Core Web Vitals Optimization',
      'Edge Computing & Headless CMS'
    ],
    icon: 'Globe',
    display_order: 3,
    published: true
  },
  {
    id: 'srv-04',
    title: 'Mobile Application Development',
    slug: 'mobile-development',
    description: 'Building fluid, native-feel iOS and Android applications with unified React Native and Expo codebases that scale effortlessly.',
    capabilities: [
      'Cross-Platform React Native & Expo',
      'Offline-First Data Synchronization',
      'Hardware & Native Sensor Integration',
      'App Store & Play Store Submissions',
      'Push Notification Architecture'
    ],
    icon: 'Smartphone',
    display_order: 4,
    published: true
  },
  {
    id: 'srv-05',
    title: 'Backend & API Development',
    slug: 'backend-api',
    description: 'Architecting resilient distributed backend systems, secure REST & GraphQL APIs, and real-time streaming engines.',
    capabilities: [
      'Distributed Microservices & Serverless',
      'PostgreSQL & Supabase Architecture',
      'Real-Time WebSockets & Event Streams',
      'Authentication & Role-Based Access Control',
      'Rate Limiting & Threat Mitigation'
    ],
    icon: 'Server',
    display_order: 5,
    published: true
  },
  {
    id: 'srv-06',
    title: 'AI Integration',
    slug: 'ai-integration',
    description: 'Integrating state-of-the-art LLMs, generative intelligence, vector search, and autonomous workflow agents directly into consumer and enterprise software.',
    capabilities: [
      'Custom LLM Pipelines & Fine-Tuning',
      'Retrieval-Augmented Generation (RAG)',
      'Autonomous Agent & Workflow Engines',
      'Computer Vision & Audio Pipelines',
      'AI Cost & Latency Optimization'
    ],
    icon: 'Cpu',
    display_order: 6,
    published: true
  },
  {
    id: 'srv-07',
    title: 'MVP Development',
    slug: 'mvp-development',
    description: 'Rapidly engineering production-grade Minimum Viable Products in 4 to 8 weeks, giving founders investor-ready traction without technical debt.',
    capabilities: [
      '4–8 Week Rapid Engineering Sprints',
      'Production-Ready Scalable Foundation',
      'Integrated Analytics & Feedback Loops',
      'Automated CI/CD Deployment Pipelines',
      'Post-Launch Iteration Cadence'
    ],
    icon: 'Zap',
    display_order: 7,
    published: true
  },
  {
    id: 'srv-08',
    title: 'Product Maintenance & Scaling',
    slug: 'maintenance-scaling',
    description: 'Long-term technical stewardship, cloud infrastructure optimization, proactive security auditing, and continuous iterative enhancement.',
    capabilities: [
      '24/7 Uptime & Error Monitoring',
      'Database Optimization & Index Tuning',
      'Cloud Cost Optimization & Multi-Region',
      'Security Audits & Vulnerability Patches',
      'Feature Roadmap Execution'
    ],
    icon: 'Activity',
    display_order: 8,
    published: true
  }
];
