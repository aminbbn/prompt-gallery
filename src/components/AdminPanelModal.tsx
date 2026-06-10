import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Shield, Trash, PencilSimple, Plus, Check, Lock, Key, SignIn, 
  Database, Tag, Image as ImageIcon, SquaresFour, Sparkle, FolderOpen, Browser,
  CaretLeft, CaretRight, Funnel, MagnifyingGlass
} from '@phosphor-icons/react';
import { PromptItem, CategoryType } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PromptItem[];
  onDeletePrompt: (id: string) => void;
  onResetLibrary: () => void;
  onAddPrompt: (newPrompt: PromptItem) => void;
  onUpdatePrompt: (updatedPrompt: PromptItem) => void;
  onOpenAddModal: () => void;
  theme: 'light' | 'dark';
}

// Strong credentials preset
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'unlock_the_vault_2026';

// Curated pool of high-fidelity prompts in the "Prompt Bank" waiting for images to be assigned
interface BankPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  suggestedTags: string[];
  suggestedKeyword: string;
}

const CURATED_BANK_PROMPTS: BankPrompt[] = [
  {
    id: 'bank_01',
    title: 'Iridescent Quartz Torus',
    prompt: 'Macro shot of a glass quartz torus levitating in the air, multi-colored light refraction, translucent prism rays, high-end octane render, soft dark background, sharp details.',
    category: 'Abstract',
    suggestedTags: ['quartz', 'prism', 'iridescent', 'refraction'],
    suggestedKeyword: 'quartz-prism'
  },
  {
    id: 'bank_02',
    title: 'Kinetic Brutalist Atrium',
    prompt: 'Brutalist concrete architecture atrium, massive hollow skylight, cascading linear waterfall down a raw monolithic pillar, volumetric lighting mist, high contrast shadows.',
    category: 'Architecture',
    suggestedTags: ['brutalist', 'concrete', 'atrium', 'monolith'],
    suggestedKeyword: 'brutalist-water'
  },
  {
    id: 'bank_03',
    title: 'Cyber terminal workspace',
    prompt: 'Tactile retro keyboard console, glowing amber command line inputs with matrix diagnostics telemetry, analog dashboard dials, dark workspace context, industrial heavy design.',
    category: 'Sci-Fi',
    suggestedTags: ['cyberpunk', 'retro', 'terminal', 'amber'],
    suggestedKeyword: 'cyber-hardware'
  },
  {
    id: 'bank_04',
    title: 'Bento Grid Mobile UI',
    prompt: 'Sleek dark mode mobile dynamic interface mock, structured grid compartments, neon charts and rich statistics displays, polished layout card, glassmorphic accents.',
    category: 'UI Design',
    suggestedTags: ['mobile', 'dashboard', 'bento', 'dark-ui'],
    suggestedKeyword: 'cyber-ui'
  },
  {
    id: 'bank_05',
    title: 'Deconstructed Silk Veil',
    prompt: 'Floating organic satin fabric ribbons dynamically curling under wind simulation, desaturated beige and sage green gradient, pure daylight illumination, neutral studio background.',
    category: 'Abstract',
    suggestedTags: ['editorial', 'fabric', 'organic', 'minimalist'],
    suggestedKeyword: 'silk-gradient'
  },
  {
    id: 'bank_06',
    title: 'Chromed Spheres in Desert',
    prompt: 'Reflective chrome metallic spheres resting on fine beige desert sand dunes, warm golden hour sky mirroring perfectly on spheres, surreal minimalist editorial landscape.',
    category: 'Minimalist',
    suggestedTags: ['desert', 'chrome', 'surreal', 'spheres'],
    suggestedKeyword: 'chrome-desert'
  },
  {
    id: 'bank_07',
    title: 'Macro Chrome Circuit',
    prompt: 'Super micro-lens macro shot on an integrated circuit board, copper-layered pathways shimmering with electric blue power currents, cinematic depth of field macro details.',
    category: 'Macro',
    suggestedTags: ['macro', 'microchip', 'circuit', 'blue-light'],
    suggestedKeyword: 'circuit-macro'
  },
  {
    id: 'bank_08',
    title: 'Faded Analog Polaroid',
    prompt: 'Grainy overexposed nostalgic polaroid photograph of a vintage coupe driving through thick coastal fog, desaturated cinematic film grain, classic retro feel.',
    category: 'Retro',
    suggestedTags: ['polaroid', 'retro-car', 'analog', 'foggy'],
    suggestedKeyword: 'vintage-polaroid'
  }
];

