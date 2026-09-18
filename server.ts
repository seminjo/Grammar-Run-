import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

// AI 맞춤 문제 생성 API endpoint
app.post('/api/generate-questions', async (req, res) => {
  const { stageId, difficulty = 'normal', weakGrammarTypes = [], count = 10 } = req.body;

  const client = getGeminiClient();
  if (!client) {
    // Return gracefully so client falls back to local rich question bank
    return res.json({
      fallback: true,
      message: 'GEMINI_API_KEY not configured or client-side fallback requested',
      questions: [],
    });
  }

  try {
    const prompt = `Generate ${count} English grammar multiple-choice questions for Korean 5th grade elementary school students (ages 11-12, CEFR A1 level).
Target Grammar Categories: ${
      stageId && stageId !== 'random'
        ? stageId
        : weakGrammarTypes.length > 0
        ? `Emphasize these weak areas: ${weakGrammarTypes.join(', ')}`
        : 'Mix of: be_verb, third_person, question, continuous, past_tense, general_verb, modal_can, preposition, comparative'
    }
Difficulty Level: ${difficulty}
- If 'easy': short sentences (3-4 words, e.g. "He ___ soccer.")
- If 'normal': standard sentences (5-7 words, e.g. "He ___ soccer every Sunday.")
- If 'hard': longer sentences with modifiers (8-12 words, e.g. "My brother ___ soccer with his friends every Sunday.")

Requirements:
1. Each question must have a blank ('___').
2. Provide exactly 3 options.
3. The options must be distinct choices suitable for a 3-lane running game (e.g. ['play', 'plays', 'playing'] or ['Do', 'Does', 'Are']).
4. Provide the correct answer (must match one of the options).
5. Provide a short, friendly Korean explanation ('koreanExplanation') suitable for an 11-year-old Korean elementary student.
6. Provide a natural Korean translation of the full sentence ('koreanMeaning').
7. The grammarType must be one of: 'be_verb', 'third_person', 'question', 'continuous', 'past_tense', 'general_verb', 'modal_can', 'preposition', 'comparative'.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              grammarType: {
                type: Type.STRING,
                description: "One of: 'be_verb', 'third_person', 'question', 'continuous', 'past_tense', 'general_verb', 'modal_can', 'preposition', 'comparative'",
              },
              grammarTypeName: { type: Type.STRING, description: "Korean category name e.g. '3인칭 단수', 'be동사', '의문문'" },
              sentence: { type: Type.STRING, description: "Sentence with '___'" },
              fullSentence: { type: Type.STRING, description: "Completed sentence" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 3 choices',
              },
              correctAnswer: { type: Type.STRING },
              koreanExplanation: { type: Type.STRING, description: 'Child-friendly tip with emoji e.g. 💡...' },
              koreanMeaning: { type: Type.STRING, description: 'Korean translation' },
              difficulty: { type: Type.STRING, description: "'easy' | 'normal' | 'hard'" },
            },
            required: ['grammarType', 'sentence', 'fullSentence', 'options', 'correctAnswer', 'koreanExplanation', 'koreanMeaning'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({ fallback: false, questions: parsed });
    } else {
      return res.json({ fallback: true, questions: [] });
    }
  } catch (err: any) {
    console.error('Gemini question generation error:', err?.message || err);
    return res.json({ fallback: true, error: err?.message, questions: [] });
  }
});

// Vite middleware & Static file serving
async function startServer() {
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
    console.log(`Grammar Run server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
