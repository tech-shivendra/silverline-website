import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    id: 'proj-01',
    title: 'AetherOS — Distributed Cloud Workspace',
    slug: 'aether-os',
    description: 'An ultra-low latency browser-based operating system designed for distributed creative engineering teams.',
    long_description: 'AetherOS reimagines collaborative product design and distributed computing by providing a virtualized operating environment directly inside WebGL and WASM canvas with sub-50ms sync.',
    category: 'Web Applications',
    project_status: 'live',
    thumbnail_url: '/images/projects/aetheros-thumb.svg',
    cover_url: '/images/projects/aetheros-cover.svg',
    gallery: [
      '/images/projects/aetheros-1.svg',
      '/images/projects/aetheros-2.svg',
      '/images/projects/aetheros-3.svg'
    ],
    tech_stack: ['Next.js', 'TypeScript', 'WebAssembly', 'Tailwind CSS', 'WebSockets', 'Supabase'],
    live_url: 'https://aetheros.preview.silverline.studio',
    github_url: 'https://github.com/silverlinestudio/aether-os',
    featured: true,
    published: true,
    display_order: 1,
    problem_statement: 'Modern engineering teams suffer from fragmented toolchains, high-friction desktop virtualization, and high-latency sync during distributed pair-programming and visual systems design.',
    objectives: 'Engineer an in-browser virtualized workspace with instantaneous cold-start, sub-50ms peer synchronization, and zero local software setup required.',
    solution: 'Designed and engineered an event-driven WebAssembly kernel paired with high-performance Canvas rendering, real-time WebSocket state distribution, and PostgreSQL snapshot persistence.',
    design_approach: 'Dark futuristic aesthetic prioritizing high information density, monochromatic silver accents, responsive spatial window management, and zero visual clutter.',
    architecture: 'Next.js 15 App Router frontend paired with distributed Rust WASM workers, Supabase realtime channels, and Redis edge caching.',
    major_features: [
      'Sub-50ms peer-to-peer cursor and state synchronization',
      'Sandboxed WebAssembly terminal runtime for code execution',
      'Dynamic spatial window layout engine with multi-monitor emulation',
      'Instant cloud snapshot branching and rollbacks'
    ],
    results: 'Onboarding setup time plummeted from 3 days to under 4 minutes. Over 12,000 developers tested the beta with 99.98% session uptime.'
  },
  {
    id: 'proj-02',
    title: 'Nexus Core — Predictive Financial Engine',
    slug: 'nexus-core',
    description: 'Institutional-grade automated liquidity orchestration and algorithmic risk analytics platform.',
    long_description: 'Nexus Core powers predictive market telemetry, autonomous balance rebalancing, and deep risk modeling for digital asset treasuries.',
    category: 'SaaS',
    project_status: 'completed',
    thumbnail_url: '/images/projects/nexus-thumb.svg',
    cover_url: '/images/projects/nexus-cover.svg',
    gallery: [
      '/images/projects/nexus-1.svg',
      '/images/projects/nexus-2.svg'
    ],
    tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'Docker'],
    live_url: 'https://nexus.preview.silverline.studio',
    github_url: null,
    featured: true,
    published: true,
    display_order: 2,
    problem_statement: 'Decentralized liquidity providers and treasury operators face catastrophic impermanent loss and manual rebalancing overhead during rapid market volatility spikes.',
    objectives: 'Design an automated telemetry system that detects liquidity fragmentation and rebalances treasury allocations in sub-second intervals.',
    solution: 'Built an autonomous microservice pipeline utilizing Python for continuous Bayesian risk calculation and a reactive Next.js dashboard with live visual charts.',
    design_approach: 'High-density financial data visualization with custom dark charts, high-contrast numeric typography, and instantaneous visual alerting.',
    architecture: 'Event-driven Node.js & Python backend orchestration connected to real-time PostgreSQL instances and distributed worker queues.',
    major_features: [
      'Real-time volatility heatmap with automated threshold detection',
      'Autonomous balance rebalancing algorithms with gas optimization',
      'Granular portfolio exposure simulation and stress testing',
      'Institutional multi-sig approval flows and complete audit trails'
    ],
    results: 'Protected over $42M in client treasury assets during peak volatility events with zero automated liquidation occurrences.'
  },
  {
    id: 'proj-03',
    title: 'Kuro AI — Autonomous Code Review & Refactoring',
    slug: 'kuro-ai',
    description: 'Autonomous multi-agent intelligence that reviews, security-audits, and refactors pull requests in real time.',
    long_description: 'Kuro AI acts as a 24/7 staff engineer that inspects code diffs, identifies architectural antipatterns, runs security audits, and generates verified pull requests.',
    category: 'AI & Automation',
    project_status: 'live',
    thumbnail_url: '/images/projects/kuro-thumb.svg',
    cover_url: '/images/projects/kuro-cover.svg',
    gallery: [
      '/images/projects/kuro-1.svg',
      '/images/projects/kuro-2.svg'
    ],
    tech_stack: ['Next.js', 'TypeScript', 'Python', 'LLM API', 'PostgreSQL', 'Docker'],
    live_url: 'https://kuro.preview.silverline.studio',
    github_url: 'https://github.com/silverlinestudio/kuro-ai',
    featured: true,
    published: true,
    display_order: 3,
    problem_statement: 'Engineering leads spend over 35% of their weekly time reviewing boilerplate PRs, catching trivial syntax errors, and enforcing test coverage standards.',
    objectives: 'Construct an autonomous review pipeline that provides senior-level architectural feedback, detects CVE vulnerabilities, and auto-proposes refactoring diffs.',
    solution: 'Developed a tiered multi-agent swarm analyzing AST representations, security rulebooks, and LLM reasoning to output actionable GitHub code comments.',
    design_approach: 'Terminal-inspired developer UI with syntax highlighting, inline diff viewer, and instant command-palette interaction.',
    architecture: 'FastAPI & Next.js backend with asynchronous task queues, GitHub Webhook ingress, and vector semantic code search.',
    major_features: [
      'Automated semantic AST analysis & lint verification',
      'Security vulnerability scanner (OWASP Top 10 + supply chain)',
      'One-click pull request refactoring diffs',
      'CI/CD status gate integration with custom repo policies'
    ],
    results: 'Cut average PR review cycle turnaround from 18 hours to 14 minutes across 85 active software engineering repositories.'
  },
  {
    id: 'proj-04',
    title: 'Vanguard Mobile — Offline-First Field Telemetry',
    slug: 'vanguard-mobile',
    description: 'Industrial field intelligence application for mission-critical remote infrastructure inspections.',
    long_description: 'Vanguard Mobile gives field engineers rugged offline telemetry capture, geospatial asset tagging, and conflict-free peer synchronization.',
    category: 'Mobile Applications',
    project_status: 'completed',
    thumbnail_url: '/images/projects/vanguard-thumb.svg',
    cover_url: '/images/projects/vanguard-cover.svg',
    gallery: [
      '/images/projects/vanguard-1.svg'
    ],
    tech_stack: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Supabase'],
    live_url: null,
    github_url: null,
    featured: false,
    published: true,
    display_order: 4,
    problem_statement: 'Engineers inspecting remote wind farms and solar arrays operate with zero cellular reception, causing lost reports and manual data transcription errors.',
    objectives: 'Provide a rugged, high-contrast mobile application that records sensor feeds, photos, and inspection checklists offline with zero data loss.',
    solution: 'Engineered an offline-first SQLite database layer on React Native paired with CRDT conflict resolution that syncs automatically when signal is regained.',
    design_approach: 'High-visibility outdoor contrast mode, large tactile touch targets, and haptic feedback confirmations.',
    architecture: 'React Native (Expo EAS) client with local SQLite encryption, syncing to Supabase PostgreSQL via delta batching.',
    major_features: [
      'Conflict-free offline sync (CRDT state engine)',
      'Hardware camera & LiDAR integration with asset tagging',
      'Geospatial coordinate watermarking and GPS validation',
      'Biometric authentication and encrypted local vault'
    ],
    results: 'Deployed across 350+ field engineers, completing 45,000+ incident audits without a single data loss incident.'
  },
  {
    id: 'proj-05',
    title: 'Synapse Graph — Neural Knowledge Explorer',
    slug: 'synapse-graph',
    description: '3D force-directed knowledge graph visualizing complex organizational intelligence and relationships.',
    long_description: 'Synapse Graph translates messy company wikis, code repos, and customer conversations into an interactive 3D spatial neural network.',
    category: 'Experimental Concepts',
    project_status: 'internal_experiment',
    thumbnail_url: '/images/projects/synapse-thumb.svg',
    cover_url: '/images/projects/synapse-cover.svg',
    gallery: [
      '/images/projects/synapse-1.svg'
    ],
    tech_stack: ['Next.js', 'Three.js', 'WebGL', 'TypeScript', 'Tailwind CSS'],
    live_url: 'https://synapse.preview.silverline.studio',
    github_url: 'https://github.com/silverlinestudio/synapse-graph',
    featured: false,
    published: true,
    display_order: 5,
    problem_statement: 'Corporate knowledge is silod across thousands of disparate documents, making cross-functional discovery virtually impossible.',
    objectives: 'Build an intuitive 3D spatial graph that lets researchers zoom from high-level topics down to individual code functions.',
    solution: 'Created a custom Three.js WebGL force-directed graph renderer capable of simulating 50,000 nodes at 60 frames per second.',
    design_approach: 'Dark cosmic visual motif with glowing metallic silver nodes, dynamic edge tension lines, and kinetic camera controls.',
    architecture: 'WebGL/Three.js frontend connected to graph database queries and vector embeddings.',
    major_features: [
      '3D force-directed physics engine simulating 50k nodes',
      'Semantic similarity clustering using vector embeddings',
      'Instant node search and pathfinding visualization',
      'Interactive cluster drilldowns and citation metadata'
    ],
    results: 'Showcased at internal lab demo days with an average engagement session length of 14 minutes per user.'
  }
];
