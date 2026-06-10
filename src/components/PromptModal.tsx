/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Copy, Check, ArrowsOut, Sliders, Globe, Bookmark, Palette } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { PromptItem } from '../types';

interface PromptModalProps {
  item: PromptItem;
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: (text: string) => void;
  theme: 'light' | 'dark';
}

export const PromptModal: React.FC<PromptModalProps> = ({
  item,
  isOpen,
  onClose,
  onCopySuccess,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [customParams, setCustomParams] = useState({
    aspectRatio: item.parameters.aspectRatio,
    stylize: item.parameters.stylize || '',
    chaos: item.parameters.chaos || '',
    seed: item.parameters.seed || '',
  });

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState({ show: false, x: 0, y: 0, pX: 0, pY: 0, width: 0, height: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const pY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setZoom({ show: true, x, y, pX, pY, width: rect.width, height: rect.height });
  };

  const handleMouseLeave = () => {
    setZoom((prev) => ({ ...prev, show: false }));
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Build adjusted custom prompt based on live form params
  const buildCustomPrompt = () => {
    let result = item.prompt;
    let suffix = '';
    
    if (customParams.aspectRatio && customParams.aspectRatio !== item.parameters.aspectRatio) {
      result = result.replace(/--ar \d+:\d+/, `--ar ${customParams.aspectRatio}`);
    }
    
    if (customParams.stylize) {
      if (result.includes('--stylize')) {
        result = result.replace(/--stylize \d+/, `--stylize ${customParams.stylize}`);
      } else if (result.includes('--s')) {
        result = result.replace(/--s \d+/, `--s ${customParams.stylize}`);
      } else {
        suffix += ` --stylize ${customParams.stylize}`;
      }
    }
    
    if (customParams.chaos) {
      if (result.includes('--chaos')) {
        result = result.replace(/--chaos \d+/, `--chaos ${customParams.chaos}`);
      } else {
        suffix += ` --chaos ${customParams.chaos}`;
      }
    }

    if (customParams.seed) {
      if (result.includes('--seed')) {
        result = result.replace(/--seed \d+/, `--seed ${customParams.seed}`);
      } else {
        suffix += ` --seed ${customParams.seed}`;
      }
    }

    return result + suffix;
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onCopySuccess(item.title);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePrompt = buildCustomPrompt();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none"
    >
      {/* Dark overlay backdrop with blur and beautiful blurred image representation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-lg"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.4, scale: 1.25 }}
        exit={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
        onClick={onClose}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-3xl"
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        />
      </motion.div>
 
      {/* Modal structure */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.9 }}
        className={`relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl md:h-auto md:max-h-[85vh] md:flex-row ${
          isDark
            ? 'border border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
            : 'border border-zinc-200 bg-white/95 shadow-2xl text-zinc-900'
        }`}
        style={{
          backdropFilter: 'blur(30px) saturate(120%)',
        }}
      >
        {/* Ambient Blurred Background of the Image embedded in the Modal Entire Box */}
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center pointer-events-none select-none opacity-15 dark:opacity-25 filter blur-3xl saturate-150 scale-110"
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        />
        
        {/* Left Column: Image wrapper - occupies 100% space with zero gaps */}
        <div className="relative w-full h-[40dvh] md:h-auto md:w-[48%] flex-shrink-0 overflow-hidden bg-zinc-950/50">
          {/* Constrained container tracking coordinates */}
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative cursor-none h-full w-full overflow-hidden flex items-center justify-center"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
 
            {/* Smooth Zoom Box Circular Lens (No harsh white boundary, high fidelity shadow) */}
            <AnimatePresence>
              {zoom.show && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="pointer-events-none absolute z-30 h-48 w-48 overflow-hidden rounded-full border border-white/5 bg-zinc-950/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-4 ring-black/40"
                  style={{
                    left: zoom.x,
                    top: zoom.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="h-full w-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: `${zoom.width * 2.2}px ${zoom.height * 2.2}px`,
                      backgroundPosition: `${zoom.pX}% ${zoom.pY}%`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
          <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-zinc-300 backdrop-blur-sm border border-white/10 select-none">
            {item.category.toUpperCase()}
          </div>
        </div>
 
        {/* Right Column: Parameters and controls */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8 justify-between">
          <div>
            {/* Header row with titles */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className={`font-sans text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-zinc-400">
                  <span className="uppercase tracking-wider">CREATOR: {item.author.toUpperCase()}</span>
                  <span>•</span>
                  <span>INDEXED ON {item.createdAt}</span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className={`rounded-full p-2 transition-colors ${
                  isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <X size={18} weight="light" />
              </button>
            </div>
  
            {/* Prompt input with extremely premium, neat card layout */}
            <div className={`mt-6 border-t pt-5 ${isDark ? 'border-zinc-800/60' : 'border-zinc-100'}`}>
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Globe size={14} weight="light" className="text-blue-500" />
                GENERATOR PROMPT INPUT
              </h3>
              
              <div className={`group/modal-prompt relative mt-2.5 rounded-xl border p-4 transition-all duration-300 ${
                isDark
                  ? 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700/80'
                  : 'border-zinc-200/80 bg-zinc-50/60 hover:border-zinc-300'
              }`}
              style={{ backdropFilter: 'blur(10px)' }}
              >
                <p className={`font-mono text-xs leading-relaxed break-anywhere pr-10 ${
                  isDark ? 'text-zinc-200' : 'text-zinc-800'
                }`}>
                  {activePrompt}
                </p>
                <button
                  onClick={() => handleCopy(activePrompt)}
                  className={`absolute top-3.5 right-3.5 rounded-lg border p-2 transition-all duration-300 active:scale-95 ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-950 hover:text-zinc-950'
                  }`}
                  title="Copy prompt"
                >
                  {copied ? <Check size={14} className="text-blue-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
  
            {/* Interactive Parameters modifier tool config */}
            <div className={`mt-6 border-t pt-5 ${isDark ? 'border-zinc-800/60' : 'border-zinc-100'}`}>
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Sliders size={14} weight="light" className="text-blue-500" />
                ADJUST PROMPT PARAMETERS
              </h3>
   
              <div className="mt-3.5 grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] uppercase text-zinc-500 tracking-wider">Aspect Ratio (--ar)</label>
                  <select
                    value={customParams.aspectRatio}
                    onChange={(e) => setCustomParams({ ...customParams, aspectRatio: e.target.value })}
                    className={`mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-950/50 text-zinc-200 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20'
                        : 'border-zinc-200 bg-white/50 text-zinc-800 focus:border-zinc-950'
                    }`}
                  >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Horizontal)</option>
                    <option value="4:3">4:3 (Landscape)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                    <option value="4:5">4:5 (Editorial vertical)</option>
                    <option value="9:16">9:16 (Tall portrait)</option>
                  </select>
                </div>
   
                <div>
                  <label className="font-mono text-[9px] uppercase text-zinc-500 tracking-wider">Seed Input (--seed)</label>
                  <input
                    type="text"
                    placeholder="e.g. 43901"
                    value={customParams.seed}
                    onChange={(e) => setCustomParams({ ...customParams, seed: e.target.value })}
                    className={`mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-950/50 text-zinc-200 placeholder-zinc-700 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20'
                        : 'border-zinc-200 bg-white/50 text-zinc-800 placeholder-zinc-300 focus:border-zinc-950'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
 
          {/* Action Footer Buttons */}
          <div className={`mt-8 md:mt-10 pt-5 border-t flex gap-3 ${isDark ? 'border-zinc-800/60' : 'border-zinc-100'}`}>
            <button
              onClick={() => handleCopy(activePrompt)}
              className="flex-grow rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-[11px] py-3.5 font-bold transition-all duration-300 ease-out active:scale-[0.98] shadow-md flex items-center justify-center gap-2 tracking-wider"
            >
              <Copy size={14} weight="bold" />
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY CUSTOMIZED PROMPT'}
            </button>
            <button
              onClick={onClose}
              className={`rounded-lg border py-3.5 px-6 font-mono text-[11px] font-bold tracking-wider transition-all duration-300 active:scale-[0.98] ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950/30 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-950 hover:text-zinc-950'
              }`}
            >
              CLOSE SPEC
            </button>
          </div>
 
        </div>
      </motion.div>
    </motion.div>
  );
};
