/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Image, Sun, Moon, Gear } from '@phosphor-icons/react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onAdminClick,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="w-full z-40 select-none bg-transparent">
      <div className="mx-auto flex max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1780px] items-center justify-between px-6 py-6 md:px-8 xl:px-12 transition-all duration-300">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
            isDark ? 'border-zinc-800 bg-zinc-900/40 text-blue-400' : 'border-zinc-200 bg-white text-zinc-900'
          }`}>
            <Image size={20} weight="light" />
          </div>
          <div className="flex flex-col">
            <h1 className={`font-sans text-xl font-bold tracking-tight uppercase ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Prompt <span className="text-blue-500">Gallery</span>
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
              Curated Syntax Archetype Library
            </p>
          </div>
        </div>

        {/* Simplified Actions: Theme Switch & Admin Panel */}
        <div className="flex items-center gap-3">
          {/* Admin Panel button */}
          <button
            onClick={onAdminClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-xs font-bold transition-all duration-300 active:scale-95 ${
              isDark
                ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700'
                : 'border-zinc-200 bg-white text-zinc-650 hover:border-zinc-900 hover:text-zinc-900'
            }`}
            title="Open Admin Control Center"
          >
            <Gear size={15} weight="light" className="animate-spin-slow" />
            <span>ADMIN CONTROL</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 active:scale-95 ${
              isDark
                ? 'border-zinc-800 bg-zinc-900/60 text-yellow-400 hover:border-zinc-700 hover:text-yellow-300'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={18} weight="light" /> : <Moon size={18} weight="light" />}
          </button>
        </div>
      </div>
    </header>
  );
};


