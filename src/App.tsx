/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { AdminPanelModal } from './components/AdminPanelModal';
import { FilterBar } from './components/FilterBar';
import { PromptCard } from './components/PromptCard';
import { PromptModal } from './components/PromptModal';
import { AddPromptModal } from './components/AddPromptModal';
import { InfoModal } from './components/InfoModal';
import { CURATED_PROMPTS } from './data';
import { PromptItem, CategoryType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkle, Sliders, Trash, Check, X, CircleNotch, ArrowRight } from '@phosphor-icons/react';

const LOCAL_STORAGE_KEY = 'aistudio_prompts_gallery';

// Dynamically creates a diverse database of 120 high-fidelity prompt visual cards using rich Midjourney & Flux specs to provide boundless infinite scroll.
const expandPromptsList = (basePrompts: PromptItem[]): PromptItem[] => {
  const result: PromptItem[] = [...basePrompts];
  
  const authors = [
    'Rie Rasmussen', 'Kenzo Tange', 'Karl Blossfeldt', 'Syd Mead', 'Emil Ruder',
    'Dieter Rams', 'Anish Kapoor', 'Ansel Adams', 'Edward Weston', 'Chernikhov Study'
  ];
  const aspectRatios = ['4:5', '16:9', '1:1', '4:3', '3:4'];
  const models = ['Flux Dev', 'Midjourney v6.0', 'DALL-E 3', 'Stable Diffusion 3'];
  
  const extraPromptsData = [
    {
      title: 'Neon Brutalist Sanctuary',
      prompt: 'A towering brutalist cement chamber, warm neon tube strips hanging, long reflective dark puddles on floor, misty mood, dramatic cinematic volumetric light beams --ar 4:3',
      category: 'Architecture',
      tags: ['brutalist', 'neon', 'concrete', 'atrium']
    },
    {
      title: 'Shimmering Wing Macro',
      prompt: 'Under high zoom macro setting, a flawless beetle wing surface showing gorgeous iridescent violet and blue crystalline geometry, wet dew drop beads detail, macro lens, photorealistic studio lighting --ar 1:1',
      category: 'Macro',
      tags: ['metallic', 'pattern', 'insect', 'iridescent']
    },
    {
      title: 'Monographic Grid Typewriter',
      prompt: 'A beautiful flat vector illustration featuring a vintage modular computer unit, isometric projection style, swiss typography, light beige and anthracite colors --style raw',
      category: 'Vector',
      tags: ['swiss', 'vector', 'isometric', 'vintage']
    },
    {
      title: 'Subtle Fluid Refraction Portrait',
      prompt: 'Avant-garde luxury high fashion photographic portrait of a face partially submerged in water, soft linen texture fabric floating, moody sunlight refraction rays, delicate grain --ar 4:5',
      category: 'Editorial',
      tags: ['portrait', 'fashion', 'underwater', 'refraction']
    },
    {
      title: 'Soviet Fusion Sphere',
      prompt: '1970s magazine print photography of a monumental modernist fusion core laboratory, retro-futurism, constructivism, rich kodachrome film grain profile, saturated highlights --ar 4:5',
      category: 'Retro',
      tags: ['constructivism', 'vintage', 'industrial', 'soviet']
    },
    {
      title: 'Aero Turbine Blueprint',
      prompt: 'Sleek white line technical drawing diagram outlining a mechanical jet motor component, set against a dark blueprints paper background grid, minimal poster art aesthetic --ar 1:1',
      category: 'Vector',
      tags: ['blueprint', 'vector', 'technical', 'blueprint']
    },
    {
      title: 'Mercury Wave Helix',
      prompt: 'Suspended liquid silver sculpture flowing in a pure spiral inside a dark, minimal velvet box setting, highly polished render, volumetric soft light --ar 3:4',
      category: 'Abstract',
      tags: ['abstract', 'fluid', 'mercury', 'chrome']
    },
    {
      title: 'Sprawling Redwood Dawn',
      prompt: 'Giant Redwood forest floor view looking up inside mist-laden trees, beautiful soft gold dust beams breaking, deep organic rich green grass --ar 16:9',
      category: 'Nature',
      tags: ['forest', 'canopy', 'mist', 'golden']
    },
    {
      title: 'Onyx Monolith Salt-Lake',
      prompt: 'A stellar pitch-black glass slab standing in the center of a dry white salt desert, cinematic backdrop, star paths sky, extreme sharp geometric shadows --ar 16:9',
      category: 'Sci-Fi',
      tags: ['sci-fi', 'obsidian', 'salt-lake', 'atmosphere']
    },
    {
      title: 'Lattice shadow study',
      prompt: 'Exquisite minimal still life camera shot of a handmade paper screen, sharp plant branch shadows cast against ivory chalk walls, pure peaceful setting --ar 4:3',
      category: 'Minimalist',
      tags: ['minimalist', 'shadow', 'still-life', 'purity']
    }
  ];

  // Extend base gallery dataset to 100 entries to allow scroll exploration
  for (let i = 0; i < 110; i++) {
    const extraItem = extraPromptsData[i % extraPromptsData.length];
    const promptId = `dyn-${i}`;
    const seedNum = (1000000 + i * 37291).toString();
    const ar = aspectRatios[i % aspectRatios.length];
    
    const sizeMap: Record<string, string> = {
      '4:5': '800/1000',
      '16:9': '1200/675',
      '1:1': '800/800',
      '4:3': '800/600',
      '3:4': '800/1066'
    };
    const resolution = sizeMap[ar] || '800/1000';
    
    // Choose seeds containing keywords to fetch distinct gorgeous pictures from Picsum
    const seedKeys = [
      'shadow', 'glow', 'brutalist', 'obsidian', 'metallic', 'pattern', 'blueprints', 'sieve', 'velvet',
      'fog', 'canyon', 'type', 'cyber', 'helix', 'canopy', 'cedar', 'sand', 'prism', 'soviet', 'fused',
      'tulle', 'ripple', 'mercury', 'chrome', 'quartz', 'meteor', 'concrete', 'grid', 'monolith'
    ];
    const key = seedKeys[i % seedKeys.length];
    const imageUrl = `https://picsum.photos/seed/prompt-grid-${key}-${i}/${resolution}`;
    
    result.push({
      id: promptId,
      title: `${extraItem.title} #${i + 1}`,
      prompt: extraItem.prompt.replace('--ar 16:9', `--ar ${ar}`).replace('--ar 4:5', `--ar ${ar}`).replace('--ar 4:3', `--ar ${ar}`).replace('--ar 1:1', `--ar ${ar}`),
      category: extraItem.category as any,
      tags: [...extraItem.tags],
      imageUrl,
      parameters: {
        aspectRatio: ar,
        model: models[i % models.length],
        stylize: (100 + (i * 25) % 400).toString(),
        seed: seedNum
      },
      author: authors[i % authors.length],
      createdAt: '2026-06-10'
    });
  }
  
  return result;
};

