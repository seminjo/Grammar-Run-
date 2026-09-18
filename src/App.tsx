import React, { useState, useEffect } from 'react';
import { StartView } from './components/StartView';
import { StageSelectView } from './components/StageSelectView';
import { GameView } from './components/GameView';
import { ResultView } from './components/ResultView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Difficulty, GameResult, GrammarCategory, Question, UserStats } from './types';
import {
  getGameQuestions,
  getWeakGrammarCategories,
  loadUserStats,
  recordGameResult,
} from './utils/gameStorage';
import { sound } from './utils/sound';
import { GRAMMAR_CATEGORIES } from './data/questions';
import { Loader2 } from 'lucide-react';

type AppView = 'start' | 'stage_select' | 'game' | 'result';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stageName, setStageName] = useState<string>('랜덤 문법 달리기');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(loadUserStats);
  const [weakCategories, setWeakCategories] = useState<GrammarCategory[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Sync user stats & weak categories on startup
  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const stats = loadUserStats();
    setUserStats(stats);
    setWeakCategories(getWeakGrammarCategories());
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Start a new game session
  const handleStartGame = async (
    stageId: string = 'random',
    difficulty: Difficulty | 'adaptive' = 'adaptive'
  ) => {
    setIsLoading(true);

    let displayName = '랜덤 문법 달리기';
    if (stageId !== 'random') {
      const cat = GRAMMAR_CATEGORIES.find((c) => c.id === stageId);
      if (cat) displayName = `${cat.name} 스테이지`;
    }
    setStageName(displayName);

    try {
      const { questions: generated, isAiGenerated: aiFlag } = await getGameQuestions(
        stageId,
        difficulty
      );
      setQuestions(generated);
      setIsAiGenerated(aiFlag);
      setCurrentView('game');
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // When 10 questions are completed (or hearts reach 0)
  const handleFinishGame = (result: GameResult) => {
    recordGameResult(result);
    refreshStats();
    setCurrentResult(result);
    setCurrentView('result');
  };

  // Replay only the missed questions from the latest game
  const handleReviewMissed = () => {
    if (!currentResult || currentResult.incorrectQuestions.length === 0) return;
    const missedQuestions = currentResult.incorrectQuestions.map((i) => i.question);
    setQuestions(missedQuestions);
    setStageName(`오답 다시 풀기 (${missedQuestions.length}문제)`);
    setCurrentView('game');
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-2 sm:p-4 selection:bg-amber-300 selection:text-slate-900 font-sans">
      {/* Mobile-first centered app container (max 480px width ideal for smartphone/tablet portrait) */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative min-h-[620px] flex flex-col justify-center">
        {/* Loading Spinner during question fetching */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <div className="text-base font-black text-slate-900">
              달리기 코스를 준비하는 중... 🏃
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AI가 맞춤 문법 문제를 구성하고 있어요!
            </p>
          </div>
        )}

        {/* View 1: Start Screen */}
        {currentView === 'start' && (
          <StartView
            onStartGame={(stageId) => handleStartGame(stageId, 'adaptive')}
            onOpenStageSelect={() => setCurrentView('stage_select')}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            weakCategories={weakCategories}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            highScore={userStats.bestScore}
          />
        )}

        {/* View 2: Stage Selection Screen */}
        {currentView === 'stage_select' && (
          <StageSelectView
            onBack={() => setCurrentView('start')}
            onSelectStage={(stageId, diff) => handleStartGame(stageId, diff)}
            userStats={userStats}
          />
        )}

        {/* View 3: Active Running Game Screen */}
        {currentView === 'game' && questions.length > 0 && (
          <GameView
            questions={questions}
            stageName={stageName}
            isAiGenerated={isAiGenerated}
            onFinishGame={handleFinishGame}
            onExitGame={() => setCurrentView('start')}
          />
        )}

        {/* View 4: Result & AI Review Screen */}
        {currentView === 'result' && currentResult && (
          <ResultView
            result={currentResult}
            onPlayAgain={() => handleStartGame('random', 'adaptive')}
            onSelectOtherStage={() => setCurrentView('stage_select')}
            onGoHome={() => setCurrentView('start')}
            onReviewMissed={handleReviewMissed}
            onRunRecommendedCategory={(catId) => handleStartGame(catId, 'adaptive')}
          />
        )}

        {/* How to play popup modal */}
        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}
      </div>
    </main>
  );
}
