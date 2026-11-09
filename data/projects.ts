export type Project = {
  id: string
  title: string
  year: string
  category: 'Graphic Design' | 'Motion Design'
  type: 'graphic' | 'motion'
  /** Short lowercase label shown above the title, e.g. "packaging" */
  discipline: string
  slides: number
  isVideo: boolean
  desc: string
  skills: string[]
  images?: string[]
  video?: string
  videos?: string[]
  sideBySide?: boolean
}

export const allProjects: Project[] = [
  {
    id: 'rolan',
    title: 'Termomate',
    year: '2022',
    category: 'Graphic Design',
    type: 'graphic',
    discipline: 'packaging',
    slides: 3,
    isVideo: false,
    desc: 'Packaging concept for an Argentine self-brewing thermos. A vertical box with a clean two-tone gradient, white line illustrations of the modular components, and botanical yerba mate motifs layered into the background. Designed as a full range — teal, magenta and green variants share identical layout logic, making colour the sole SKU differentiator. The interior panel turns unboxing into a guided onboarding moment with numbered steps and exploded-view diagrams that reinforce the product\'s autocebante innovation.',
    skills: ['Packaging Design', 'Adobe Illustrator', 'Photoshop', 'Adobe Dimension'],
    images: [
      '/projects/rolan/slide-1.webp',
      '/projects/rolan/slide-2.webp',
      '/projects/rolan/slide-3.webp',
    ],
  },
  {
    id: 'corazon',
    title: 'Corazón Artesanal',
    year: '2023',
    category: 'Graphic Design',
    type: 'graphic',
    discipline: 'editorial',
    slides: 5,
    isVideo: false,
    desc: 'A magazine concept celebrating the artisan and natural heritage of Corrientes, where dramatic full-bleed spreads with oversized cropped typography open each chapter and interior pages balance photography, illustration and custom infographics. Color works as a section marker, terracotta for human stories, teal for ecology, lime green for sustainability, and recurring paintbrush-stroke motifs tie it all together with a handcrafted feel that mirrors the subject matter itself.',
    skills: ['Editorial Design', 'Adobe Illustrator', 'InDesign', 'Illustration', 'Procreate', 'Infographic Design'],
    images: [
      '/projects/corazon/slide-1.webp',
      '/projects/corazon/slide-2.webp',
      '/projects/corazon/slide-3.webp',
      '/projects/corazon/slide-4.webp',
      '/projects/corazon/slide-5.webp',
    ],
  },
  {
    id: 'david-weisz',
    title: 'David Weisz',
    year: '2024',
    category: 'Graphic Design',
    type: 'graphic',
    discipline: 'social media',
    slides: 4,
    isVideo: false,
    desc: 'An Instagram carousel for David Weisz, a legacy diamond jewelry brand, built on a cool silver and pearl-grey palette that lets the tennis bracelets do the visual heavy lifting. Product photography is composited against geometric crystal forms and vintage postage stamp textures to build a generational heritage narrative, while spaced serif typography and restrained layouts keep the overall feel polished and editorial.',
    skills: ['Graphic Design', 'Social Media Design', 'Photo Editing', 'Photoshop', 'Adobe Illustrator'],
    images: [
      '/projects/david-weisz/slide-1.webp',
      '/projects/david-weisz/slide-2.webp',
      '/projects/david-weisz/slide-3.webp',
      '/projects/david-weisz/slide-4.webp',
    ],
  },
  {
    id: 'big-bear',
    title: 'Big Bear Events',
    year: '2020–2024',
    category: 'Graphic Design',
    type: 'graphic',
    discipline: 'brand system',
    slides: 5,
    isVideo: false,
    desc: 'A full brand design system for Big Bear Events, a UK trail running company, developed over four years of freelance work spanning print, merchandise and social media. The deliverables range from event flyers and outdoor banners to branded headbands and a custom alcohol-free beer can design, all anchored in a deep red and cream palette with bold display typography and action photography. Social media posts follow a consistent templated system adapted per event, keeping the brand recognizable across a busy calendar of challenges.',
    skills: ['Branding', 'Graphic Design', 'Editorial Design', 'Social Media Design', 'Adobe Illustrator', 'Photoshop', 'Premiere Pro', 'Video Editing'],
    images: [
      '/projects/big-bear/slide-1.webp',
      '/projects/big-bear/slide-2.webp',
      '/projects/big-bear/slide-3.webp',
    ],
    videos: [
      '/projects/big-bear/video-1.mp4',
      '/projects/big-bear/video-2.mp4',
    ],
  },
  {
    id: 'yasi',
    title: 'Yasí',
    year: '2024',
    category: 'Graphic Design',
    type: 'graphic',
    discipline: 'branding',
    slides: 2,
    isVideo: false,
    desc: 'A complete brand identity for Yasí, my own made-to-order clothing label, built around a crescent moon and star mark in a magenta, navy and cream palette. The system spans every touchpoint, from editorial magazine layouts and business cards to garment hangtags, tote bags, stickers and woven care labels, with the logo adapting across colorways and scales while keeping a consistent handmade-luxury feel throughout.',
    skills: ['Branding', 'Graphic Design', 'Editorial Design', 'Social Media Design', 'Adobe Illustrator', 'Photoshop'],
    images: [
      '/projects/yasi/slide-1.webp',
      '/projects/yasi/slide-2.webp',
    ],
  },
  {
    id: 'skipper',
    title: 'Skipper',
    year: '2024',
    category: 'Motion Design',
    type: 'motion',
    discipline: 'explainer',
    slides: 1,
    isVideo: true,
    desc: 'An explainer video for Skipper, a subscription-based design and development agency I co-founded, combining frame-by-frame character animation, illustration, motion graphics and video editing into a single cohesive piece. The video moves across multiple visual registers — from hand-drawn stick figures on textured paper backgrounds, to lush painted cartoon seascapes, to infographic sequences — all tied together by a nautical adventure world that makes a complex service model feel fun and approachable.',
    skills: ['Video Editing', 'Motion Graphics', 'Frame-by-Frame', 'Procreate Dreams', 'After Effects', 'Premiere Pro', 'Adobe Illustrator', 'Photoshop'],
    video: '/projects/skipper/video.mp4',
    images: ['/projects/skipper/thumbnail.webp'],
  },
  {
    id: 'forest-founders',
    title: 'Forest Founders',
    year: '2024',
    category: 'Motion Design',
    type: 'motion',
    discipline: 'motion ad',
    slides: 1,
    isVideo: true,
    desc: 'A motion graphics ad for Forest Founders Rewards, an eco-loyalty app that plants a tree for every purchase at partner stores. The video mixes flat vector animation, character animation with illustrated mascots, real footage composited with animated elements, and infographic sequences — all layered over blurred real-world environments to bridge the digital product and the physical world. The visual language shifts fluidly between a clean flat style for storytelling, a darker cinematic treatment for brand moments, and a data-driven layout for the environmental impact section, held together by the warm orange of the characters and the forest greens of the brand palette.',
    skills: ['Video Editing', 'Motion Graphics', 'After Effects', 'Premiere Pro', 'Adobe Illustrator'],
    video: '/projects/forest-founders/video.mp4',
    images: ['/projects/forest-founders/thumbnail.webp'],
  },
  {
    id: 'medstar',
    title: 'MedStar',
    year: '2023',
    category: 'Motion Design',
    type: 'motion',
    discipline: 'training video',
    slides: 1,
    isVideo: true,
    desc: 'Internal training video for MedStar Washington Hospital Center, built entirely in flat vector illustration with rigged character animation, covering protocols for communicating with patients who speak different languages or use sign language. The visual world is detailed and built with purpose: from a fully illustrated hospital exterior to interior waiting rooms, patient rooms and corridors, with a diverse cast of animated characters carrying the narrative across multiple scenarios. Layout transitions like diagonal split screens and numbered checklist sequences keep the pacing clear and instructional without losing the warmth of the illustration.',
    skills: ['Character Animation', 'Motion Graphics', 'Video Editing', 'After Effects', 'Premiere Pro', 'Adobe Illustrator'],
    video: '/projects/medstar/video.mp4',
    images: ['/projects/medstar/thumbnail.webp'],
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    year: '2024',
    category: 'Motion Design',
    type: 'motion',
    discipline: 'video edit',
    slides: 1,
    isVideo: true,
    desc: 'A video editing and motion graphics test for an AI chatbot agency, combining the client\'s footage with animated graphic overlays and b-roll to keep the pacing tight and visually engaging.',
    skills: ['Video Editing', 'Motion Graphics', 'Premiere Pro', 'After Effects'],
    video: '/projects/ai-chatbot/video.mp4',
    images: ['/projects/ai-chatbot/thumbnail.webp'],
  },
  {
    id: 'ugc',
    title: 'UGC',
    year: '2024–2026',
    category: 'Motion Design',
    type: 'motion',
    discipline: 'short form',
    slides: 1,
    isVideo: false,
    sideBySide: true,
    desc: 'A pair of UGC-style short-form videos edited for maximum retention, using fast cuts, punchy captions and b-roll intercutting to keep the pace tight and the viewer hooked through the full watch time.',
    skills: ['Video Editing', 'Motion Graphics', 'Premiere Pro'],
    videos: [
      '/projects/ugc/video-1.mp4',
      '/projects/ugc/video-2.mp4',
    ],
    images: ['/projects/ugc/thumbnail.webp'],
  },
]
