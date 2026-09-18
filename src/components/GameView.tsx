import React, { useState, useEffect, useRef } from 'react';
import { GameHUD } from './GameHUD';
import { RunnerTrack } from './RunnerTrack';
import { LaneButtons } from './LaneButtons';
import { FeedbackBanner } from './FeedbackBanner';
import { GameResult, GrammarCategory, Question } from '../types';
import { sound } from '../utils/sound';
import { GRAMMAR_CATEGORIES } from '../data/questions';

interface GameViewProps {
  questions: Question[];
  stageName: string;
  isAiGenerated: boolean;
  onFinishGame: (result: GameResult) => void;
  onExitGame: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  questions,
  stageName,
  isAiGenerated,
  onFinishGame,
  onExitGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [laneIndex, setLaneIndex] = useState<number>(1); // 0: Left, 1: Center, 2: Right
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  // Per-question feedback state
  const [progress, setProgress] = useState<number>(0); // 0 to 100% distance
  const [timeLeft, setTimeLeft] = useState<number>(5); // 5 seconds countdown
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  // Detailed records for result screen
  const [categoryStats, setCategoryStats] = useState<
    Record<string, { total: number; correct: number; typeName: string }>
  >({});
  const [incorrectList, setIncorrectList] = useState<
    Array<{ question: Question; userAnswer: string }>
  >([]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const progressTimerRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(5.0);
  const lastTickedSecondRef = useRef<number>(5);

  // Initialize or reset question runner state
  useEffect(() => {
    setProgress(0);
    setTimeLeft(5);
    remainingTimeRef.current = 5.0;
    lastTickedSecondRef.current = 5;
    setLaneIndex(1); // default to center lane
    setIsLocked(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setShowFeedbackModal(false);
  }, [currentIndex]);

  // 5-second runner countdown timer
  useEffect(() => {
    if (isLocked || showFeedbackModal) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const intervalMs = 50;
    const stepSeconds = intervalMs / 1000;

    progressTimerRef.current = window.setInterval(() => {
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - stepSeconds);
      const currentRemaining = remainingTimeRef.current;
      const currentCeilSec = Math.max(0, Math.ceil(currentRemaining));

      setTimeLeft(currentCeilSec);

      // Warning tick sound when 3, 2, 1 seconds left
      if (currentCeilSec <= 3 && currentCeilSec > 0 && currentCeilSec !== lastTickedSecondRef.current) {
        lastTickedSecondRef.current = currentCeilSec;
        sound.playTick();
      }

      // Footstep sound at intervals
      const elapsed = 5.0 - currentRemaining;
      if (Math.floor(elapsed * 10) % 5 === 0) {
        sound.playStep();
      }

      // Progress 0% to 100%
      const newProgress = Math.min(100, Math.round(((5.0 - currentRemaining) / 5.0) * 100));
      setProgress(newProgress);

      if (currentRemaining <= 0) {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        handleTriggerChoice(laneIndex);
      }
    }, intervalMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isLocked, showFeedbackModal, laneIndex, currentIndex]);

  // Handle lane selection
  const handleSelectLane = (newIndex: number) => {
    if (isLocked) return;
    setLaneIndex(newIndex);
    sound.playLaneChange();
  };

  // Trigger answer confirmation
  const handleTriggerChoice = (chosenLane: number = laneIndex) => {
    if (isLocked) return;
    setIsLocked(true);
    setProgress(100);

    const chosenWord = currentQuestion.options[chosenLane] || currentQuestion.options[0];
    const correct = chosenWord.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    setSelectedAnswer(chosenWord);
    setIsCorrect(correct);

    // Update category tracking
    setCategoryStats((prev) => {
      const cat = currentQuestion.grammarType;
      const current = prev[cat] || {
        total: 0,
        correct: 0,
        typeName: currentQuestion.grammarTypeName,
      };
      return {
        ...prev,
        [cat]: {
          total: current.total + 1,
          correct: correct ? current.correct + 1 : current.correct,
          typeName: currentQuestion.grammarTypeName,
        },
      };
    });

    if (correct) {
      const newCombo = combo + 1;
      const bonusMultiplier = Math.min(newCombo, 5);
      const earned = 10 * bonusMultiplier;

      setCombo(newCombo);
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
      }
      setScore((s) => s + earned);
      setPointsEarned(earned);

      sound.playCorrect(newCombo);
    } else {
      setCombo(0);
      setPointsEarned(0);
      setHearts((h) => Math.max(0, h - 1));
      setIncorrectList((list) => [...list, { question: currentQuestion, userAnswer: chosenWord }]);

      sound.playWrong();
    }

    // Brief pause to show runner on gate before opening feedback modal
    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 450);
  };

