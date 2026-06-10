/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Info, Image, ClipboardText, Tag, User } from '@phosphor-icons/react';
import { CategoryType, PromptItem } from '../types';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPrompt: (newPrompt: PromptItem) => void;
  theme: 'light' | 'dark';
}

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

export const AddPromptModal: React.FC<AddPromptModalProps> = ({
  isOpen,
  onClose,
  onAddPrompt,
  theme,
}) => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<CategoryType>('Editorial');
  const [rawTags, setRawTags] = useState('');
  const [author, setAuthor] = useState('');
  const [model, setModel] = useState('Flux Dev');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageKeyword, setImageKeyword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field validations
    if (!title.trim()) {
      setError('Index title is required.');
      return;
    }
    if (!prompt.trim()) {
      setError('Prompt prompt syntax is required.');
      return;
    }
    if (!author.trim()) {
      setError('Author metadata is required.');
      return;
    }

    const tagsArray = rawTags
       .split(',')
       .map((tag) => tag.trim().toLowerCase())
       .filter((tag) => tag.length > 0);

    // Create a pristine high-fidelity prompt entry
    const seedValue = Math.floor(Math.random() * 1000000).toString();
    const cleanKeyword = imageKeyword.trim().toLowerCase().replace(/\s+/g, '-') || 'creative-geometry';
    
    // Picsum seed-based high-quality asset mapping
    const finalImageUrl = `https://picsum.photos/seed/${cleanKeyword}-${seedValue}/1200/950`;

    const newPromptItem: PromptItem = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      prompt: prompt.trim(),
      category,
      tags: tagsArray.length > 0 ? tagsArray : ['dynamic', cleanKeyword],
      imageUrl: finalImageUrl,
      parameters: {
        aspectRatio,
        model,
        seed: seedValue,
      },
      author: author.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddPrompt(newPromptItem);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setPrompt('');
    setCategory('Editorial');
    setRawTags('');
    setAuthor('');
    setModel('Flux Dev');
    setAspectRatio('16:9');
    setImageKeyword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Absolute dark backdrop with blur */}
      <div 
        className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Core Container */}
      <div className={`relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border transition-all duration-350 ${
        isDark
          ? 'border-zinc-800 bg-zinc-900 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'border-zinc-200 bg-white shadow-2xl'
      }`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${
          isDark ? 'border-zinc-800' : 'border-zinc-100'
        }`}>
          <div className="flex items-center gap-2">
            <ClipboardText size={18} className="text-blue-500" />
            <h2 className={`font-sans text-sm font-bold uppercase tracking-tight ${
              isDark ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              Publish New Prompt
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

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className={`mb-4 border p-3 rounded-md text-xs font-mono flex items-center gap-2 ${
              isDark ? 'border-red-900 bg-red-950/20 text-red-400' : 'border-red-200 bg-red-50 text-red-650'
            }`}>
              <Info size={14} weight="bold" />
              <span>{error.toUpperCase()}</span>
            </div>
          )}

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Title */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                Index Title
              </label>
              <input
                type="text"
                placeholder="e.g. Velvet Reflections"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-1.5 w-full rounded-md border px-3 py-2 font-sans text-sm focus:outline-none transition-colors ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                    : 'border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-zinc-950'
                }`}
              />
            </div>

            {/* Prompt text area */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                Prompt Code / Parameters Syntax
              </label>
              <textarea
                rows={3}
                placeholder="Paste your descriptive AI Generation prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`mt-1.5 w-full rounded-md border px-3 py-2 font-mono text-xs focus:outline-none transition-colors resize-none leading-relaxed ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                    : 'border-zinc-200 bg-white text-zinc-800 placeholder-zinc-450 focus:border-zinc-950'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category selector */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  Archetype Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className={`mt-1.5 w-full rounded-md border px-3 py-2 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-250 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 focus:border-zinc-950'
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author name */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <User size={10} />
                  Author Attribution
                </label>
                <input
                  type="text"
                  placeholder="Your Name / Studio ID"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={`mt-1.5 w-full rounded-md border px-3 py-2 font-sans text-sm focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-zinc-950'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Model */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  Target Model Engine
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`mt-1.5 w-full rounded-md border px-3 py-2 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-250 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 focus:border-zinc-950'
                  }`}
                >
                  <option value="Flux Dev">FLUX DEV</option>
                  <option value="Flux Schnell">FLUX SCHNELL</option>
                  <option value="Midjourney v6.0">MIDJOURNEY V6.0</option>
                  <option value="Midjourney v5.2">MIDJOURNEY V5.2</option>
                  <option value="DALL-E 3">DALL-E 3</option>
                  <option value="Stable Diffusion 3">STABLE DIFFUSION 3</option>
                </select>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  Default Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className={`mt-1.5 w-full rounded-md border px-3 py-2 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-250 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 focus:border-zinc-950'
                  }`}
                >
                  <option value="1:1">1:1 (SQUARE)</option>
                  <option value="16:9">16:9 (WIDESCREEN)</option>
                  <option value="4:3">4:3 (LANDSCAPE)</option>
                  <option value="3:4">3:4 (PORTRAIT)</option>
                  <option value="4:5">4:5 (EDITORIAL)</option>
                  <option value="9:16">9:16 (VERTICAL)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Image seed keyword generator preview */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Image size={10} />
                  Visual Seed Theme
                </label>
                <input
                  type="text"
                  placeholder="e.g. geometric, water, neon"
                  value={imageKeyword}
                  onChange={(e) => setImageKeyword(e.target.value)}
                  className={`mt-1.5 w-full rounded-md border px-3 py-2 font-sans text-sm focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-zinc-950'
                  }`}
                />
              </div>

              {/* Tags comma separator list */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Tag size={10} />
                  Labels / Tags (comma sep)
                </label>
                <input
                  type="text"
                  placeholder="e.g. retro, surreal, neon"
                  value={rawTags}
                  onChange={(e) => setRawTags(e.target.value)}
                  className={`mt-1.5 w-full rounded-md border px-3 py-2 font-mono text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-200 placeholder-zinc-700 focus:border-blue-500'
                      : 'border-zinc-200 bg-white text-zinc-800 placeholder-zinc-300 focus:border-zinc-950'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={`mt-8 border-t pt-6 flex gap-3 ${
            isDark ? 'border-zinc-800' : 'border-zinc-100'
          }`}>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className={`flex-1 rounded-md border py-2.5 font-mono text-xs transition-colors duration-300 active:scale-95 ${
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-black hover:text-black'
              }`}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs py-2.5 font-semibold transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus size={14} weight="bold" />
              ADD TO GALLERY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
