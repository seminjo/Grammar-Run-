export type GrammarCategory =
  | 'be_verb'
  | 'general_verb'
  | 'third_person'
  | 'question'
  | 'continuous'
  | 'past_tense'
  | 'modal_can'
  | 'preposition'
  | 'comparative';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GrammarCategoryInfo {
  id: GrammarCategory;
  name: string;
  englishName: string;
  description: string;
  sampleQuestion: string;
  sampleOptions: string[];
  iconName: string;
  color: string;
  badgeBg: string;
}

export interface Question {
  id: string;
  grammarType: GrammarCategory;
  grammarTypeName: string;
  sentence: string; // e.g. "Tom ___ basketball after school."
  fullSentence: string; // e.g. "Tom plays basketball after school."
  options: string[]; // 2 or 3 options
  correctAnswer: string;
  koreanExplanation: string;
  koreanMeaning: string;
  difficulty: Difficulty;
}

export interface IncorrectRecord {
  question: Question;
  userAnswer: string;
}

export interface GameResult {
  id: string;
  timestamp: number;
  totalScore: number;
  correctCount: number;
  totalCount: number;
  maxCombo: number;
  stageName: string;
  categoryStats: Record<
    string,
    {
      total: number;
      correct: number;
      typeName: string;
    }
  >;
  incorrectQuestions: IncorrectRecord[];
  recommendedCategory: GrammarCategory | null;
  recommendedCategoryName: string | null;
  recommendedReason: string;
}

export interface UserStats {
  totalGames: number;
  bestScore: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  categoryMistakes: Record<string, number>;
  categoryAttempts: Record<string, number>;
}
