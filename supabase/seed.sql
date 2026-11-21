-- SilverLine Studio Seed Data
-- supabase/seed.sql

-- Seed Services
INSERT INTO public.services (title, slug, description, capabilities, icon, display_order, published)
VALUES
(
    'Product Strategy',
    'product-strategy',
    'We define market opportunity, technical viability, and scalable roadmaps to turn raw concepts into viable, high-impact digital ventures.',
    '["Market & Competitor Analysis", "Product Opportunity Mapping", "Technical Feasibility Studies", "MVP Scoping & Feature Prioritization", "User Persona & Journey Architecture"]'::jsonb,
    'Compass',
    1,
    true
),
(
    'UI/UX Design',
    'ui-ux-design',
    'Crafting bespoke, dark-futuristic and editorial visual interfaces backed by rigorous human-computer interaction principles and scalable design systems.',
    '["Design Systems & Component Libraries", "High-Fidelity Interactive Prototypes", "Wireframing & Information Architecture", "Micro-Interactions & Motion Design", "Design Audits & Usability Testing"]'::jsonb,
    'Palette',
    2,
    true
),
(
    'Web Development',
    'web-development',
    'Engineering lightning-fast, highly responsive web experiences using modern Next.js, React, TypeScript, and modern edge architectures.',
    '["Next.js Server & Client Architectures", "High-Performance Interactive WebGL / Canvas", "Responsive Cross-Platform Web Apps", "SEO & Core Web Vitals Optimization", "Edge Computing & Headless CMS"]'::jsonb,
    'Globe',
    3,
    true
),
(
    'Mobile Application Development',
    'mobile-development',
    'Building fluid, native-feel iOS and Android applications with unified React Native and Expo codebases that scale effortlessly.',
    '["Cross-Platform React Native & Expo", "Offline-First Data Synchronization", "Hardware & Native Sensor Integration", "App Store & Play Store Submissions", "Push Notification Architecture"]'::jsonb,
    'Smartphone',
    4,
    true
),
(
    'Backend & API Development',
    'backend-api',
    'Architecting resilient distributed backend systems, secure REST & GraphQL APIs, and real-time streaming engines.',
    '["Distributed Microservices & Serverless", "PostgreSQL & Supabase Architecture", "Real-Time WebSockets & Event Streams", "Authentication & Role-Based Access Control", "Rate Limiting & Threat Mitigation"]'::jsonb,
    'Server',
    5,
    true
),
(
    'AI Integration',
    'ai-integration',
    'Integrating state-of-the-art LLMs, generative intelligence, vector search, and autonomous workflow agents directly into consumer and enterprise software.',
    '["Custom LLM Pipelines & Fine-Tuning", "Retrieval-Augmented Generation (RAG)", "Autonomous Agent & Workflow Engines", "Computer Vision & Audio Pipelines", "AI Cost & Latency Optimization"]'::jsonb,
    'Cpu',
    6,
    true
),
(
    'MVP Development',
    'mvp-development',
    'Rapidly engineering production-grade Minimum Viable Products in 4 to 8 weeks, giving founders investor-ready traction without technical debt.',
    '["4–8 Week Rapid Engineering Sprints", "Production-Ready Scalable Foundation", "Integrated Analytics & Feedback Loops", "Automated CI/CD Deployment Pipelines", "Post-Launch Iteration Cadence"]'::jsonb,
    'Zap',
    7,
    true
),
(
    'Product Maintenance & Scaling',
    'maintenance-scaling',
    'Long-term technical stewardship, cloud infrastructure optimization, proactive security auditing, and continuous iterative enhancement.',
    '["24/7 Uptime & Error Monitoring", "Database Optimization & Index Tuning", "Cloud Cost Optimization & Multi-Region", "Security Audits & Vulnerability Patches", "Feature Roadmap Execution"]'::jsonb,
    'Activity',
    8,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (
    title, slug, description, long_description, category, project_status,
    thumbnail_url, cover_url, gallery, tech_stack, live_url, github_url,
    featured, published, display_order, problem_statement, objectives, solution,
    design_approach, architecture, major_features, results
)
VALUES
(
    'AetherOS — Distributed Cloud Workspace',
    'aether-os',
    'An ultra-low latency browser-based operating system designed for distributed creative engineering teams.',
    'AetherOS reimagines collaborative product design and distributed computing by providing a virtualized operating environment directly inside WebGL and WASM canvas.',
    'Web Applications',
    'live',
    '/images/projects/aetheros-thumb.svg',
    '/images/projects/aetheros-cover.svg',
    '["/images/projects/aetheros-1.svg", "/images/projects/aetheros-2.svg"]'::jsonb,
    ARRAY['Next.js', 'TypeScript', 'WebAssembly', 'Tailwind CSS', 'WebSockets', 'Supabase'],
    'https://aetheros.preview.silverline.studio',
    'https://github.com/silverlinestudio/aether-os',
    true,
    true,
    1,
    'Distributed engineering teams struggle with fragmented desktop environments and high-latency collaboration tools when pairing on heavy graphical and architectural codebases.',
    'Create an in-browser virtualized workspace with sub-50ms peer-to-peer state synchronization and zero local software installation requirements.',
    'Engineered a WebAssembly-driven micro-kernel architecture rendered via Canvas/WebGL with real-time state synchronization over WebSockets and Supabase PostgreSQL.',
    'Dark-futuristic editorial aesthetic featuring monochromatic silver accents, precise monospace telemetry, and distraction-free spatial layouts.',
    'Next.js 15 App Router frontend paired with distributed Rust WASM workers, Supabase realtime channels, and Redis edge caching.',
    '["Real-time multi-cursor collaboration", "Sandboxed WebAssembly terminal execution", "Instant snapshot versioning", "Zero-install cross-platform access"]'::jsonb,
    'Reduced engineering onboarding time from 3 days to under 4 minutes with 99.98% session uptime across 12,000+ test developers.'
),
(
    'Nexus Core — Predictive Financial Engine',
    'nexus-core',
    'Institutional-grade automated liquidity orchestration and algorithmic risk analytics platform.',
    'Nexus Core powers predictive market telemetry, autonomous balance rebalancing, and deep risk modeling for digital asset treasuries.',
    'SaaS',
    'completed',
    '/images/projects/nexus-thumb.svg',
    '/images/projects/nexus-cover.svg',
    '["/images/projects/nexus-1.svg", "/images/projects/nexus-2.svg"]'::jsonb,
    ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'Docker'],
    'https://nexus.preview.silverline.studio',
    NULL,
    true,
    true,
    2,
    'Decentralized liquidity providers face catastrophic impermanent loss and manual rebalancing overhead during rapid market volatility spikes.',
    'Design an automated telemetry system that detects liquidity fragmentation and rebalances treasury allocations in sub-second intervals.',
    'Built an autonomous microservice pipeline utilizing Python for continuous Bayesian risk calculation and a reactive Next.js dashboard with live visual charts.',
    'High-density financial data visualization with custom dark charts, high-contrast numeric typography, and instantaneous visual alerting.',
    'Event-driven Node.js & Python backend orchestration connected to real-time TimescaleDB/PostgreSQL instances and distributed worker queues.',
    '["Real-time volatility heatmap", "Autonomous rebalancing triggers", "Granular portfolio exposure simulation", "Institutional multi-sig approval flows"]'::jsonb,
    'Protected over $42M in client treasury assets during peak volatility events with zero automated liquidation occurrences.'
),
(
    'Kuro AI — Autonomous Code Review & Refactoring',
    'kuro-ai',
    'Autonomous multi-agent intelligence that reviews, security-audits, and refactors pull requests in real time.',
    'Kuro AI acts as a 24/7 staff engineer that inspects code diffs, identifies architectural antipatterns, runs security audits, and generates verified pull requests.',
    'AI & Automation',
    'live',
    '/images/projects/kuro-thumb.svg',
    '/images/projects/kuro-cover.svg',
    '["/images/projects/kuro-1.svg"]'::jsonb,
    ARRAY['Next.js', 'TypeScript', 'Python', 'LLM API', 'PostgreSQL', 'Docker'],
    'https://kuro.preview.silverline.studio',
    'https://github.com/silverlinestudio/kuro-ai',
    true,
    true,
    3,
    'Engineering leads spend over 35% of their weekly time reviewing boilerplate PRs, catching trivial syntax errors, and enforcing test coverage standards.',
    'Construct an autonomous review pipeline that provides senior-level architectural feedback, detects CVE vulnerabilities, and auto-proposes refactoring diffs.',
    'Developed a tiered multi-agent swarm analyzing AST representations, security rulebooks, and LLM reasoning to output actionable GitHub code comments.',
    'Terminal-inspired developer UI with syntax highlighting, inline diff viewer, and instant command-palette interaction.',
    'FastAPI & Next.js backend with asynchronous task queues, GitHub Webhook ingress, and vector semantic code search.',
    '["Automated semantic AST analysis", "Security vulnerability scanner (OWASP Top 10)", "One-click pull request refactoring", "CI/CD status gate integration"]'::jsonb,
    'Cut average PR review cycle turnaround from 18 hours to 14 minutes across 85 active software engineering repositories.'
),
(
    'Vanguard Mobile — Offline-First Field Telemetry',
    'vanguard-mobile',
    'Industrial field intelligence application for mission-critical remote infrastructure inspections.',
    'Vanguard Mobile gives field engineers rugged offline telemetry capture, geospatial asset tagging, and conflict-free peer synchronization.',
    'Mobile Applications',
    'completed',
    '/images/projects/vanguard-thumb.svg',
    '/images/projects/vanguard-cover.svg',
    '["/images/projects/vanguard-1.svg"]'::jsonb,
    ARRAY['React Native', 'Expo', 'TypeScript', 'SQLite', 'Supabase'],
    NULL,
    NULL,
    false,
    true,
    4,
    'Engineers inspecting remote wind farms and solar arrays operate with zero cellular reception, causing lost reports and manual data transcription errors.',
    'Provide a rugged, high-contrast mobile application that records sensor feeds, photos, and inspection checklists offline with zero data loss.',
    'Engineered an offline-first SQLite database layer on React Native paired with CRDT conflict resolution that syncs automatically when signal is regained.',
    'High-visibility outdoor contrast mode, large tactile touch targets, and haptic feedback confirmations.',
    'React Native (Expo EAS) client with local SQLite encryption, syncing to Supabase PostgreSQL via delta batching.',
    '["Conflict-free offline sync (CRDT)", "Hardware camera & LiDAR integration", "Geospatial coordinate watermarking", "Biometric authentication"]'::jsonb,
    'Deployed across 350+ field engineers, completing 45,000+ incident audits without a single data loss incident.'
),
(
    'Synapse Graph — Neural Knowledge Explorer',
    'synapse-graph',
    '3D force-directed knowledge graph visualizing complex organizational intelligence and relationships.',
    'Synapse Graph translates messy company wikis, code repos, and customer conversations into an interactive 3D spatial neural network.',
    'Experimental Concepts',
    'internal_experiment',
    '/images/projects/synapse-thumb.svg',
    '/images/projects/synapse-cover.svg',
    '["/images/projects/synapse-1.svg"]'::jsonb,
    ARRAY['Next.js', 'Three.js', 'WebGL', 'TypeScript', 'Tailwind CSS'],
    'https://synapse.preview.silverline.studio',
    'https://github.com/silverlinestudio/synapse-graph',
    false,
    true,
    5,
    'Corporate knowledge is silod across thousands of disparate documents, making cross-functional discovery virtually impossible.',
    'Build an intuitive 3D spatial graph that lets researchers zoom from high-level topics down to individual code functions.',
    'Created a custom Three.js WebGL force-directed graph renderer capable of simulating 50,000 nodes at 60 frames per second.',
    'Dark cosmic visual motif with glowing metallic silver nodes, dynamic edge tension lines, and kinetic camera controls.',
    'WebGL/Three.js frontend connected to graph database queries and vector embeddings.',
    '["3D force-directed physics engine", "Semantic similarity clustering", "Instant node search and pathfinding", "Interactive cluster drilldowns"]'::jsonb,
    'Showcased at internal lab demo days with an average engagement session length of 14 minutes per user.'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Team Members
INSERT INTO public.team_members (name, role, bio, avatar_url, skills, linkedin_url, github_url, display_order, published)
VALUES
(
    'Shivendra Pratap Singh',
    'Founder & Head of Product Engineering',
    'Passionate product builder and systems engineer. Leads architectural vision, product strategy, and high-performance engineering at SilverLine Studio.',
    '/images/team/shivendra.svg',
    ARRAY['Product Architecture', 'Next.js', 'TypeScript', 'System Design', 'Supabase', 'AI Systems'],
    'https://linkedin.com/in/shivendrapratapsingh',
    'https://github.com/shivendrapratapsingh',
    1,
    true
),
(
    'SilverLine Engineering Core',
    'Design & Engineering Collective',
    'Our multidisciplinary team of product designers, full-stack engineers, and systems architects dedicated to crafting next-generation digital products.',
    '/images/team/collective.svg',
    ARRAY['UI/UX Design', 'React / Next.js', 'React Native', 'PostgreSQL', 'Cloud Infrastructure', 'Motion Design'],
    'https://linkedin.com/company/silverlinestudio',
    'https://github.com/silverlinestudio',
    2,
    true
)
ON CONFLICT DO NOTHING;
