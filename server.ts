import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined. Please verify your secrets configuration.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// AI Search Endpoint
app.post('/api/ai-search', async (req, res) => {
  try {
    const { query, availableCategories, allUniqueTags } = req.body;
    
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ error: 'Search query must be a valid non-empty string.' });
    }

    const ai = getGeminiClient();

    const allowedCategories = availableCategories || [
      'Editorial', 'Architecture', 'Macro', 'Sci-Fi', 'Vector', 'UI Design', 'Abstract', 'Nature', 'Minimalist', 'Retro'
    ];
    const allowedTags = allUniqueTags || [];

    const promptText = `
      User Query: "${query}"
      Available Categories: ${JSON.stringify(allowedCategories)}
      Available High-Fidelity Tags: ${JSON.stringify(allowedTags)}

      Please map the user query to the most relevant categories and tags from the list. 
      Also provide a refined search term for filtering and an elegant explanation of the search intent.
    `;

    const systemInstruction = `
      You are an elite AI semantic matcher for a creative prompts repository called "Prompt Gallery".
      Your job is to read a natural language query and identify which of the allowed categories and tags match the user's intent.
      
      Rules:
      1. relatedCategories must ONLY contain strings that are EXACT matches to items in the provided Available Categories list. Do not make up categories. If none match, return an empty array.
      2. relatedTags must ONLY contain strings that are EXACT matches to items in the provided Available High-Fidelity Tags list. If none match, return an empty array.
      3. refinedSearchTerm must be a concise, single-word or two-word keyword summarizing the user's search intent (e.g. "metallic", "brutalist", "dreamy").
      4. aiExplanation must be a highly polished, professional, and descriptive 1-sentence summary detailing how you matched their request (e.g., "Identified retro industrial patterns and warm historic grain matching your lunar tech query."). DO NOT start with generic phrases. Keep it elite and bespoke. No emojis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedSearchTerm: {
              type: Type.STRING,
              description: 'A single concise keyword representing the user intent.',
            },
            relatedCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Matched categories that present in the available list.',
            },
            relatedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Matched tags that present in the available list.',
            },
            aiExplanation: {
              type: Type.STRING,
              description: 'An elegant professional explanation of the semantic search matching result.',
            },
          },
          required: ['refinedSearchTerm', 'relatedCategories', 'relatedTags', 'aiExplanation'],
        },
      },
    });

    const resultText = response.text?.trim() || '{}';
    const jsonResult = JSON.parse(resultText);

    res.json(jsonResult);
  } catch (error: any) {
    console.error('AI search endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to complete semantic AI matching.',
      details: error.message || 'Unknown server error.'
    });
  }
});

// App Entry & Vite Middleware Mounting for dev mode
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Prompt Gallery Server] running on http://localhost:${PORT}`);
  });
}

bootstrap();
