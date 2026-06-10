/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Funnel, Tag, ArrowCounterClockwise } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { CategoryType } from '../types';

interface FilterBarProps {
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  availableCategories: CategoryType[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allUniqueTags: string[];
  theme: 'light' | 'dark';
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  selectedTags,
  toggleTag,
  allUniqueTags,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="mx-auto w-full max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1780px] px-6 py-8 md:px-8 xl:px-12 transition-all duration-300">
      {/* Upper info control bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-zinc-205/10 dark:border-zinc-800/65">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400 select-none">
          <div className="flex items-center gap-2">
            <Funnel size={14} weight="regular" className="text-blue-500" />
            <span className="uppercase tracking-widest font-bold">GRID SYNDICATE //</span>
          </div>
          <span className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-tight border ${
            isDark 
              ? 'text-blue-400 border-zinc-800/80 bg-zinc-900/60' 
              : 'text-zinc-900 border-zinc-200 bg-zinc-50'
          }`}>
            {selectedCategory.toUpperCase()}
          </span>
          {selectedTags.length > 0 && (
            <span className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold border transition-all duration-300 ${
              isDark 
                ? 'text-blue-400 bg-blue-950/30 border-blue-900/40' 
                : 'text-blue-800 bg-blue-50 border-blue-100'
            }`}>
              {selectedTags.length} SELECTED
            </span>
          )}
        </div>
      </div>

      {/* Main Categories Panel */}
      <div className="mt-6">
        <div className="overflow-x-auto pb-3 scrollbar-none">
          <div className="flex gap-2 min-w-max">
            {availableCategories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative rounded-lg px-4 py-2 font-mono text-xs transition-all duration-300 border font-bold tracking-wide active:scale-95 ${
                    isActive
                      ? 'text-white border-blue-600 shadow-sm'
                      : isDark
                        ? 'text-zinc-400 bg-zinc-90 w/20 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
                        : 'text-zinc-650 bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 shadow-xs'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="categoryIndicator"
                      className="absolute inset-0 z-[-1] rounded-lg bg-blue-600"
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    />
                  )}
                  <span className="relative z-10">{category.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Hot Tags Index with subtitle and luxurious border integration */}
      <div className={`mt-5 p-5 rounded-2xl border transition-all duration-300 divide-y divide-zinc-200/10 dark:divide-zinc-800/50 space-y-3 ${
        isDark
          ? 'border-zinc-800 bg-zinc-950/20 backdrop-blur-3xl'
          : 'border-zinc-250/60 bg-zinc-50/50'
      }`}>
        <div className="flex items-center justify-between select-none pb-2.5">
          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            <Tag size={13} weight="light" className="text-zinc-500" />
            <span>Hot index keywords</span>
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => {
                // Clear tags logic
                allUniqueTags.forEach((t) => {
                  if (selectedTags.includes(t)) toggleTag(t);
                });
              }}
              className={`flex items-center gap-1 text-[10px] font-mono border border-dashed rounded-md px-2.5 py-1 transition-all duration-300 active:scale-95 ${
                isDark
                  ? 'text-blue-400 border-blue-900/60 hover:border-blue-500 hover:bg-blue-950/20'
                  : 'text-blue-600 border-blue-300 hover:border-blue-600 hover:bg-blue-50'
              }`}
            >
              <ArrowCounterClockwise size={11} />
              <span>CLEAR TAGS</span>
            </button>
          )}
        </div>

        {/* Tags flexwrap with fixed spacious spacing */}
        <div className="pt-3 flex flex-wrap items-center gap-x-3 gap-y-3">
          {allUniqueTags.slice(0, 18).map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-lg px-3 py-1.5 font-mono text-[11px] border transition-all duration-300 active:scale-95 select-none ${
                  isSelected
                    ? isDark
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md'
                      : 'bg-zinc-900 text-white border-zinc-900 font-bold shadow-sm'
                    : isDark
                      ? 'bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 border-zinc-800/80 hover:border-zinc-650 hover:text-white'
                      : 'bg-zinc-50 hover:bg-white text-zinc-650 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 shadow-2xs'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {allUniqueTags.length === 0 && (
            <span className="text-xs text-zinc-450 font-mono italic">No indexes loaded.</span>
          )}
        </div>
      </div>
    </div>
  );
};

