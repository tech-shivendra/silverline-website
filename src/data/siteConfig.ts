export const siteConfig = {
  name: 'SilverLine Studio',
  shortName: 'SilverLine',
  brandStatement: "We don't just build products. We build what comes next.",
  supportingStatement: 'We design, engineer and launch digital experiences that turn ambitious ideas into meaningful products.',
  heroEyebrow: 'INDEPENDENT PRODUCT DEVELOPMENT STUDIO',
  heroHeading: 'We turn ambitious ideas into extraordinary digital products.',
  heroSupportingText: 'From the first sketch to the final deployment, we design and engineer digital experiences built to make a difference.',
  philosophyHeading: 'Good ideas are everywhere. Great execution isn\'t.',
  principles: [
    {
      number: '01',
      title: 'Think Beyond',
      description: 'We challenge conventional templates and surface hidden opportunities, designing products that anticipate tomorrow.'
    },
    {
      number: '02',
      title: 'Build With Purpose',
      description: 'Every line of code and interface decision is engineered intentionally to deliver measurable user value and business resilience.'
    },
    {
      number: '03',
      title: 'Deliver With Precision',
      description: 'Rigorous architecture, meticulous craft, and uncompromising testing ensure seamless execution from first build to global scale.'
    }
  ],
  process: [
    {
      number: '01',
      title: 'Discover',
      description: 'Understand users, business goals, and technical requirements through thorough discovery sessions.'
    },
    {
      number: '02',
      title: 'Define',
      description: 'Establish precise scope, product architecture, milestone timelines, and technical stack direction.'
    },
    {
      number: '03',
      title: 'Design',
      description: 'Create high-fidelity interactive wireframes, prototypes, and a robust design system with micro-interactions.'
    },
    {
      number: '04',
      title: 'Develop',
      description: 'Engineer full-stack frontend, backend APIs, database schemas, and AI integrations with strict code quality.'
    },
    {
      number: '05',
      title: 'Deploy & Evolve',
      description: 'Launch to production edge infrastructure, monitor telemetry, maintain security, and iterate continuously.'
    }
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://silverline.studio',
  links: {
    email: 'studio@silverline.design',
    github: 'https://github.com/silverlinestudio',
    linkedin: 'https://linkedin.com/company/silverlinestudio',
    twitter: 'https://twitter.com/silverlinestudio'
  },
  navLinks: [
    { name: 'Work', href: '/work' },
    { name: 'Services', href: '/services' },
    { name: 'Studio', href: '/studio' },
    { name: 'Playground', href: '/playground' },
    { name: 'Contact', href: '/contact' }
  ]
};