// Algorithmic generator to yield 250 premium prompts mimicking a 10,050 item database context
const generateExpandedBank = (): BankPrompt[] => {
  const result = [...CURATED_BANK_PROMPTS];
  
  const subjects = [
    { text: "levitating glass prism torus of infinite loops", keyword: "prism-torus", tags: ["glass", "prism", "geometry"] },
    { text: "monolithic obsidian block rising from fine white volcanic ash", keyword: "obsidian-monolith", tags: ["obsidian", "monolith", "minimalist"] },
    { text: "chromatic liquid mercury droplets suspended in a vacuum state", keyword: "mercury-droplet", tags: ["mercury", "liquid", "chrome"] },
    { text: "brutalist concrete staircase spiral leading to an open sunbeam ceiling", keyword: "brutalist-spiral", tags: ["brutalist", "concrete", "staircase"] },
    { text: "complex vintage analog motherboard with dusty glowing tubes", keyword: "vintage-circuit", tags: ["retro", "analogue", "electronics"] },
    { text: "delicate organic silk sheet floating gracefully under wind simulation", keyword: "silk-wind", tags: ["satin", "flow", "beige"] },
    { text: "macro crystal snowflake capturing multi-colored rainbow light beams", keyword: "snowflake-prism", tags: ["snowflake", "macro", "ice"] },
    { text: "sleek neon biometric interface mock on dark glassy grid modular panels", keyword: "hud-mock", tags: ["dashboard", "hud", "sci-fi"] },
    { text: "flat minimalist vector line-art tree in autumn desaturated red foliage", keyword: "vector-tree", tags: ["vector", "minimalist", "illustration"] },
    { text: "tactile custom mechanical keyboard frame with translucent emerald keycaps", keyword: "emerald-keys", tags: ["keyboard", "emerald", "hardware"] },
    { text: "sculpture of a limestone face decaying into wild climbing green vines", keyword: "sculpture-ruins", tags: ["limestone", "ruins", "vines"] },
    { text: "sublime cinematic coastal mist cloaking a vintage red sports model Coupe", keyword: "vintage-coupe", tags: ["polaroid", "mist", "cinematic"] },
    { text: "futuristic aerospace helm cockpit filled with wireframes and amber diagnostic logs", keyword: "aerospace-cockpit", tags: ["cockpit", "cyberpunk", "telemetry"] },
    { text: "macro texture study of iridescent beetle shell with metallic details", keyword: "beetle-macro", tags: ["macro", "beetle", "iridescent"] },
  ];

  const modifiers = [
    { text: "rendering via heavy octane engine path-tracer, extreme details, soft studio light, neutral sand backdrop", category: "Abstract" },
    { text: "dramatic high-contrast chiaroscuro shadows, ambient rays passing through side windows", category: "Architecture" },
    { text: "cinematic depth of field, overexposed nostalgic analog film grain, polaroid lens tone", category: "Retro" },
    { text: "sleek user experience dashboard layout, 1px thin glass borders, neon glow accents, dark mode aesthetic", category: "UI Design" },
    { text: "flat vector illustration, balanced negative space, clean bezier curves, modern editorial graphics", category: "Vector" },
    { text: "macro-lens photography, hyper-focused sub-millimeter geometry, crisp winter sunlight reflection", category: "Macro" },
    { text: "ambient sci-fi diagnostics telemetry, soft computer amber glow, declassified tactical details", category: "Sci-Fi" },
    { text: "pure minimalist composition, raw materials, neutral organic clay tones, peaceful natural sunlight", category: "Minimalist" },
    { text: "editorial fashion landscape style, desaturated pastel pigments, soft shadows, timeless visual balance", category: "Editorial" },
    { text: "lush dew drops, morning light rays, organic vibrant forest colors, misty green ecosystem focus", category: "Nature" },
  ];

  const titlePrefixes = ["Kinetic", "Structured", "Refracted", "Atmospheric", "Deconstructed", "Monolithic", "Organic", "Analog", "Tactile", "Spectral"];
  const titleNouns = ["Prism", "Atrium", "Void", "Symphony", "Module", "Vessel", "Fragment", "Lattice", "Tectonic", "Horizon"];

  let idCounter = 9;
  for (let i = 0; i < 242; i++) {
    const sub = subjects[i % subjects.length];
    const mod = modifiers[Math.floor((i * 3 + 7) % modifiers.length)];
    const prefix = titlePrefixes[Math.floor((i * 11) % titlePrefixes.length)];
    const noun = titleNouns[Math.floor((i * 17) % titleNouns.length)];
    
    const uniqueId = `bank_${idCounter < 10 ? '0' : ''}${idCounter}`;
    idCounter++;

    const combinedTitle = `${prefix} ${noun} ${idCounter}`;
    const combinedPrompt = `${sub.text.charAt(0).toUpperCase() + sub.text.slice(1)}, ${mod.text}.`;
    const combinedTags = Array.from(new Set([...sub.tags, mod.category.toLowerCase(), "simulated"]));

    result.push({
      id: uniqueId,
      title: combinedTitle,
      prompt: combinedPrompt,
      category: mod.category,
      suggestedTags: combinedTags,
      suggestedKeyword: sub.keyword
    });
  }

  return result;
};

const BANK_POOL = generateExpandedBank();

