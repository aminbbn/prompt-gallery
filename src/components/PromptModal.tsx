/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, ArrowsOut, Sliders, Globe, Bookmark, Palette } from '@phosphor-icons/react';
import { motion } from 'motion/react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Dark overlay backdrop with blur */}
      <div 
        className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal structure */}
      <div className={`relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border transition-all duration-350 md:h-auto md:max-h-[85vh] md:flex-row ${
        isDark
          ? 'border-zinc-800 bg-zinc-900 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'border-zinc-200 bg-white shadow-2xl'
      }`}>
        
        {/* Left Column: Image wrapper */}
        <div className={`relative flex-1 flex items-center justify-center overflow-auto md:max-h-[85vh] p-4 ${
          isDark ? 'bg-zinc-950' : 'bg-zinc-950'
        }`}>
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="h-full max-h-[40vh] w-auto object-contain md:max-h-[75vh]"
          />
          <div className="absolute top-4 left-4 rounded bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-300 backdrop-blur-sm border border-white/10">
            {item.category.toUpperCase()}
          </div>
        </div>

        {/* Right Column: Parameters and controls */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
          
          {/* Header row with titles */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`font-sans text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.title}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-zinc-400">
                <span className="uppercase tracking-wider">CREATOR: {item.author.toUpperCase()}</span>
                <span>•</span>
                <span>INDEXED ON {item.createdAt}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className={`rounded-md p-1.5 transition-colors ${
                isDark ? 'text-zinc-500 hover:bg-zinc-800 hover:text-white' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <X size={20} weight="light" />
            </button>
          </div>

          <div className={`mt-6 border-t pt-6 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Globe size={14} weight="light" className="text-blue-500" />
              Generator Prompt Input
            </h3>
            
            {/* Displaying and copying live prompt text */}
            <div className={`group/modal-prompt relative mt-3 rounded-lg border p-4 transition-all duration-300 ${
              isDark
                ? 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
            }`}>
              <p className={`font-mono text-[11px] leading-relaxed break-anywhere pr-8 ${
                isDark ? 'text-zinc-200' : 'text-zinc-800'
              }`}>
                {activePrompt}
              </p>
              <button
                onClick={() => handleCopy(activePrompt)}
                className={`absolute top-3 right-3 rounded-md border p-1.5 transition-all duration-300 active:scale-95 ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-black hover:text-black'
                }`}
                title="Copy prompt"
              >
                {copied ? <Check size={14} className="text-blue-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Interactive Parameters modifier tool config */}
          <div className={`mt-6 border-t pt-6 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sliders size={14} weight="light" className="text-blue-500" />
              Adjust Render Properties
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">Aspect Ratio (--ar)</label>
                <select
                  value={customParams.aspectRatio}
                  onChange={(e) => setCustomParams({ ...customParams, aspectRatio: e.target.value })}
                  className={`mt-1.5 w-full rounded-md border px-3 py-1.5 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 focus:border-zinc-950'
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
                <label className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">Stylize Value (--s)</label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  value={customParams.stylize}
                  onChange={(e) => setCustomParams({ ...customParams, stylize: e.target.value })}
                  className={`mt-1.5 w-full rounded-md border px-3 py-1.5 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 placeholder-zinc-300 focus:border-zinc-950'
                  }`}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">Chaos Value (--chaos)</label>
                <input
                  type="number"
                  placeholder="e.g. 10 (0 to 100)"
                  value={customParams.chaos}
                  onChange={(e) => setCustomParams({ ...customParams, chaos: e.target.value })}
                  className={`mt-1.5 w-full rounded-md border px-3 py-1.5 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 placeholder-zinc-300 focus:border-zinc-950'
                  }`}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">Seed Input (--seed)</label>
                <input
                  type="text"
                  placeholder="e.g. 43901"
                  value={customParams.seed}
                  onChange={(e) => setCustomParams({ ...customParams, seed: e.target.value })}
                  className={`mt-1.5 w-full rounded-md border px-3 py-1.5 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 placeholder-zinc-300 focus:border-zinc-950'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Technical Specs Breakdown List */}
          <div className={`mt-6 border-t pt-6 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Palette size={14} weight="light" className="text-blue-500" />
              Dataset Specifications
            </h3>
            
            <div className={`mt-3 grid grid-cols-2 gap-y-2 rounded-lg border p-4 font-mono text-[11px] ${
              isDark
                ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                : 'border-zinc-100 bg-zinc-50 text-zinc-650'
            }`}>
              <div className={`flex justify-between border-b pb-1.5 pr-4 ${isDark ? 'border-zinc-850' : 'border-zinc-200/50'}`}>
                <span className="text-zinc-500 uppercase">TARGET MODEL://</span>
                <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{item.parameters.model}</span>
              </div>
              <div className={`flex justify-between border-b pb-1.5 pl-4 ${isDark ? 'border-zinc-850' : 'border-zinc-200/50'}`}>
                <span className="text-zinc-500 uppercase">DEFAULT ASPECT://</span>
                <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{item.parameters.aspectRatio}</span>
              </div>
              <div className="flex justify-between pr-4 pt-1.5">
                <span className="text-zinc-500 uppercase">ORIGINAL SEED://</span>
                <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{item.parameters.seed || 'N/A'}</span>
              </div>
              <div className="flex justify-between pl-4 pt-1.5">
                <span className="text-zinc-500 uppercase">TAG COUNT://</span>
                <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{item.tags.length} labels</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => handleCopy(activePrompt)}
              className="flex-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs py-3 font-semibold transition-all duration-300 ease-out active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
            >
              <Copy size={16} weight="bold" />
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY CUSTOMIZED PROMPT'}
            </button>
            <button
              onClick={onClose}
              className={`rounded-md border py-3 px-5 font-mono text-xs transition-all duration-300 active:scale-95 ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  : 'border-zinc-200 bg-white text-zinc-505 hover:border-black hover:text-black'
              }`}
            >
              CLOSE SPEC
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
