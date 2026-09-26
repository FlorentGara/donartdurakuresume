export type ProjectCategory =
  | 'Video Editing'
  | 'Reels'
  | 'Motion Graphics'
  | 'Graphic Design'
  | 'Social Media'
  | 'Other';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  client: string;
  description: string;
  thumbnail: string;
  video?: string;
  poster?: string;
  tools: string[];
  role: string;
  gallery: string[];
}

export interface CareerItem {
  period: string;
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  skills: string[];
}

export interface EducationItem {
  school: string;
  program: string;
  period: string;
  description?: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
}

export interface SkillItem {
  name: string;
  category: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export const profile = {
  name: 'Donart Duraku',
  role: 'Video Editor & Visual Creative',
  tagline: 'I turn raw footage into stories people remember.',
  bio: 'Video editing, motion graphics and visual storytelling for brands, creators and digital content.',
  about:
    'Donart Duraku is a video editor and visual creative focused on transforming raw footage into engaging, polished and purposeful visual stories. His work combines pacing, sound, motion, typography and visual composition to create content that feels intentional from the first frame to the last.',
  basedIn: '[LOCATION]',
  specialization: 'Video Editing',
  experience: '[YEARS]',
  availability: 'Available for selected projects',
  portrait:
    'https://images.pexels.com/photos/5811096/pexels-photo-5811096.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  heroImage:
    'https://images.pexels.com/photos/3379932/pexels-photo-3379932.jpeg?auto=compress&cs=tinysrgb&w=1920',
  heroOverlay:
    'https://images.pexels.com/photos/3379944/pexels-photo-3379944.jpeg?auto=compress&cs=tinysrgb&w=1920',
};

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Career', href: '#career' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const categories: ('All' | ProjectCategory)[] = [
  'All',
  'Video Editing',
  'Reels',
  'Motion Graphics',
  'Graphic Design',
  'Social Media',
  'Other',
];

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Brand Story Film',
    category: 'Video Editing',
    year: '2025',
    client: '[CLIENT]',
    description:
      'A cinematic brand film blending documentary-style interviews with product b-roll, color graded for a warm, premium feel.',
    thumbnail:
      'https://images.pexels.com/photos/3379940/pexels-photo-3379940.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
    role: 'Lead Editor, Colorist',
    gallery: [
      'https://images.pexels.com/photos/3379932/pexels-photo-3379932.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/33899243/pexels-photo-33899243.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p2',
    title: 'Short-Form Reel Series',
    category: 'Reels',
    year: '2025',
    client: '[CLIENT]',
    description:
      'A series of high-energy vertical reels designed for maximum retention, featuring snappy cuts, motion text and sound design.',
    thumbnail:
      'https://images.pexels.com/photos/6954104/pexels-photo-6954104.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['Premiere Pro', 'After Effects', 'CapCut'],
    role: 'Editor, Motion Designer',
    gallery: [
      'https://images.pexels.com/photos/6953836/pexels-photo-6953836.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p3',
    title: 'Motion Graphics Package',
    category: 'Motion Graphics',
    year: '2024',
    client: '[CLIENT]',
    description:
      'A complete animated graphics package including lower thirds, transitions, intros and social templates.',
    thumbnail:
      'https://images.pexels.com/photos/6679202/pexels-photo-6679202.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['After Effects', 'Illustrator'],
    role: 'Motion Designer',
    gallery: [
      'https://images.pexels.com/photos/6419629/pexels-photo-6419629.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6741013/pexels-photo-6741013.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p4',
    title: 'Color Grading Showcase',
    category: 'Video Editing',
    year: '2024',
    client: '[CLIENT]',
    description:
      'Before-and-after color grading demonstration across multiple genres — from commercial to documentary.',
    thumbnail:
      'https://images.pexels.com/photos/30229850/pexels-photo-30229850.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['DaVinci Resolve'],
    role: 'Colorist',
    gallery: [
      'https://images.pexels.com/photos/39694504/pexels-photo-39694504.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p5',
    title: 'Social Media Campaign',
    category: 'Social Media',
    year: '2025',
    client: '[CLIENT]',
    description:
      'A multi-platform social campaign with platform-native edits, motion captions and branded templates.',
    thumbnail:
      'https://images.pexels.com/photos/8357239/pexels-photo-8357239.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
    role: 'Editor, Social Strategist',
    gallery: [
      'https://images.pexels.com/photos/6347621/pexels-photo-6347621.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p6',
    title: 'Poster & Key Art',
    category: 'Graphic Design',
    year: '2024',
    client: '[CLIENT]',
    description:
      'Poster and key art design for a short film, combining photography, typography and texture.',
    thumbnail:
      'https://images.pexels.com/photos/14506024/pexels-photo-14506024.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['Photoshop', 'Illustrator'],
    role: 'Graphic Designer',
    gallery: [
      'https://images.pexels.com/photos/13845237/pexels-photo-13845237.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p7',
    title: 'YouTube Long-Form Edit',
    category: 'Video Editing',
    year: '2025',
    client: '[CLIENT]',
    description:
      'A 20-minute documentary-style YouTube video with multi-cam editing, archival footage and motion graphics.',
    thumbnail:
      'https://images.pexels.com/photos/8774464/pexels-photo-8774464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['Premiere Pro', 'After Effects'],
    role: 'Editor',
    gallery: [
      'https://images.pexels.com/photos/11063289/pexels-photo-11063289.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  {
    id: 'p8',
    title: 'Abstract Title Sequence',
    category: 'Motion Graphics',
    year: '2023',
    client: '[CLIENT]',
    description:
      'An abstract, light-driven title sequence with particle systems and custom sound design.',
    thumbnail:
      'https://images.pexels.com/photos/21243683/pexels-photo-21243683.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tools: ['After Effects', 'DaVinci Resolve'],
    role: 'Motion Designer, Sound Designer',
    gallery: [
      'https://images.pexels.com/photos/11774154/pexels-photo-11774154.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
];

export const career: CareerItem[] = [
  {
    period: '2025 — Present',
    title: 'Video Editor',
    company: '[Company Name]',
    description:
      'Editing short-form and long-form content, creating social media assets and developing visual concepts for digital campaigns.',
    responsibilities: [
      'Edit and deliver video content across multiple platforms',
      'Develop visual concepts and motion graphics templates',
      'Collaborate with creative teams on campaign direction',
    ],
    skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
  },
  {
    period: '2023 — 2025',
    title: 'Freelance Video Editor',
    company: '[Company Name]',
    description:
      'Worked with brands and creators to produce polished video content, from concept to final delivery.',
    responsibilities: [
      'Manage end-to-end editing workflow for multiple clients',
      'Create motion graphics and visual assets',
      'Deliver platform-native content on schedule',
    ],
    skills: ['Premiere Pro', 'After Effects', 'Photoshop'],
  },
  {
    period: '2021 — 2023',
    title: 'Junior Video Editor',
    company: '[Company Name]',
    description:
      'Supported senior editors on commercial and social projects while developing editing and motion graphics skills.',
    responsibilities: [
      'Assist with assembly edits and rough cuts',
      'Create social media cut-downs and variations',
      'Organize and manage media assets',
    ],
    skills: ['Premiere Pro', 'CapCut'],
  },
];

export const education: EducationItem[] = [
  {
    school: '[School Name]',
    program: '[Program / Degree]',
    period: '[Start Year — End Year]',
    description:
      'Foundation in visual media, editing principles and digital content production.',
  },
  {
    school: '[School Name]',
    program: '[Course / Certification]',
    period: '[Year]',
    description: 'Specialized training in motion graphics and post-production.',
  },
];

export const services: ServiceItem[] = [
  {
    number: '01',
    title: 'Video Editing',
    description: 'Full-service editing from assembly to final cut, with pacing and storytelling at the core.',
  },
  {
    number: '02',
    title: 'Short-Form / Reels',
    description: 'High-retention vertical content designed for Instagram, TikTok and YouTube Shorts.',
  },
  {
    number: '03',
    title: 'Motion Graphics',
    description: 'Animated lower thirds, titles, transitions and custom motion design packages.',
  },
  {
    number: '04',
    title: 'Graphic Design',
    description: 'Posters, thumbnails, key art and visual identity for digital and print.',
  },
  {
    number: '05',
    title: 'Social Media Content',
    description: 'Platform-native edits, motion captions and branded content templates.',
  },
  {
    number: '06',
    title: 'Color Grading',
    description: 'Cinematic color correction and grading to give footage a polished, consistent look.',
  },
  {
    number: '07',
    title: 'YouTube / Long-Form Editing',
    description: 'Documentary-style and long-form edits with multi-cam, archival footage and motion graphics.',
  },
];

export const skills: SkillItem[] = [
  { name: 'Adobe Premiere Pro', category: 'Editing' },
  { name: 'Adobe After Effects', category: 'Motion' },
  { name: 'Adobe Photoshop', category: 'Design' },
  { name: 'Adobe Illustrator', category: 'Design' },
  { name: 'DaVinci Resolve', category: 'Color' },
  { name: 'CapCut', category: 'Editing' },
  { name: 'Motion Graphics', category: 'Motion' },
  { name: 'Color Grading', category: 'Color' },
  { name: 'Sound Design', category: 'Audio' },
  { name: 'Typography', category: 'Design' },
  { name: 'Visual Storytelling', category: 'Craft' },
  { name: 'Social Media Editing', category: 'Editing' },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Understand',
    description: 'Understand the project, audience and desired result.',
  },
  {
    number: '02',
    title: 'Build',
    description: 'Structure the story, pacing and visual rhythm.',
  },
  {
    number: '03',
    title: 'Refine',
    description: 'Add sound design, motion graphics, typography, color and detail.',
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'Export and deliver a polished final piece ready for its platform.',
  },
];

export const socialLinks: SocialLink[] = [
  { label: 'Email', url: '[EMAIL]' },
  { label: 'Instagram', url: '[INSTAGRAM]' },
  { label: 'LinkedIn', url: '[LINKEDIN]' },
  { label: 'Behance', url: '[BEHANCE]' },
];

export const projectTypes = [
  'Video Editing',
  'Reels / Short-form',
  'Motion Graphics',
  'Graphic Design',
  'YouTube / Long-form',
  'Other',
];