const CATEGORIES: CategoryType[] = [
  'Editorial',
  'Architecture',
  'Macro',
  'Sci-Fi',
  'Vector',
  'UI Design',
  'Abstract',
  'Nature',
  'Minimalist',
  'Retro',
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onDeletePrompt,
  onResetLibrary,
  onAddPrompt,
  onUpdatePrompt,
  theme,
}) => {
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Panel navigation state
  // Tabs: 'catalog' (Active items), 'bank' (Predefined prompts ready to map), 'manual' (Add from scratch)
  const [activeTab, setActiveTab] = useState<'catalog' | 'bank' | 'manual'>('catalog');

  // Search inside admin catalog management
  const [catalogSearch, setCatalogSearch] = useState('');

  // Editing state for a prompt in catalog
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [editCategory, setEditCategory] = useState<CategoryType>('Editorial');
  const [editTags, setEditTags] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editRatio, setEditRatio] = useState('');

  // Selected bank prompt to map with image
  const [claimingBankItem, setClaimingBankItem] = useState<BankPrompt | null>(null);
  
  // Mapping claim form fields
  const [claimImageUrl, setClaimImageUrl] = useState('');
  const [claimTags, setClaimTags] = useState('');
  const [claimAuthor, setClaimAuthor] = useState('System Curator');
  const [claimModel, setClaimModel] = useState('Flux Dev');
  const [claimRatio, setClaimRatio] = useState('16:9');
  const [claimError, setClaimError] = useState('');

  // Manual generation form states
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrompt, setManualPrompt] = useState('');
  const [manualCategory, setManualCategory] = useState<CategoryType>('Editorial');
  const [manualTags, setManualTags] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualModel, setManualModel] = useState('Flux Dev');
  const [manualRatio, setManualRatio] = useState('16:9');
  const [manualError, setManualError] = useState('');

  // Prompt Bank search, filter and pagination states
  const [bankSearch, setBankSearch] = useState('');
  const [bankCategoryFilter, setBankCategoryFilter] = useState<string>('All');
  const [bankPage, setBankPage] = useState(1);
  const [bankPageSize, setBankPageSize] = useState(6);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Perform secure-ish login check
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim() === ADMIN_USER && password.trim() === ADMIN_PASS) {
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid parameters. Authentication keys rejected.');
    }
  };

  // Switch to editing mode
  const startEditing = (p: PromptItem) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditPrompt(p.prompt);
    setEditCategory(p.category as CategoryType);
    setEditTags(p.tags.join(', '));
    setEditImageUrl(p.imageUrl);
    setEditAuthor(p.author);
    setEditModel(p.parameters.model);
    setEditRatio(p.parameters.aspectRatio);
  };

  // Save the edit session
  const saveEditing = (id: string) => {
    if (!editTitle.trim() || !editPrompt.trim()) {
      alert('Title and Prompt code are required fields.');
      return;
    }

    const updatedTags = editTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const updatedPrompt: PromptItem = {
      ...prompts.find((p) => p.id === id)!,
      title: editTitle.trim(),
      prompt: editPrompt.trim(),
      category: editCategory,
      tags: updatedTags.length > 0 ? updatedTags : ['edited', 'dynamic'],
      imageUrl: editImageUrl.trim() || 'https://picsum.photos/seed/edited/1200/950',
      parameters: {
        model: editModel || 'Flux Dev',
        aspectRatio: editRatio || '16:9',
        seed: Math.floor(Math.random() * 950000).toString(),
      },
      author: editAuthor.trim() || 'Anonymous Curator',
    };

    onUpdatePrompt(updatedPrompt);
    setEditingId(null);
  };

  // Deploy item from structural prompt bank with premium image mapping
  const handleMapDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError('');

    if (!claimingBankItem) return;

    // Validate image URL or use fallback
    let finalUrl = claimImageUrl.trim();
    if (!finalUrl) {
      // Auto-generate Picsum URL directly
      const seedVal = Math.floor(Math.random() * 999999).toString();
      finalUrl = `https://picsum.photos/seed/${claimingBankItem.suggestedKeyword}-${seedVal}/1200/950`;
    }

    const newLabelArray = claimTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const finalTags = newLabelArray.length > 0 
      ? newLabelArray 
      : [...claimingBankItem.suggestedTags, 'synced'];

    const newPromptItem: PromptItem = {
      id: `bank_derived_${Date.now()}`,
      title: claimingBankItem.title,
      prompt: claimingBankItem.prompt,
      category: claimingBankItem.category,
      tags: finalTags,
      imageUrl: finalUrl,
      parameters: {
        model: claimModel,
        aspectRatio: claimRatio,
        seed: Math.floor(Math.random() * 100000).toString(),
      },
      author: claimAuthor.trim() || 'System Curator',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddPrompt(newPromptItem);
    
    // Clear state
    setClaimingBankItem(null);
    setClaimImageUrl('');
    setClaimTags('');
    
    // Switch back to catalog to see the new entry
    setActiveTab('catalog');
  };

  // Add entirely new manual entry
  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    if (!manualTitle.trim()) {
      setManualError('Title cannot be empty.');
      return;
    }
    if (!manualPrompt.trim()) {
      setManualError('Prompt code/syntax cannot be empty.');
      return;
    }

    let finalImg = manualImageUrl.trim();
    if (!finalImg) {
      // Generate standard Picsum seed
      const seedVal = Math.floor(Math.random() * 999999).toString();
      finalImg = `https://picsum.photos/seed/manual-abstract-${seedVal}/1200/950`;
    }

    const tagsArr = manualTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newPromptItem: PromptItem = {
      id: `manual_${Date.now()}`,
      title: manualTitle.trim(),
      prompt: manualPrompt.trim(),
      category: manualCategory,
      tags: tagsArr.length > 0 ? tagsArr : ['custom', 'creative'],
      imageUrl: finalImg,
      parameters: {
        model: manualModel,
        aspectRatio: manualRatio,
        seed: Math.floor(Math.random() * 100000).toString(),
      },
      author: manualAuthor.trim() || 'Visual Director',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddPrompt(newPromptItem);

    // Reset fields
    setManualTitle('');
    setManualPrompt('');
    setManualTags('');
    setManualImageUrl('');
    setManualAuthor('');

    // Highlight catalog tab
    setActiveTab('catalog');
  };

  // Filter Catalog entries based on inside search
  const filteredCatalog = useMemo(() => {
    if (!catalogSearch.trim()) return prompts;
    const q = catalogSearch.toLowerCase();
    return prompts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.prompt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [prompts, catalogSearch]);

  // Compute filtered Bank list based on search term & category filter
  const filteredBank = useMemo(() => {
    let list = BANK_POOL;
    if (bankSearch.trim()) {
      const q = bankSearch.toLowerCase();
      list = list.filter((b) => 
        b.title.toLowerCase().includes(q) ||
        b.prompt.toLowerCase().includes(q) ||
        b.suggestedTags.some((t) => t.toLowerCase().includes(q)) ||
        b.id.toLowerCase().includes(q)
      );
    }
    if (bankCategoryFilter !== 'All') {
      list = list.filter((b) => b.category === bankCategoryFilter);
    }
    return list;
  }, [bankSearch, bankCategoryFilter]);

  // Manage exact page parameters inside boundaries
  const totalBankPages = Math.ceil(filteredBank.length / bankPageSize) || 1;
  const currentBankPage = Math.min(bankPage, totalBankPages);

  const paginatedBank = useMemo(() => {
    const startIndex = (currentBankPage - 1) * bankPageSize;
    return filteredBank.slice(startIndex, startIndex + bankPageSize);
  }, [filteredBank, currentBankPage, bankPageSize]);

  // Search/Filter helper setters resetting page index to 1
  const handleBankSearchChange = (val: string) => {
    setBankSearch(val);
    setBankPage(1);
  };

  const handleBankCategoryChange = (val: string) => {
    setBankCategoryFilter(val);
    setBankPage(1);
  };

  const handleGenerateRandomUrl = (type: 'edit' | 'claim' | 'manual', keyword: string) => {
    const seed = Math.floor(Math.random() * 1000000).toString();
    const cleanWord = keyword.trim().toLowerCase().replace(/\s+/g, '-') || 'abstract-synthetics';
    const finalVal = `https://picsum.photos/seed/${cleanWord}-${seed}/1200/950`;
    if (type === 'edit') setEditImageUrl(finalVal);
    if (type === 'claim') setClaimImageUrl(finalVal);
    if (type === 'manual') setManualImageUrl(finalVal);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100dvh' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100dvh' }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className={`fixed inset-0 z-50 w-screen h-[100dvh] flex flex-col overflow-hidden select-none ${
        isDark
          ? 'bg-zinc-950 text-zinc-100'
          : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      {/* Main Administrative Window Chrome */}
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        
        {/* TOP STATUS BAR CONTAINER */}
        <div className={`flex items-center justify-between border-b px-6 py-4 select-none ${
          isDark ? 'border-zinc-900 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50/50'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <Shield size={16} className="text-blue-500" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">
              SYS::ADMIN_CONSTRUCT_BOARD // {isLoggedIn ? 'AUTHORIZED' : 'LOCKED'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 transition-colors ${
              isDark ? 'text-zinc-500 hover:bg-zinc-900 hover:text-white' : 'text-zinc-400 hover:bg-zinc-150 hover:text-black'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* LOCKED STATE GATE */}
        {!isLoggedIn ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 md:p-12">
            <div className={`w-full max-w-md p-8 rounded-2xl border flex flex-col items-center justify-center text-center space-y-6 ${
              isDark
                ? 'border-zinc-800 bg-zinc-900/10'
                : 'border-zinc-200 bg-white shadow-lg'
            }`}>
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-zinc-900/40 border-zinc-900 text-blue-400' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
              }`}>
                <Lock size={32} className="animate-bounce" />
              </div>

            <div className="space-y-2">
              <h3 className="font-sans text-lg font-bold tracking-tight">Vault Credentials Required</h3>
              <p className="font-sans text-xs text-zinc-500 leading-relaxed">
                Unlock database panels to add prompts from the ready bank, execute manual entries, or edit active assets.
              </p>
            </div>



            <form onSubmit={handleLoginSubmit} className="w-full space-y-3 pt-2">
              {loginError && (
                <p className="font-mono text-[10px] text-red-500 bg-red-950/20 py-1.5 px-3 rounded border border-red-900/60 font-bold">
                  {loginError}
                </p>
              )}
              
              <div className="space-y-1 text-left">
                <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={`w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-900/60 focus:border-blue-500'
                      : 'border-zinc-200 bg-white focus:border-zinc-900'
                  }`}
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Security Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-900/60 focus:border-blue-500'
                      : 'border-zinc-200 bg-white focus:border-zinc-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 font-mono text-xs font-bold text-white transition-all active:scale-[0.98] shadow-md"
              >
                <SignIn size={14} weight="bold" />
                <span>MUTATE SECURE LEVEL</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
          /* AUTHORIZED SYSTEM LAYOUT */
          <>
            {/* TABS SELECTOR STRIP */}
            <div className={`flex border-b px-6 pt-2 select-none ${
              isDark ? 'border-zinc-900 bg-zinc-900/20' : 'border-zinc-150 bg-zinc-50'
            }`}>
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setActiveTab('catalog'); setClaimingBankItem(null); }}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'catalog'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Browser size={14} />
                  <span>ACTIVE CATALOG ({prompts.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('bank'); setClaimingBankItem(null); }}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs font-bold border-b-2 transition-all relative ${
                    activeTab === 'bank'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Database size={14} />
                  <span>PROMPT BANK</span>
                  <span className="rounded-full bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0.2 ml-1 font-bold border border-blue-500/15">
                    {BANK_POOL.length} READY
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('manual'); setClaimingBankItem(null); }}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'manual'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Plus size={14} weight="bold" />
                  <span>MANUAL INTAKE</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENTS SCROLLER */}
            <div className="flex-1 overflow-y-auto p-6 min-h-[50vh]">
              
              {/* TAB 1: ACTIVE CATALOG MANAGEMENT */}
              {activeTab === 'catalog' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <h3 className="font-sans text-sm font-bold tracking-tight text-zinc-200 uppercase self-start">
                      Current Live Index Files
                    </h3>
                    
                    {/* Catalog internal search input */}
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Search Active Catalog..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 font-mono text-[11px] focus:outline-none ${
                          isDark
                            ? 'border-zinc-800 bg-zinc-900 text-zinc-200 placeholder-zinc-550'
                            : 'border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                      {catalogSearch && (
                        <button 
                          onClick={() => setCatalogSearch('')}
                          className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 font-mono text-[10px]"
                        >
                          CLEAR
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Grid Items managing block */}
                  <div className={`border rounded-xl divide-y overflow-hidden ${
                    isDark ? 'border-zinc-900 divide-zinc-900 bg-zinc-900/10' : 'border-zinc-200 divide-zinc-150 bg-white'
                  }`}>
                    {filteredCatalog.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                        No active catalog items matched search query.
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-900/50 dark:divide-zinc-900">
                        {filteredCatalog.map((p) => {
                          const isCurrentlyEditing = editingId === p.id;
                          return (
                            <div key={p.id} className={`p-4 transition-all ${
                              isCurrentlyEditing
                                ? isDark ? 'bg-zinc-900' : 'bg-slate-50/70'
                                : isDark ? 'hover:bg-zinc-900/30' : 'hover:bg-zinc-50/50'
                            }`}>
                              {/* DISPLAY MODE OR EDITING MODE FOR THE CURRENT ITEM */}
                              {!isCurrentlyEditing ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                                    <img 
                                      src={p.imageUrl} 
                                      alt={p.title} 
                                      className="w-12 h-12 object-cover rounded-lg border border-black/10 dark:border-white/10 flex-shrink-0 bg-zinc-900" 
                                      onError={(e) => {
                                        e.currentTarget.src = "https://picsum.photos/seed/broken/120/120";
                                      }}
                                    />
                                    <div className="min-w-0 text-left">
                                      <div className="flex items-center gap-2">
                                        <p className="font-sans text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                          {p.title}
                                        </p>
                                        <span className={`text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.2 border rounded ${
                                          isDark ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                          {p.category}
                                        </span>
                                      </div>
                                      <p className="font-mono text-[10px] text-zinc-400 truncate max-w-lg mt-0.5" title={p.prompt}>
                                        {p.prompt}
                                      </p>
                                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {p.tags.slice(0, 4).map(t => (
                                          <span key={t} className="font-mono text-[9px] text-zinc-500">#{t}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                                    <button
                                      onClick={() => startEditing(p)}
                                      className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-center gap-1 text-[11px] font-mono font-bold active:scale-95 ${
                                        isDark
                                          ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-650 hover:text-white'
                                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 shadow-3xs'
                                      }`}
                                      title="Inline editor fields"
                                    >
                                      <PencilSimple size={13} />
                                      <span>EDIT</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Permanently wipe active asset [ ${p.title.toUpperCase()} ] from gallery?`)) {
                                          onDeletePrompt(p.id);
                                        }
                                      }}
                                      className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-center gap-1 text-[11px] font-mono font-bold active:scale-95 ${
                                        isDark
                                          ? 'border-red-950/20 bg-red-950/10 text-red-400 hover:border-red-500 hover:bg-red-950/40'
                                          : 'border-red-100 bg-red-50 text-red-650 hover:border-red-650 hover:bg-red-100/55'
                                      }`}
                                      title="Wipe database token"
                                    >
                                      <Trash size={13} />
                                      <span>DELETE</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* EDITABLE EXPANDED FORM PANEL */
                                <div className="space-y-3.5 pt-1 text-left">
                                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                    <h4 className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                      ⚡ EDIT PANEL // MODIFYING [{p.title.toUpperCase()}]
                                    </h4>
                                    <span className="font-mono text-[9px] text-zinc-500">{p.id}</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Index Title</label>
                                      <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className={`w-full rounded-lg border px-3 py-1.5 font-sans text-xs focus:outline-none ${
                                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Category</label>
                                      <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value as CategoryType)}
                                        className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                                        }`}
                                      >
                                        {CATEGORIES.map(cat => (
                                          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Generation Prompt Syntax</label>
                                    <textarea
                                      rows={3}
                                      value={editPrompt}
                                      onChange={(e) => setEditPrompt(e.target.value)}
                                      className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none resize-none leading-relaxed ${
                                        isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                                      }`}
                                    />
                                  </div>

                                  <div>
                                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 flex items-center justify-between block mb-1">
                                      <span>Image Asset Destination URL</span>
                                      <button
                                        type="button"
                                        onClick={() => handleGenerateRandomUrl('edit', editTitle)}
                                        className="text-[9px] text-blue-400 hover:underline hover:text-blue-300 font-mono uppercase"
                                      >
                                        Generate New Seed
                                      </button>
                                    </label>
                                    <input
                                      type="text"
                                      value={editImageUrl}
                                      onChange={(e) => setEditImageUrl(e.target.value)}
                                      className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                                        isDark ? 'border-zinc-800 bg-zinc-950 text-zinc-300' : 'border-zinc-200 bg-white text-zinc-800'
                                      }`}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="col-span-2">
                                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Tags (comma sep)</label>
                                      <input
                                        type="text"
                                        value={editTags}
                                        onChange={(e) => setEditTags(e.target.value)}
                                        className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Ratio</label>
                                      <input
                                        type="text"
                                        value={editRatio}
                                        onChange={(e) => setEditRatio(e.target.value)}
                                        className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Author</label>
                                      <input
                                        type="text"
                                        value={editAuthor}
                                        onChange={(e) => setEditAuthor(e.target.value)}
                                        className={`w-full rounded-lg border px-3 py-1.5 font-sans text-xs focus:outline-none ${
                                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-2 justify-end pt-2">
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold active:scale-95 transition-all ${
                                        isDark
                                          ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                                          : 'border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900'
                                      }`}
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      onClick={() => saveEditing(p.id)}
                                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold active:scale-[0.98] transition-all flex items-center gap-1"
                                    >
                                      <Check size={11} weight="bold" />
                                      <span>SAVE VALUES</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROMPT BANK LISTING */}
              {activeTab === 'bank' && (
                <div className="space-y-5">
                  <div className="text-left space-y-1">
                        <h3 className="font-sans text-sm font-bold tracking-tight text-zinc-200 uppercase">
                          The Ready Prompt Bank Index
                        </h3>
                        <p className="font-sans text-xs text-zinc-500">
                          These curated, professional structural prompts are cataloged in our archive but **have no graphics mapped to them yet**. Select any entry to attach an image template and publish it instantly to the front page gallery.
                        </p>
                      </div>

                      {/* Interactive Search and Category Filters */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Search Input */}
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                              <MagnifyingGlass size={14} />
                            </span>
                            <input
                              type="text"
                              value={bankSearch}
                              onChange={(e) => handleBankSearchChange(e.target.value)}
                              placeholder="Search prompts, keywords, tags or IDs in bank..."
                              className={`w-full rounded-lg pl-9 pr-8 py-2 font-mono text-xs focus:outline-none transition-all ${
                                isDark
                                  ? 'border-zinc-800 bg-zinc-900/60 focus:border-blue-500 text-zinc-100 placeholder-zinc-500'
                                  : 'border-zinc-200 bg-white focus:border-zinc-900 text-zinc-900 placeholder-zinc-400'
                              }`}
                            />
                            {bankSearch && (
                              <button
                                onClick={() => handleBankSearchChange('')}
                                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-200"
                              >
                                <X size={12} weight="bold" />
                              </button>
                            )}
                          </div>

                          {/* Page Size Selector */}
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="font-mono text-[10px] text-zinc-500 uppercase">Limit:</span>
                            <div className={`flex rounded-lg p-0.5 border ${
                              isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-250 bg-zinc-100'
                            }`}>
                              {[6, 12, 24].map((sz) => (
                                <button
                                  key={sz}
                                  onClick={() => { setBankPageSize(sz); setBankPage(1); }}
                                  className={`rounded px-2  py-0.5 font-mono text-[9px] font-bold uppercase transition-all ${
                                    bankPageSize === sz
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Category Badges Horizontal List */}
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-zinc-500 uppercase shrink-0 flex items-center gap-1">
                            <Funnel size={10} />
                            <span>Filter:</span>
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {['All', ...CATEGORIES].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => handleBankCategoryChange(cat)}
                                className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold transition-all ${
                                  bankCategoryFilter === cat
                                    ? 'bg-blue-550 text-white shadow-3xs'
                                    : isDark
                                      ? 'bg-zinc-900 border border-zinc-805 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
                                      : 'bg-zinc-100 border border-zinc-250 text-zinc-600 hover:bg-zinc-200'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Telemetry and Matched Counts */}
                        <div className="flex items-center justify-between border-t border-b border-dashed py-1.5 border-zinc-850 font-mono text-[9px] text-zinc-500">
                          <span className="uppercase text-blue-400/80">
                            SYSTEM ACTIVE // CONSTRUCT ENGINE DEPLOYED
                          </span>
                          <span className="uppercase">
                            MATCHED: <strong className="text-zinc-350 font-black">{filteredBank.length}</strong> / 250 INDEXED
                          </span>
                        </div>
                      </div>

                      {/* Grid listing */}
                      {filteredBank.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {paginatedBank.map((bank) => (
                            <div 
                              key={bank.id} 
                              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 relative ${
                                isDark
                                  ? 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-850 hover:bg-zinc-900/60'
                                  : 'border-zinc-200 bg-white hover:border-zinc-350 shadow-3xs'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    isDark ? 'bg-zinc-950 border-zinc-805 text-zinc-400' : 'bg-zinc-50 border-zinc-250 text-zinc-600'
                                  }`}>
                                    {bank.category}
                                  </span>
                                  <span className="font-mono text-[9px] text-zinc-400 uppercase">{bank.id}</span>
                                </div>
                                <h4 className="font-sans text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {bank.title}
                                </h4>
                                <p className={`font-mono text-[10px] leading-relaxed line-clamp-3 select-all ${
                                  isDark ? 'text-zinc-400' : 'text-zinc-650'
                                }`}>
                                  "{bank.prompt}"
                                </p>
                                
                                <div className="flex flex-wrap gap-1.5 pt-1.5">
                                  {bank.suggestedTags.map(tag => (
                                    <span key={tag} className="font-mono text-[9px] tracking-tight text-zinc-500">#{tag}</span>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setClaimingBankItem(bank);
                                  setClaimImageUrl('');
                                  setClaimTags(bank.suggestedTags.join(', '));
                                }}
                                className="w-full mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold py-2 transition-all active:scale-[0.98] shadow-sm"
                              >
                                <Sparkle size={13} weight="bold" />
                                <span>CLAIM & MAP GRAPHIC</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Empty state when no matches appear */
                        <div className={`p-8 rounded-xl border text-center space-y-4 ${
                          isDark ? 'border-zinc-900 bg-zinc-900/10' : 'border-zinc-200 bg-zinc-50'
                        }`}>
                          <div className="text-zinc-500 font-mono text-[10px] uppercase">
                            NO REGISTERED PROMPTS FOUND MATCHING SELECTION
                          </div>
                          <p className="font-sans text-xs text-zinc-500 max-w-sm mx-auto">
                            Consider adjusting your filters or typing different keywords. Clear search query to reset.
                          </p>
                          <button
                            onClick={() => { handleBankSearchChange(''); handleBankCategoryChange('All'); }}
                            className="font-mono text-xs font-bold text-blue-500 hover:underline hover:text-blue-400"
                          >
                            RESTORE FULL BANK INDEX
                          </button>
                        </div>
                      )}

                      {/* Interactive Pager Section */}
                      {totalBankPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-900/40 gap-3">
                          {/* Showing range index counter */}
                          <div className="font-mono text-[10px] text-zinc-500">
                            Showing <span className="text-zinc-300 font-bold">{Math.min(filteredBank.length, (currentBankPage - 1) * bankPageSize + 1)}</span> to{' '}
                            <span className="text-zinc-300 font-bold">{Math.min(filteredBank.length, currentBankPage * bankPageSize)}</span> of{' '}
                            <span className="text-zinc-300 font-bold">{filteredBank.length}</span> bank index frames
                          </div>

                          {/* Specific Pager Buttons */}
                          <div className="flex items-center gap-1.5 select-none">
                            {/* Prev page */}
                            <button
                              onClick={() => setBankPage(Math.max(1, currentBankPage - 1))}
                              disabled={currentBankPage === 1}
                              className={`rounded p-1 border font-mono text-xs transition-all ${
                                currentBankPage === 1
                                  ? 'opacity-40 cursor-not-allowed border-transparent text-zinc-600'
                                  : isDark
                                    ? 'border-zinc-800 text-zinc-305 hover:bg-zinc-900 hover:text-white'
                                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-black'
                              }`}
                            >
                              <CaretLeft size={12} weight="bold" />
                            </button>

                            {/* Page Range buttons */}
                            {(() => {
                              const range = [];
                              const maxVisible = 5;
                              let start = Math.max(1, currentBankPage - 2);
                              let end = Math.min(totalBankPages, start + maxVisible - 1);
                              
                              if (end - start + 1 < maxVisible) {
                                start = Math.max(1, end - maxVisible + 1);
                              }
                              
                              if (start > 1) {
                                range.push(
                                  <button
                                    key={1}
                                    onClick={() => setBankPage(1)}
                                    className={`w-7 h-7 rounded font-mono text-[10px] font-bold transition-all ${
                                      currentBankPage === 1
                                        ? 'bg-blue-600 text-white'
                                        : isDark
                                          ? 'border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                          : 'border border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                                    }`}
                                  >
                                    1
                                  </button>
                                );
                                if (start > 2) {
                                  range.push(
                                    <span key="dot-start" className="font-mono text-[10px] text-zinc-600 px-1">
                                      ..
                                    </span>
                                  );
                                }
                              }

                              for (let p = start; p <= end; p++) {
                                range.push(
                                  <button
                                    key={p}
                                    onClick={() => setBankPage(p)}
                                    className={`w-7 h-7 rounded font-mono text-[10px] font-bold transition-all ${
                                      currentBankPage === p
                                        ? 'bg-blue-600 text-white'
                                        : isDark
                                          ? 'border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                          : 'border border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                                    }`}
                                  >
                                    {p}
                                  </button>
                                );
                              }

                              if (end < totalBankPages) {
                                if (end < totalBankPages - 1) {
                                  range.push(
                                    <span key="dot-end" className="font-mono text-[10px] text-zinc-600 px-1">
                                      ..
                                    </span>
                                  );
                                }
                                range.push(
                                  <button
                                    key={totalBankPages}
                                    onClick={() => setBankPage(totalBankPages)}
                                    className={`w-7 h-7 rounded font-mono text-[10px] font-bold transition-all ${
                                      currentBankPage === totalBankPages
                                        ? 'bg-blue-600 text-white'
                                        : isDark
                                          ? 'border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                          : 'border border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                                    }`}
                                  >
                                    {totalBankPages}
                                  </button>
                                );
                              }

                              return range;
                            })()}

                                                        <button
                              onClick={() => setBankPage(Math.min(totalBankPages, currentBankPage + 1))}
                              disabled={currentBankPage === totalBankPages}
                              className={`rounded p-1 border font-mono text-xs transition-all ${
                                currentBankPage === totalBankPages
                                  ? 'opacity-40 cursor-not-allowed border-transparent text-zinc-600'
                                  : isDark
                                    ? 'border-zinc-800 text-zinc-305 hover:bg-zinc-900 hover:text-white'
                                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-black'
                              }`}
                            >
                              <CaretRight size={12} weight="bold" />
                            </button>
                          </div>
                        </div>
                      )}
                </div>
              )}

              {/* TAB 3: STANDALONE MANUAL INTAKE */}
              {activeTab === 'manual' && (
                <div className="max-w-xl mx-auto space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="font-sans text-sm font-bold tracking-tight text-zinc-200 uppercase">
                      Register Fresh Prompt Entry
                    </h3>
                    <p className="font-sans text-xs text-zinc-500">
                      Submit a completely original model prompt structure with a mapped graphic asset back to our database instantly.
                    </p>
                  </div>

                  <form onSubmit={handleManualAddSubmit} className="space-y-4">
                    {manualError && (
                      <p className="font-mono text-[10px] text-red-500 bg-red-950/20 py-1 px-2 border border-red-900 rounded font-bold">
                        {manualError.toUpperCase()}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Index Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Prism Symphony"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-sans text-xs focus:outline-none ${
                            isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Category Archetype</label>
                        <select
                          value={manualCategory}
                          onChange={(e) => setManualCategory(e.target.value as CategoryType)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                            isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                          }`}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Generation Prompt Code</label>
                      <textarea
                        rows={3}
                        placeholder="Paste your descriptive AI generation prompt here..."
                        value={manualPrompt}
                        onChange={(e) => setManualPrompt(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none resize-none leading-relaxed ${
                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 flex items-center justify-between block mb-1">
                        <span>Image Link URL (Leave blank for automated high-quality layout seed)</span>
                        <button
                          type="button"
                          onClick={() => handleGenerateRandomUrl('manual', manualTitle || 'creative-construct')}
                          className="text-[9px] text-blue-400 hover:underline font-mono uppercase"
                        >
                          Auto Seed URL
                        </button>
                      </label>
                      <input
                        type="text"
                        placeholder="https://picsum.photos/..."
                        value={manualImageUrl}
                        onChange={(e) => setManualImageUrl(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                          isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-800'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Labels (comma Sep)</label>
                        <input
                          type="text"
                          placeholder="retro, vaporwave, glass"
                          value={manualTags}
                          onChange={(e) => setManualTags(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                            isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Author Credit Attribution</label>
                        <input
                          type="text"
                          placeholder="Your Name / Studio ID"
                          value={manualAuthor}
                          onChange={(e) => setManualAuthor(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-sans text-xs focus:outline-none ${
                            isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Generator Model Engine</label>
                        <select
                          value={manualModel}
                          onChange={(e) => setManualModel(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <option value="Flux Dev">FLUX DEV</option>
                          <option value="Flux Schnell">FLUX SCHNELL</option>
                          <option value="Midjourney v6.0">MIDJOURNEY V6.0</option>
                          <option value="Stable Diffusion 3">STABLE DIFFUSION 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">Aspect Ratio</label>
                        <select
                          value={manualRatio}
                          onChange={(e) => setManualRatio(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-1.5 font-mono text-xs focus:outline-none ${
                            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <option value="1:1">1:1 (SQUARE)</option>
                          <option value="16:9">16:9 (WIDESCREEN)</option>
                          <option value="4:3">4:3 (LANDSCAPE)</option>
                          <option value="3:4">3:4 (PORTRAIT)</option>
                          <option value="4:5">4:5 (EDITORIAL)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setManualTitle('');
                          setManualPrompt('');
                          setManualTags('');
                          setManualImageUrl('');
                          setManualAuthor('');
                          setActiveTab('catalog');
                        }}
                        className={`px-4 py-2.5 rounded-lg border font-mono text-xs font-bold active:scale-95 transition-all ${
                          isDark
                            ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                            : 'border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold active:scale-[0.98] transition-all"
                      >
                        SUBMIT NEW SYSTEM ENTRY
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </>
        )}

        {/* BOTTOM TELEMETRY BAR */}
        <div className={`px-6 py-4.5 border-t font-mono text-[9px] tracking-widest text-zinc-500 text-center select-none ${
          isDark ? 'border-zinc-900 bg-zinc-950/80' : 'border-zinc-150 bg-zinc-50/80'
        }`}>
          SECURE SECTOR ACCESS // KEY CHAIN SYSTEM: AUTOSYNCED_OK // ACTIVE CREDENTIAL_STATE: {isLoggedIn ? 'DEBUT' : 'GATED'}
        </div>
      </div>

      <AnimatePresence>
        {claimingBankItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-zinc-950/85 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border p-6 md:p-8 text-left space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900/95 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'border-zinc-200 bg-white text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
              }`}
              style={{ backdropFilter: 'blur(30px) saturate(120%)' }}
            >
              {/* Header of mapping modal */}
              <div className="flex items-center justify-between border-b pb-3.5 border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkle size={18} className="text-blue-500 animate-pulse animate-duration-2000" />
                  <h4 className="font-sans text-md font-bold text-zinc-900 dark:text-zinc-100">
                    Deploy Bank Prompt with Graphic
                  </h4>
                </div>
                <button 
                  onClick={() => setClaimingBankItem(null)} 
                  className={`rounded-full p-2 transition-colors ${
                    isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed ${
                isDark ? 'bg-zinc-950/60 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
              }`}>
                <p className="font-bold text-blue-500 uppercase tracking-widest text-[10px] mb-1">PROMPT PRESET:</p>
                <p className="italic">"{claimingBankItem.prompt}"</p>
              </div>

              <form onSubmit={handleMapDeploy} className="space-y-4">
                {claimError && (
                  <p className="font-mono text-xs text-red-505 bg-red-950/15 border border-red-900/50 py-1.5 px-3 rounded">{claimError}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Mapped Title</label>
                    <input
                      type="text"
                      value={claimingBankItem.title}
                      disabled
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/55 opacity-70 px-3 py-2 font-sans text-xs text-zinc-500 dark:text-zinc-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Mapping Category</label>
                    <input
                      type="text"
                      value={claimingBankItem.category}
                      disabled
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/55 opacity-70 px-3 py-2 font-mono text-xs text-zinc-500 dark:text-zinc-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block">
                      Image URL (or keep empty for premium auto seed)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleGenerateRandomUrl('claim', claimingBankItem.suggestedKeyword)}
                      className="text-[9px] text-blue-500 hover:underline font-mono uppercase tracking-wider"
                    >
                      Auto-Generate Picsum Seed
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={claimImageUrl}
                    onChange={(e) => setClaimImageUrl(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                      isDark 
                        ? 'border-zinc-800 bg-zinc-950 text-white focus:border-blue-500' 
                        : 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-950'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Tags / Labels (comma sep)</label>
                    <input
                      type="text"
                      placeholder="e.g. vintage, atmospheric, blue"
                      value={claimTags}
                      onChange={(e) => setClaimTags(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                        isDark 
                          ? 'border-zinc-800 bg-zinc-950 text-white focus:border-blue-500' 
                          : 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-950'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Author Credit Attribution</label>
                    <input
                      type="text"
                      placeholder="System Curator"
                      value={claimAuthor}
                      onChange={(e) => setClaimAuthor(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 font-sans text-xs focus:outline-none transition-all relative z-[110] ${
                        isDark 
                          ? 'border-zinc-800 bg-zinc-950 text-white focus:border-blue-500' 
                          : 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-950'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Target Engine Model</label>
                    <select
                      value={claimModel}
                      onChange={(e) => setClaimModel(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                        isDark 
                          ? 'border-zinc-800 bg-zinc-950 text-white focus:border-blue-500' 
                          : 'border-zinc-200 bg-white focus:border-zinc-950'
                      }`}
                    >
                      <option value="Flux Dev">FLUX DEV</option>
                      <option value="Flux Schnell">FLUX SCHNELL</option>
                      <option value="Midjourney v6.0">MIDJOURNEY V6.0</option>
                      <option value="Stable Diffusion 3">STABLE DIFFUSION 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 block mb-1.5">Aspect Ratio</label>
                    <select
                      value={claimRatio}
                      onChange={(e) => setClaimRatio(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                        isDark 
                          ? 'border-zinc-800 bg-zinc-950 text-white focus:border-blue-500' 
                          : 'border-zinc-200 bg-white focus:border-zinc-950'
                      }`}
                    >
                      <option value="1:1">1:1 (SQUARE)</option>
                      <option value="16:9">16:9 (WIDESCREEN)</option>
                      <option value="4:3">4:3 (LANDSCAPE)</option>
                      <option value="4:5">4:5 (PORTRAIT)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setClaimingBankItem(null)}
                    className={`px-4.5 py-2 rounded-lg border font-mono text-xs font-bold active:scale-95 transition-all ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                        : 'border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold active:scale-[0.98] transition-all shadow-md"
                  >
                    DEPLOY AND PUBLISH
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