  // Move to next question or complete game
  const handleNextQuestion = () => {
    setShowFeedbackModal(false);

    const isLastQuestion = currentIndex + 1 >= questions.length;
    const isOutOfHearts = hearts <= (isCorrect === false ? 1 : 0);

    if (isLastQuestion || isOutOfHearts) {
      finishGame();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const finishGame = () => {
    // Determine recommended review category based on lowest accuracy
    let worstCategory: GrammarCategory | null = null;
    let worstAccuracy = 1.0;
    let worstCatName = '';

    Object.entries(categoryStats).forEach(([catId, data]) => {
      const mistakes = data.total - data.correct;
      const accuracy = data.total > 0 ? data.correct / data.total : 1;
      if (mistakes > 0 && accuracy < worstAccuracy) {
        worstAccuracy = accuracy;
        worstCategory = catId as GrammarCategory;
        worstCatName = data.typeName;
      }
    });

    if (!worstCategory && incorrectList.length > 0) {
      worstCategory = incorrectList[0].question.grammarType;
      worstCatName = incorrectList[0].question.grammarTypeName;
    }

    const totalAnswered = currentIndex + 1;
    const totalCorrect = Object.values(categoryStats).reduce((acc, curr) => acc + curr.correct, 0);

    const recommendedReason = worstCategory
      ? `“${worstCatName} 문제에서 실수가 가장 많았어요.”`
      : '“모든 문법 문제를 훌륭하게 완주했어요! 멋져요!”';

    const result: GameResult = {
      id: `res-${Date.now()}`,
      timestamp: Date.now(),
      totalScore: score,
      correctCount: totalCorrect,
      totalCount: totalAnswered,
      maxCombo: Math.max(maxCombo, combo),
      stageName,
      categoryStats,
      incorrectQuestions: incorrectList,
      recommendedCategory: worstCategory,
      recommendedCategoryName: worstCatName || null,
      recommendedReason,
    };

    onFinishGame(result);
  };

  return (
    <div id="game-view-screen" className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[580px] p-2 sm:p-4">
      {/* Top HUD */}
      <GameHUD
        currentIndex={currentIndex}
        totalCount={questions.length}
        score={score}
        hearts={hearts}
        combo={combo}
        currentQuestion={currentQuestion}
        selectedOption={currentQuestion.options[laneIndex] || null}
      />

      {/* 3D Runner Track */}
      <div className="my-2.5">
        <RunnerTrack
          laneIndex={laneIndex}
          onSelectLane={handleSelectLane}
          options={currentQuestion.options}
          isLocked={isLocked}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
          progress={progress}
          timeLeft={timeLeft}
        />
      </div>

      {/* Tactile Lane Buttons */}
      <LaneButtons
        laneIndex={laneIndex}
        onSelectLane={handleSelectLane}
        onConfirmChoice={() => handleTriggerChoice(laneIndex)}
        isLocked={isLocked}
        options={currentQuestion.options}
      />

      {/* Instant Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackBanner
          isCorrect={isCorrect ?? false}
          question={currentQuestion}
          selectedAnswer={selectedAnswer || ''}
          pointsEarned={pointsEarned}
          combo={combo}
          hearts={hearts}
          onNext={handleNextQuestion}
        />
      )}
    </div>
  );
};
