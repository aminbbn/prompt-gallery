/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, ArrowsOut } from '@phosphor-icons/react';
import { PromptItem } from '../types';

interface PromptCardProps {
  item: PromptItem;
  onCardClick: (item: PromptItem) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  onCopySuccess: (text: string) => void;
  theme: 'light' | 'dark';
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  onCardClick,
  selectedTags,
  toggleTag,
  onCopySuccess,
  theme,
}) => {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isDark = theme === 'dark';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    onCopySuccess(item.title);
    setTimeout(() => setCopied(false), 2000);
  };

  // Maps MIDJOURNEY / FLUX aspect ratios to Tailwind aspect classes to render perfect spatial containers instantly before images load
  const getAspectRatioClass = (ar: string) => {
    switch (ar) {
      case '4:5': return 'aspect-[4/5]';
      case '16:9': return 'aspect-[16/9]';
      case '1:1': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      default: return 'aspect-[4/5]';
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-[border-color,box-shadow,background-color] duration-300 ease-out break-inside-avoid select-none active:scale-[0.99] cursor-pointer ${
        isDark
          ? 'border-zinc-800 bg-zinc-900 shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.55)] hover:border-zinc-700'
          : 'border-zinc-200 bg-white shadow-sm hover:shadow-xl hover:border-zinc-300'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCardClick(item)}
    >
      {/* IMAGE LAYER CONTAINER */}
      <div className={`relative w-full overflow-hidden ${getAspectRatioClass(item.parameters.aspectRatio)} bg-zinc-500/5`}>
        
        {/* PREMIUM LOADING SKELETON PLACEHOLDER */}
        {!imageLoaded && (
          <div className={`absolute inset-0 flex flex-col justify-end p-4 animate-pulse z-2 ${
            isDark ? 'bg-zinc-900/90' : 'bg-zinc-100/90'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`h-2.5 w-24 rounded-full ${isDark ? 'bg-zinc-800/80' : 'bg-zinc-200/80'}`} />
              <div className={`h-6 w-6 rounded-md ${isDark ? 'bg-zinc-800/80' : 'bg-zinc-200/80'}`} />
            </div>
            <div className={`h-11 w-full rounded-lg mt-3 ${isDark ? 'bg-zinc-800/60' : 'bg-zinc-200/60'}`} />
            <div className={`h-4 w-1/2 rounded-md mt-2 ${isDark ? 'bg-zinc-800/40' : 'bg-zinc-200/40'}`} />
          </div>
        )}

        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform transition-all duration-[6000ms] ease-out group-hover:scale-108 ${
            imageLoaded ? 'opacity-100' : 'opacity-0 scale-95'
          }`}
          loading="lazy"
        />
        
        {/* PROGRESSIVE BLUR LAYER - Cloned blurred image with linear gradient mask */}
        {imageLoaded && (
          <div className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <img
              src={item.imageUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover blur-[16px] scale-[1.04] transform transition-transform duration-[6000ms] ease-out group-hover:scale-110"
              style={{
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 55%)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0) 55%)'
              }}
            />
            {/* Ambient tint gradient inside the progressive mask to guarantee perfect text contrast */}
            <div 
              className="absolute inset-0"
              style={{
                background: isDark
                  ? 'linear-gradient(to top, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.7) 20%, rgba(9,9,11,0.1) 45%, rgba(9,9,11,0) 55%)'
                  : 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0) 55%)'
              }}
            />
          </div>
        )}

        {/* Default subtle bottom dark gradient when not hovered (only in dark mode for extra contrast, fades out on hover) */}
        {isDark && imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 group-hover:opacity-0 transition-opacity duration-350 pointer-events-none" />
        )}
      </div>

      {/* TEXT DETAILS OVERLAY - Mounted directly on top of the progressive blur overlay */}
      {imageLoaded && (
        <div className="absolute inset-0 z-1 pointer-events-none md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all duration-500 flex flex-col justify-end p-4 md:translate-y-3 md:group-hover:translate-y-0">
          
          <div 
            className="pointer-events-auto w-full flex flex-col space-y-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CORE INTERFACE - COMPACT TOP BAR CONTAINING THE COPY TRIGGER */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className={`font-mono text-[8px] font-bold tracking-[0.16em] uppercase opacity-55 ${
                  isDark ? 'text-zinc-350' : 'text-zinc-600'
                }`}>
                  PROMPT SYNTAX
                </span>
              </div>
              
              {/* Quick Copy Action (Icon Only) */}
              <button
                onClick={handleCopy}
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-md transition-all duration-300 active:scale-95 border flex-none ${
                  copied
                    ? 'bg-blue-600 border-transparent text-white shadow-sm'
                    : isDark
                      ? 'bg-zinc-950/70 border-white/5 hover:bg-blue-600 hover:text-white hover:border-transparent text-zinc-350 shadow-md'
                      : 'bg-white/85 border-black/5 hover:bg-blue-600 hover:text-white hover:border-transparent text-zinc-750 shadow-sm'
                }`}
                title="Quick copy prompt code"
              >
                {copied ? (
                  <Check size={14} weight="bold" />
                ) : (
                  <Copy size={14} weight="regular" />
                )}
              </button>
            </div>

            {/* MONOSPACE CODE PREVIEW BLOCK */}
            <div 
              onClick={handleCopy}
              className={`group/box relative cursor-pointer rounded-lg border p-2.5 transition-all duration-300 ${
                isDark
                  ? 'bg-zinc-950/40 border-zinc-900/50 hover:border-zinc-800'
                  : 'bg-zinc-50/50 border-zinc-200/40 hover:border-zinc-300 hover:bg-zinc-100/50'
              }`}
            >
              <p className={`font-mono text-[9px] leading-relaxed line-clamp-2 break-all opacity-90 select-text ${
                isDark ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                {item.prompt}
              </p>
            </div>

            {/* DYNAMIC TAG CLUSTER */}
            <div className="flex flex-wrap gap-1 leading-none select-none">
              {item.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded px-1.5 py-0.5 font-mono text-[7.5px] uppercase tracking-wider transition-all duration-200 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-transparent'
                        : isDark
                          ? 'bg-zinc-950/50 border-white/5 text-zinc-400 hover:bg-zinc-950 hover:text-zinc-250 hover:border-zinc-805'
                          : 'bg-zinc-100 border-transparent text-zinc-550 hover:bg-zinc-200/60 hover:text-zinc-800'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
