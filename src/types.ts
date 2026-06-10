/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  parameters: {
    aspectRatio: string;
    model: string;
    stylize?: string;
    chaos?: string;
    quality?: string;
    seed?: string;
  };
  author: string;
  createdAt: string;
}

export type CategoryType = 'All' | 'Editorial' | 'Architecture' | 'Macro' | 'Sci-Fi' | 'Vector' | 'UI Design' | 'Abstract' | 'Nature' | 'Minimalist' | 'Retro';
