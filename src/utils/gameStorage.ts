import { GameResult, GrammarCategory, Question, UserStats } from '../types';
import { GRAMMAR_CATEGORIES, QUESTION_BANK } from '../data/questions';

const STATS_STORAGE_KEY = 'grammar_run_user_stats_v1';
const HISTORY_STORAGE_KEY = 'grammar_run_history_v1';

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    totalGames: 0,
    bestScore: 0,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    categoryMistakes: {},
    categoryAttempts: {},
  };
}

export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function loadGameHistory(): GameResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function recordGameResult(result: GameResult) {
  try {
    const history = loadGameHistory();
    history.unshift(result);
    // Keep last 20 games
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 20)));

    const stats = loadUserStats();
    stats.totalGames += 1;
    if (result.totalScore > stats.bestScore) {
      stats.bestScore = result.totalScore;
    }
    stats.totalQuestionsAnswered += result.totalCount;
    stats.totalCorrect += result.correctCount;

    // Update mistakes and attempts
    Object.entries(result.categoryStats).forEach(([catId, data]) => {
      stats.categoryAttempts[catId] = (stats.categoryAttempts[catId] || 0) + data.total;
      const mistakes = data.total - data.correct;
      if (mistakes > 0) {
        stats.categoryMistakes[catId] = (stats.categoryMistakes[catId] || 0) + mistakes;
      }
    });

    saveUserStats(stats);
  } catch {
    // ignore
  }
}

// Identify top weak categories from stats
export function getWeakGrammarCategories(): GrammarCategory[] {
  const stats = loadUserStats();
  const sorted = Object.entries(stats.categoryMistakes)
    .sort(([, a], [, b]) => b - a)
    .map(([cat]) => cat as GrammarCategory);

  return sorted.slice(0, 3);
}

// Shuffle array utility
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fetch or generate questions adapting to weak areas & difficulty
export async function getGameQuestions(
  stageId: string = 'random',
  requestedDifficulty: 'easy' | 'normal' | 'hard' | 'adaptive' = 'adaptive'
): Promise<{ questions: Question[]; isAiGenerated: boolean }> {
  const weakCategories = getWeakGrammarCategories();

  // Determine difficulty
  let effectiveDifficulty: 'easy' | 'normal' | 'hard' = 'normal';
  if (requestedDifficulty === 'adaptive') {
    const stats = loadUserStats();
    const accuracy =
      stats.totalQuestionsAnswered > 0
        ? stats.totalCorrect / stats.totalQuestionsAnswered
        : 0.6;
    if (accuracy >= 0.8) {
      effectiveDifficulty = 'hard';
    } else if (accuracy < 0.5 && stats.totalQuestionsAnswered >= 10) {
      effectiveDifficulty = 'easy';
    } else {
      effectiveDifficulty = 'normal';
    }
  } else {
    effectiveDifficulty = requestedDifficulty;
  }

  // Attempt server-side Gemini generation first
  try {
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stageId,
        difficulty: effectiveDifficulty,
        weakGrammarTypes: weakCategories,
        count: 10,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && Array.isArray(data.questions) && data.questions.length >= 8) {
        // Prepare questions: shuffle options for each question so lane answers are randomized
        const prepared = data.questions.slice(0, 10).map((q: any, index: number) => {
          const shuffledOptions = shuffle(q.options);
          return {
            ...q,
            id: q.id || `gen-${index + 1}`,
            options: shuffledOptions,
            difficulty: effectiveDifficulty,
          };
        });
        return { questions: prepared, isAiGenerated: true };
      }
    }
  } catch (e) {
    console.log('AI generation request failed, using local adaptive question bank', e);
  }

  // Fallback: smart selection from QUESTION_BANK
  let pool: Question[] = [];

  if (stageId !== 'random') {
    // Specific stage selected
    const stagePool = QUESTION_BANK.filter((q) => q.grammarType === stageId);
    pool = stagePool.length > 0 ? stagePool : QUESTION_BANK;
  } else {
    // Random / Adaptive Run
    // Prioritize weak categories if user has any!
    if (weakCategories.length > 0) {
      const weakPool = QUESTION_BANK.filter((q) => weakCategories.includes(q.grammarType));
      const otherPool = QUESTION_BANK.filter((q) => !weakCategories.includes(q.grammarType));

      // Take about 4-5 questions from weak categories, and rest from others
      pool = [...shuffle(weakPool).slice(0, 5), ...shuffle(otherPool).slice(0, 7)];
    } else {
      pool = QUESTION_BANK;
    }
  }

  // Shuffle pool and take 10
  let selected = shuffle(pool).slice(0, 10);

  // If pool has fewer than 10, duplicate with different random IDs
  while (selected.length < 10) {
    const extra = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
    selected.push({
      ...extra,
      id: `${extra.id}-dup-${selected.length}`,
    });
  }

  // Shuffle options in each question so the correct answer appears in different lanes (Left, Center, Right)
  const finalQuestions: Question[] = selected.map((q) => {
    return {
      ...q,
      options: shuffle(q.options),
    };
  });

  return { questions: finalQuestions, isAiGenerated: false };
}
