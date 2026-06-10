/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptItem } from './types';

export const CURATED_PROMPTS: PromptItem[] = [
  {
    id: 'p1',
    title: 'Submerged Velvet Portrait',
    prompt: 'A high-fashion avant-garde editorial portrait of a subject submerged under emerald-tinted water, draped in voluminous dark velvet fabric, heavy light refraction, cinematic lighting, film grain, Shot on 35mm --ar 4:5 --stylize 250',
    category: 'Editorial',
    tags: ['portrait', 'underwater', 'fabric', 'refraction'],
    imageUrl: 'https://picsum.photos/seed/velvet-editorial/800/1000',
    parameters: {
      aspectRatio: '4:5',
      model: 'Flux Dev',
      stylize: '250',
      seed: '34891024'
    },
    author: 'Rie Rasmussen',
    createdAt: '2026-06-01'
  },
  {
    id: 'p2',
    title: 'Concrete Brutalist Void',
    prompt: 'Minimalist brutalist concrete architecture overlooking a vast foggy canyon, central circular cutout framing a silent sun, dramatic shadows, raw texture, sharp geometric lines, volumetric light --ar 16:9 --style raw',
    category: 'Architecture',
    tags: ['brutalist', 'monolith', 'concrete', 'landscape'],
    imageUrl: 'https://picsum.photos/seed/brutalist-concrete/1200/675',
    parameters: {
      aspectRatio: '16:9',
      model: 'Midjourney v6.0',
      stylize: '100',
      chaos: '10',
      seed: '89102431'
    },
    author: 'Kenzo Tange',
    createdAt: '2026-06-03'
  },
  {
    id: 'p3',
    title: 'Iridescent Chitin Macro',
    prompt: 'Macro photograph of a crystalline beetle wing close up, hyper detailed iridescent chitin patterns, emerald and sapphire metallic hues, liquid droplets, focus stacking, studio lighting, macro lens --v 6.0',
    category: 'Macro',
    tags: ['insect', 'iridescent', 'metallic', 'pattern'],
    imageUrl: 'https://picsum.photos/seed/chitin-metallic/800/800',
    parameters: {
      aspectRatio: '1:1',
      model: 'Midjourney v6.0',
      stylize: '300',
      seed: '573102914'
    },
    author: 'Karl Blossfeldt',
    createdAt: '2026-06-04'
  },
  {
    id: 'p4',
    title: 'Shattered Monolith',
    prompt: 'An obsidian monolith towering over a desolate sodium-lit salt flat, fractures leaking cold blue light, low angle, vast scale, atmospheric haze, sci-fi landscape, extreme wide shot --ar 16:9',
    category: 'Sci-Fi',
    tags: ['sci-fi', 'obsidian', 'salt-flat', 'atmosphere'],
    imageUrl: 'https://picsum.photos/seed/monolith-obsidian/1200/675',
    parameters: {
      aspectRatio: '16:9',
      model: 'Midjourney v6.0',
      stylize: '500',
      chaos: '30',
      seed: '1129481'
    },
    author: 'Syd Mead',
    createdAt: '2026-06-05'
  },
  {
    id: 'p5',
    title: 'Minimalist Swiss Grid',
    prompt: 'Flat vector style illustration of a mid-century typewriter, isometric view, Swiss modernism, clean geometric shapes, cream and charcoal color palette, high-contrast, poster art --style raw',
    category: 'Vector',
    tags: ['swiss', 'vector', 'isometric', 'vintage'],
    imageUrl: 'https://picsum.photos/seed/swiss-vector/800/800',
    parameters: {
      aspectRatio: '1:1',
      model: 'DALL-E 3',
      quality: 'hd',
      seed: '90021'
    },
    author: 'Emil Ruder',
    createdAt: '2026-06-06'
  },
  {
    id: 'p6',
    title: 'Bento Interface Study',
    prompt: 'A clean modular hardware interface, dark brushed steel dials, orange glowing digital displays, knurled metal elements, highly tactile, functional industrial design, photorealistic product photography --ar 4:3',
    category: 'UI Design',
    tags: ['tactile', 'hardware', 'industrial', 'interface'],
    imageUrl: 'https://picsum.photos/seed/tactile-bento/800/600',
    parameters: {
      aspectRatio: '4:3',
      model: 'Flux Dev',
      stylize: '150',
      seed: '9482012'
    },
    author: 'Dieter Rams',
    createdAt: '2026-06-07'
  },
  {
    id: 'p7',
    title: 'Viscous Monolithic Flow',
    prompt: 'Suspended liquid chrome sculpture twisting in mid-air, highly reflective fluid dynamics, matte charcoal backdrop, volumetric studio softbox emission, sculptural minimalist form --ar 3:4',
    category: 'Abstract',
    tags: ['abstract', 'sculpture', 'fluid', 'chrome'],
    imageUrl: 'https://picsum.photos/seed/liquid-chrome-sculpt/800/1066',
    parameters: {
      aspectRatio: '3:4',
      model: 'Midjourney v6.0',
      seed: '883901'
    },
    author: 'Anish Kapoor',
    createdAt: '2026-06-08'
  },
  {
    id: 'p8',
    title: 'Ancient Cedar Canopy',
    prompt: 'Vast ancient cedar tree canopy, heavy morning mist, soft sunbeams filtering through dense moss-covered branches, deep green forest floor, wide-angle cinematic photography, atmospheric depth --ar 16:9',
    category: 'Nature',
    tags: ['forest', 'canopy', 'mist', 'cinematic'],
    imageUrl: 'https://picsum.photos/seed/cedar-mist/1200/675',
    parameters: {
      aspectRatio: '16:9',
      model: 'Flux Dev',
      seed: '3029148'
    },
    author: 'Ansel Adams',
    createdAt: '2026-06-09'
  },
  {
    id: 'p9',
    title: 'Solitary Sand Dune',
    prompt: 'A single perfectly sculpted sand dune at noon, sharp contrast between brilliant white gypsum sand and absolute black shadow, minimalist composition, fine grain, medium format photography --ar 4:3',
    category: 'Minimalist',
    tags: ['minimalist', 'desert', 'shadow', 'purity'],
    imageUrl: 'https://picsum.photos/seed/gypsum-dune/800/600',
    parameters: {
      aspectRatio: '4:3',
      model: 'Midjourney v6.0',
      stylize: '50',
      seed: '7231409'
    },
    author: 'Edward Weston',
    createdAt: '2026-06-10'
  },
  {
    id: 'p10',
    title: 'Soviet Brutalist Rover',
    prompt: 'Vintage 1970s magazine photograph of an experimental lunar rover parked next to a Soviet modular habitat, Soviet constructivism, Kodachrome film grain, muted warm color grading, cinematic shadows, retro-futurism --ar 4:5',
    category: 'Retro',
    tags: ['lunar', 'constructivism', 'film-grain', 'vintage'],
    imageUrl: 'https://picsum.photos/seed/soviet-lunar/800/1000',
    parameters: {
      aspectRatio: '4:5',
      model: 'Midjourney v6.0',
      stylize: '80',
      seed: '4502891'
    },
    author: 'Chernikhov Study',
    createdAt: '2026-06-10'
  }
];