export default function App() {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('prompt_gallery_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark'; // Defaulting to premium dark mode as requested by user
    } catch {
      return 'dark';
    }
  });

  // Core state containing prompts list - seeded with comprehensive database setup
  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 20) return parsed;
      }
      return expandPromptsList(CURATED_PROMPTS);
    } catch {
      return expandPromptsList(CURATED_PROMPTS);
    }
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);



  // Infinite scroll load more pagination states
  const [itemsToShow, setItemsToShow] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [intersectRef, setIntersectRef] = useState<HTMLDivElement | null>(null);

  // Modal open states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Semantic Search and Slideshow backgrounds states
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchExplanation, setAiSearchExplanation] = useState<string | null>(null);
  const [activeBgIdx, setActiveBgIdx] = useState(0);

  const latestFiveImages = useMemo(() => {
    return prompts.slice(0, 5).map((p) => p.imageUrl);
  }, [prompts]);

  useEffect(() => {
    if (latestFiveImages.length === 0) return;
    const timer = setInterval(() => {
      setActiveBgIdx((prev) => (prev + 1) % latestFiveImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [latestFiveImages]);

  // Memoize unique filters & categories - Computed early to satisfy block scope deps
  const availableCategories = useMemo<CategoryType[]>(() => {
    return ['All', 'Editorial', 'Architecture', 'Macro', 'Sci-Fi', 'Vector', 'UI Design', 'Abstract', 'Nature', 'Minimalist', 'Retro'];
  }, []);

  const allUniqueTags = useMemo<string[]>(() => {
    const tagsSet = new Set<string>();
    prompts.forEach((item) => {
      item.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [prompts]);

  const handleAiSearch = async () => {
    const queryToSearch = searchQuery.trim();
    if (!queryToSearch) return;

    setIsAiSearching(true);
    setAiSearchExplanation(null);

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryToSearch,
          availableCategories,
          allUniqueTags: allUniqueTags.slice(0, 80),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Server error occurred.');
      }

      const data = await response.json();

      if (data.refinedSearchTerm) {
        setSearchQuery(data.refinedSearchTerm);
      }

      if (data.relatedCategories && data.relatedCategories.length > 0) {
        // Ensure the category is valid
        const cat = data.relatedCategories[0];
        if (availableCategories.includes(cat as CategoryType)) {
          setSelectedCategory(cat as CategoryType);
        }
      } else {
        setSelectedCategory('All');
      }

      if (data.relatedTags && data.relatedTags.length > 0) {
        setSelectedTags(data.relatedTags);
      } else {
        setSelectedTags([]);
      }

      if (data.aiExplanation) {
        setAiSearchExplanation(data.aiExplanation);
      }
    } catch (err: any) {
      console.error('Semantic AI search failed:', err);
      setAiSearchExplanation(`Setup / Connection error: ${err.message || 'Could not complete semantic match.'}`);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filter implementation computed early for dep usage
  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      // 1. Category search
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 2. Selected tags intersection search
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((t) => item.tags.includes(t));
        if (!hasAllTags) return false;
      }

      // 3. Text query search
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesPrompt = item.prompt.toLowerCase().includes(query);
        const matchesAuthor = item.author.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));

        return matchesTitle || matchesPrompt || matchesAuthor || matchesCategory || matchesTags;
      }

      return true;
    });
  }, [prompts, searchQuery, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Sync theme changes back to local storage
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('prompt_gallery_theme', next);
      } catch (err) {
        console.warn('Storage sync issue:', err);
      }
      return next;
    });
  };

  // Sync prompts state back to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.warn('Failed to persist prompts to local storage:', e);
    }
  }, [prompts]);

  // Reset itemsToShow whenever active filters change to keep load list clean
  useEffect(() => {
    setItemsToShow(12);
  }, [searchQuery, selectedCategory, selectedTags]);

  // Intersection Observer for Infinite Scroll loading triggers
  useEffect(() => {
    if (!intersectRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && itemsToShow < filteredPrompts.length) {
          setIsLoadingMore(true);
          // High-fidelity elegant delay to let users observe the prompt pipeline syncing
          setTimeout(() => {
            setItemsToShow((prev) => Math.min(prev + 12, filteredPrompts.length));
            setIsLoadingMore(false);
          }, 850);
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    );

    observer.observe(intersectRef);
    return () => observer.disconnect();
  }, [intersectRef, isLoadingMore, itemsToShow, filteredPrompts.length]);

  // Handle successful copying feedback
  const triggerCopyToast = (itemTitle: string) => {
    setToastMessage(`Copied prompt for [ ${itemTitle.toUpperCase()} ] to your clipboard`);
    // Clear toast after timer
    setTimeout(() => {
      setToastMessage((prev) => (prev?.includes(itemTitle.toUpperCase()) ? null : prev));
    }, 2500);
  };

  const handleAddNewPrompt = (newPrompt: PromptItem) => {
    setPrompts((prev) => [newPrompt, ...prev]);
    setToastMessage(`Success: added prompt ${newPrompt.title.toUpperCase()} to list browser library`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const resetLibraryDefaults = () => {
    if (window.confirm('Do you want to restore the prompt archive list back to factory defaults? Your custom submissions will be deleted.')) {
      setPrompts(expandPromptsList(CURATED_PROMPTS));
      setSelectedCategory('All');
      setSelectedTags([]);
      setSearchQuery('');
      setToastMessage('Library restored back to factory defaults');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setToastMessage('Deleted prompt entry successfully from archive database');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdatePrompt = (updated: PromptItem) => {
    setPrompts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setToastMessage(`Updated prompt entry successfully: [ ${updated.title.toUpperCase()} ]`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Split itemsToShow items into 3 static columns for responsive desktop layout (e.g. tablet & medium monitors)
  const desktopColumns3 = useMemo(() => {
    const cols: PromptItem[][] = [[], [], []];
    filteredPrompts.slice(0, itemsToShow).forEach((item, idx) => {
      cols[idx % 3].push(item);
    });
    return cols;
  }, [filteredPrompts, itemsToShow]);

  // Split itemsToShow items into 4 static columns for widescreen monitor setups, using space perfectly while preserving gorgeous, large image views
  const desktopColumns4 = useMemo(() => {
    const cols: PromptItem[][] = [[], [], [], []];
    filteredPrompts.slice(0, itemsToShow).forEach((item, idx) => {
      cols[idx % 4].push(item);
    });
    return cols;
  }, [filteredPrompts, itemsToShow]);

  return (
    <main className={`min-h-[100dvh] font-sans transition-colors duration-500 overflow-x-hidden w-full max-w-full pb-20 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      
      {/* Decorative Fixed Film Grain Overlay - Luxury Editorial feel */}
      <div className={`fixed inset-0 z-50 pointer-events-none mix-blend-overlay bg-repeat bg-[url('https://picsum.photos/seed/sand-noise/128/128')] transition-opacity duration-550 ${
        theme === 'dark' ? 'opacity-[0.012]' : 'opacity-[0.022]'
      }`} />

      {/* Hero Header Presentation with Blurred Background Slideshow of 5 Latest Images */}
      <section className="relative overflow-hidden w-full border-b border-zinc-200/5 select-none pt-2 pb-16 md:pb-24">
        {/* Animated 5 latest images blurred in background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <AnimatePresence>
            {latestFiveImages[activeBgIdx] && (
              <motion.div
                key={activeBgIdx}
                initial={{ opacity: 0, scale: 1.16 }}
                animate={{ opacity: theme === 'dark' ? 0.65 : 0.45, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 4.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${latestFiveImages[activeBgIdx]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(16px)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Tactical Retro Animated Pixel Mesh Overlay */}
          <div className={`absolute inset-0 z-[1] opacity-75 mix-blend-overlay ${
            theme === 'dark' ? 'pixel-mesh-dark' : 'pixel-mesh-light'
          }`} />

          {/* Subtle radial wash mask */}
          <div className={`absolute inset-0 z-[2] ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-zinc-950/20 via-zinc-950/75 to-zinc-950'
              : 'bg-gradient-to-b from-zinc-50/20 via-zinc-50/75 to-zinc-50'
          }`} />
        </div>

        <div className="relative z-10">
          {/* Header element with motion entry */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          >
            <Header
              theme={theme}
              onToggleTheme={toggleTheme}
              onAdminClick={() => setIsAdminOpen(true)}
            />
          </motion.div>

          <div className="mx-auto max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1780px] px-6 md:px-8 xl:px-12 pt-8 md:pt-14 transition-all duration-300">
            <div className="flex flex-col items-center text-center max-w-4xl xl:max-w-5xl mx-auto">
              {/* 1. First Text: Title (Elegant tracked/tight casing) */}
              <motion.h2
                initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
                className={`font-sans text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tighter leading-tight uppercase ${
                  theme === 'dark' ? 'text-white' : 'text-zinc-950'
                }`}
              >
                Curate, Modify, and <span className="text-blue-500">Extract</span> AI Prompts
              </motion.h2>
            
            {/* 2. Second Text: Sub-Headline/Description */}
            <motion.p
              initial={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.2 }}
              className={`mt-5 font-mono text-xs md:text-sm xl:text-base leading-relaxed max-w-2xl xl:max-w-3xl text-balance ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              A premium workspace cataloging high-fidelity prompt syntaxes. Click on prompts to immediately copy, or inspect parameters to modify seeds and aspect ratios dynamically.
            </motion.p>
 
            {/* Centered AI Search Input Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 85, damping: 16, delay: 0.28 }}
              className="mt-10 w-full max-w-2xl xl:max-w-3xl"
            >
              <div className="relative group">
                {/* Visual glowing border when focused */}
                <div className={`absolute -inset-1 rounded-full blur opacity-55 animate-glow-gradient transition duration-550 group-within:opacity-100 z-0 bg-gradient-to-r ${
                  theme === 'dark' ? 'from-blue-600 via-indigo-500 to-blue-500' : 'from-zinc-400 via-zinc-300 to-zinc-400'
                }`} />
                
                <div className={`relative flex items-center rounded-full border shadow-sm z-10 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'border-zinc-800 bg-zinc-900/90 text-zinc-100 focus-within:border-blue-500' 
                    : 'border-zinc-200 bg-white/90 text-zinc-900 focus-within:border-zinc-950'
                }`}>
                  <div className="pl-5 text-zinc-400 flex items-center">
                    {isAiSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <CircleNotch size={18} weight="light" className="text-blue-500" />
                      </motion.div>
                    ) : (
                      <Sparkle size={18} weight="fill" className="text-blue-500" />
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (aiSearchExplanation) setAiSearchExplanation(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAiSearch();
                      }
                    }}
                    className="w-full bg-transparent py-4 pl-3 pr-28 text-xs md:text-sm focus:outline-none font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-300"
                    placeholder="Ask AI to find prompts..."
                  />
 
                  <div className="absolute right-2 flex items-center gap-1.5">
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setAiSearchExplanation(null);
                        }}
                        className={`p-1.5 rounded-full hover:bg-zinc-800/10 transition ${
                          theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'
                        }`}
                        title="Clear query"
                      >
                        <X size={14} weight="light" />
                      </button>
                    )}
 
                    <button
                      onClick={() => {
                        handleAiSearch();
                      }}
                      disabled={isAiSearching || !searchQuery.trim()}
                      className={`rounded-full px-4 py-2 text-[10px] md:text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-300 active:scale-95 border ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-800'
                          : 'bg-zinc-950 hover:bg-zinc-900 text-white border-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200'
                      }`}
                    >
                      <span>{isAiSearching ? 'SEARCHING' : 'AI SEARCH'}</span>
                      <ArrowRight size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
 
              {/* Dynamic feedback explanation label */}
              <AnimatePresence>
                {aiSearchExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`mt-4 text-xs font-mono py-3 px-4 rounded-xl flex items-start gap-2.5 text-left border ${
                      theme === 'dark'
                        ? 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                        : 'bg-blue-50/50 border-blue-100/60 text-blue-800'
                    }`}
                  >
                    <Check size={14} weight="bold" className="mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[9px] text-blue-500 block mb-0.5">Gemini Matching Feedback:</span>
                      <p className="leading-relaxed">{aiSearchExplanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>

      {/* Controls: tags and filters with motion entry */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 85, damping: 16, delay: 0.35 }}
      >
        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          allUniqueTags={allUniqueTags}
          theme={theme}
        />
      </motion.div>

      {/* Gallery masonry column-count block */}
      <section className="mx-auto max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1780px] px-3.5 md:px-6 xl:px-12 mt-4 transition-all duration-300">
        {filteredPrompts.length > 0 ? (
          <>
            {/* Widescreen 4-Column Layout (Active on xl screen sizes and wider, ensuring perfect spatial ratio and high readability) */}
            <div className="hidden xl:grid grid-cols-4 gap-5">
              {desktopColumns4.map((colItems, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-5">
                  {colItems.map((item) => {
                    const idx = filteredPrompts.findIndex((p) => p.id === item.id);
                    const animationDelay = Math.min(0.4 + (idx >= 0 ? idx : 0) * 0.04, 1.8);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                          type: 'spring',
                          stiffness: 85,
                          damping: 18,
                          delay: animationDelay,
                        }}
                      >
                        <PromptCard
                          item={item}
                          onCardClick={(clicked) => setSelectedPrompt(clicked)}
                          selectedTags={selectedTags}
                          toggleTag={toggleTag}
                          onCopySuccess={triggerCopyToast}
                          theme={theme}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Desktop 3-Column Layout (Active on medium and large screen sizes, hidden on xl and smaller devices) */}
            <div className="hidden md:grid xl:hidden grid-cols-3 gap-5">
              {desktopColumns3.map((colItems, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-5">
                  {colItems.map((item) => {
                    const idx = filteredPrompts.findIndex((p) => p.id === item.id);
                    const animationDelay = Math.min(0.4 + (idx >= 0 ? idx : 0) * 0.04, 1.8);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                          type: 'spring',
                          stiffness: 85,
                          damping: 18,
                          delay: animationDelay,
                        }}
                      >
                        <PromptCard
                          item={item}
                          onCardClick={(clicked) => setSelectedPrompt(clicked)}
                          selectedTags={selectedTags}
                          toggleTag={toggleTag}
                          onCopySuccess={triggerCopyToast}
                          theme={theme}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile & Tablet Stable Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-5">
              {filteredPrompts.slice(0, itemsToShow).map((item, idx) => {
                const animationDelay = Math.min(0.4 + idx * 0.04, 1.8);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      type: 'spring',
                      stiffness: 85,
                      damping: 18,
                      delay: animationDelay,
                    }}
                  >
                    <PromptCard
                      item={item}
                      onCardClick={(clicked) => setSelectedPrompt(clicked)}
                      selectedTags={selectedTags}
                      toggleTag={toggleTag}
                      onCopySuccess={triggerCopyToast}
                      theme={theme}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Infinite scroll indicator and intersection trigger */}
            {filteredPrompts.length > itemsToShow && (
              <div 
                ref={setIntersectRef} 
                className="w-full flex flex-col items-center justify-center py-12 select-none"
              >
                <div className={`p-4 rounded-xl border flex flex-col items-center max-w-xs text-center border-dashed transition-all duration-300 ${
                  theme === 'dark' ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-500'
                }`}>
                  {isLoadingMore ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-5 h-5 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                      <span className="font-mono text-[8px] tracking-[0.16em] uppercase animate-pulse">Syncing Prompts pipeline...</span>
                    </div>
                  ) : (
                    <span className="font-mono text-[8px] tracking-[0.16em] uppercase">Scroll to reveal more architectures</span>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={`rounded-xl border border-dashed p-12 text-center max-w-md mx-auto mt-12 ${
            theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'
          }`}>
            <Sliders size={32} weight="light" className="mx-auto text-zinc-400" />
            <h4 className={`font-sans text-sm font-semibold mt-4 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}`}>NO COMPATIBLE PROMPTS RECORDED</h4>
            <p className="font-mono text-[10px] text-zinc-400 mt-2 leading-relaxed uppercase tracking-wider">
              No entries match " {searchQuery} " within {selectedCategory} archetype. Try clearing active tags or resetting the list.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTags([]);
              }}
              className={`mt-6 rounded-md px-4 py-2 font-mono text-[10px] text-white hover:bg-blue-650 transition-colors pointer-events-auto ${
                theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-950 hover:bg-zinc-900'
              }`}
            >
              CLEAR ALL ACTIVE FILTERS
            </button>
          </div>
        )}
      </section>

      {/* Restore default backup button at very bottom page margin */}
      <div className={`mx-auto max-w-7xl px-6 md:px-8 mt-18 border-t pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-400 ${
        theme === 'dark' ? 'border-zinc-800/80' : 'border-zinc-200/60'
      }`}>
        <p className="text-left">
          PROMPT GALLERY // PERSISTED LOCAL STORAGE DEVICE STATUS: ACTIVE
        </p>
        <button
          onClick={resetLibraryDefaults}
          className={`flex items-center gap-1.5 rounded border px-3 py-1 transition-colors duration-300 ${
            theme === 'dark' ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-500 hover:text-red-400' : 'border-zinc-200 bg-white hover:border-red-400 hover:text-red-650'
          }`}
        >
          <Trash size={12} weight="light" />
          <span>FACTORY RESTORE ARCHIVE</span>
        </button>
      </div>

      {/* MODALS RENDER CONTAINER */}
      <AnimatePresence>
        {/* Admin Panel Modal */}
        {isAdminOpen && (
          <AdminPanelModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            prompts={prompts}
            onDeletePrompt={handleDeletePrompt}
            onResetLibrary={resetLibraryDefaults}
            onAddPrompt={handleAddNewPrompt}
            onUpdatePrompt={handleUpdatePrompt}
            onOpenAddModal={() => {
              setIsAdminOpen(false);
              setIsAddOpen(true);
            }}
            theme={theme}
          />
        )}

        {/* Detail/Customization info modal */}
        {selectedPrompt && (
          <PromptModal
            item={selectedPrompt}
            isOpen={!!selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
            onCopySuccess={triggerCopyToast}
            theme={theme}
          />
        )}

        {/* Add Prompt Modal */}
        {isAddOpen && (
          <AddPromptModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onAddPrompt={handleAddNewPrompt}
            theme={theme}
          />
        )}

        {/* Information Guide Modal */}
        {isInfoOpen && (
          <InfoModal
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* FIXED TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 rounded-lg px-5 py-3 shadow-xl border font-mono text-[10.5px] tracking-wide ${
              theme === 'dark' ? 'bg-zinc-900 text-zinc-100 border-zinc-850' : 'bg-zinc-950 text-white border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-650 text-white">
                <Check size={10} weight="bold" />
              </div>
              <span>{toastMessage.toUpperCase()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
