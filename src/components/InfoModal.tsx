/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Terminal, Code, Cpu } from '@phosphor-icons/react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Absolute dark backdrop with blur */}
      <div 
        className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className={`relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border transition-all duration-350 ${
        isDark
          ? 'border-zinc-800 bg-zinc-900 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'border-zinc-200 bg-white shadow-2xl'
      }`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${
          isDark ? 'border-zinc-800' : 'border-zinc-100'
        }`}>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-500" />
            <h2 className={`font-sans text-md font-bold uppercase tracking-tight ${
              isDark ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              Prompt Syntax Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`rounded-md p-1 transition-colors ${
              isDark ? 'text-zinc-500 hover:bg-zinc-800 hover:text-white' : 'text-zinc-400 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <p className="font-sans text-xs text-zinc-400 leading-relaxed">
            The syntax of modern AI generation models relies heavily on descriptive modifiers structured with parameters. This gallery implements and demonstrates the structure of Midjourney and Flux dev prompts.
          </p>

          <div className="space-y-4">
            <div className={`rounded-lg border p-4 ${
              isDark ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400' : 'border-zinc-100 bg-zinc-50 text-zinc-650'
            }`}>
              <h3 className={`font-mono text-xs font-semibold flex items-center gap-2 ${
                isDark ? 'text-zinc-200' : 'text-zinc-900'
              }`}>
                <Terminal size={14} className="text-blue-500" />
                KEY PARAMETERS BRIEF
              </h3>
              
              <ul className="mt-2.5 space-y-3 font-mono text-[10.5px] text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className={`font-semibold min-w-[70px] flex items-center ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>--ar [x:y]</span>
                  <span>Defines the aspect ratio structure of your image output (e.g. 16:9 widescreen, 4:5 editorial, 1:1 square).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`font-semibold min-w-[70px] flex items-center ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>--stylize [v]</span>
                  <span>Specifies how strongly the model applies its default artistic styling logic, typically ranging from 0 to 1000.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`font-semibold min-w-[70px] flex items-center ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>--chaos [v]</span>
                  <span>Injects generation noise variance to make initial grid options look vastly different from each other.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`font-semibold min-w-[70px] flex items-center ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>--seed [n]</span>
                  <span>A numerical coordinate pinning down the noise profile, allowing exact reproductions when run again with matching inputs.</span>
                </li>
              </ul>
            </div>

            <div className={`rounded-lg border p-4 ${
              isDark ? 'border-zinc-800 bg-zinc-950/20 text-zinc-400' : 'border-zinc-150 text-zinc-500'
            }`}>
              <h3 className={`font-mono text-xs font-semibold flex items-center gap-2 ${
                isDark ? 'text-zinc-200' : 'text-zinc-900'
              }`}>
                <Code size={14} className="text-blue-500" />
                GRAMMATICAL STRUCTURE OF A PERFECT HIGHLAND PROMPT
              </h3>
              <p className="mt-2 font-sans text-xs leading-relaxed text-zinc-400">
                Start with the core subject, layer in specific lighting and mediums (e.g., Shot on 35mm), apply camera and depth specifications, then pin parameter flags at the very end.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-white text-[10.5px]">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 text-zinc-500">
                <Cpu size={12} />
                <span>INDEX_SYNTAX_EXAMPLE://</span>
              </div>
              <p className="text-blue-400 font-semibold mb-1">"A close-up high fashion portrait of..."</p>
              <p className="text-zinc-400">...shot on medium format Hasselblad camera, volumetric natural illumination, muted tones, fine grain texture --ar 16:9 --stylize 300 --seed 204193</p>
            </div>
          </div>

          <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <button
              onClick={onClose}
              className="rounded-md bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs py-2 px-6 font-semibold transition-all duration-300 active:scale-95"
            >
              CLOSE GUIDE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
