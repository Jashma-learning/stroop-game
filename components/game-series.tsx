"use client";

import { useState, useEffect } from "react";
import UserForm from "@/components/user-form";
import StroopGame from "@/components/stroop-game";
import TowerOfHanoi from "@/components/tower-of-hanoi";
import PatternPuzzler from "@/components/pattern-puzzler";
import MazeGame from "@/components/maze-game";
import MemoryGame from "@/components/memory-game";
import WordPuzzle from "@/components/word-puzzle";
import CognitiveReport from "@/components/cognitive-report";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type GameType = "stroop" | "hanoi" | "pattern" | "maze" | "memory" | "word" | "complete";

interface UserData {
  name: string;
  age: number;
  education: string;
}

// Cognitive metrics tracking
interface CognitiveMetrics {
  stroop?: any;
  hanoi?: any;
  pattern?: any;
  maze?: any;
  memory?: any;
  word?: any;
}

// Session storage keys
const SESSION_KEYS = {
  CURRENT_GAME: "cognitive_current_game",
  TOTAL_SCORE: "cognitive_total_score",
  GAME_SCORES: "cognitive_game_scores",
  USER_DATA: "cognitive_user_data",
  COGNITIVE_METRICS: "cognitive_metrics_data"
}

export default function GameSeries() {
  const [currentGame, setCurrentGame] = useState<GameType>("stroop");
  const [totalScore, setTotalScore] = useState(0);
  const [gameScores, setGameScores] = useState({
    stroop: 0,
    hanoi: 0,
    pattern: 0,
    maze: 0,
    memory: 0,
    word: 0,
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cognitiveMetrics, setCognitiveMetrics] = useState<CognitiveMetrics>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCurrentGame = sessionStorage.getItem(SESSION_KEYS.CURRENT_GAME);
        const savedTotalScore = sessionStorage.getItem(SESSION_KEYS.TOTAL_SCORE);
        const savedGameScores = sessionStorage.getItem(SESSION_KEYS.GAME_SCORES);
        const savedUserData = sessionStorage.getItem(SESSION_KEYS.USER_DATA);
        const savedMetrics = sessionStorage.getItem(SESSION_KEYS.COGNITIVE_METRICS);

        if (savedCurrentGame) setCurrentGame(savedCurrentGame as GameType);
        if (savedTotalScore) setTotalScore(parseInt(savedTotalScore));
        if (savedGameScores) setGameScores(JSON.parse(savedGameScores));
        if (savedUserData) setUserData(JSON.parse(savedUserData));
        if (savedMetrics) setCognitiveMetrics(JSON.parse(savedMetrics));
      } catch (error) {
        console.error("Error loading from session storage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEYS.CURRENT_GAME, currentGame);
      sessionStorage.setItem(SESSION_KEYS.TOTAL_SCORE, totalScore.toString());
      sessionStorage.setItem(SESSION_KEYS.GAME_SCORES, JSON.stringify(gameScores));
      sessionStorage.setItem(SESSION_KEYS.COGNITIVE_METRICS, JSON.stringify(cognitiveMetrics));
      if (userData) sessionStorage.setItem(SESSION_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }, [currentGame, totalScore, gameScores, userData, cognitiveMetrics]);

  const handleUserSubmit = (data: UserData) => {
    setUserData(data);
    setCurrentGame("stroop");
  };

  const handleGameComplete = (game: GameType, score: number, metrics?: any) => {
    setGameScores((prev) => ({
      ...prev,
      [game]: score,
    }));
    setTotalScore((prev) => prev + score);
    
    // Store cognitive metrics if provided
    if (metrics) {
      setCognitiveMetrics(prev => ({
        ...prev,
        [game]: metrics
      }));
    }

    const gameOrder: GameType[] = ["stroop", "hanoi", "pattern", "maze", "memory", "word", "complete"];
    const currentIndex = gameOrder.indexOf(game);
    if (currentIndex < gameOrder.length - 1) {
      setCurrentGame(gameOrder[currentIndex + 1]);
    }
  };

  const restartSeries = () => {
    setCurrentGame("stroop");
    setTotalScore(0);
    setGameScores({
      stroop: 0,
      hanoi: 0,
      pattern: 0,
      maze: 0,
      memory: 0,
      word: 0,
    });
    setUserData(null);
    setCognitiveMetrics({});
    
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.CURRENT_GAME);
      sessionStorage.removeItem(SESSION_KEYS.TOTAL_SCORE);
      sessionStorage.removeItem(SESSION_KEYS.GAME_SCORES);
      sessionStorage.removeItem(SESSION_KEYS.USER_DATA);
      sessionStorage.removeItem(SESSION_KEYS.COGNITIVE_METRICS);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {currentGame === "stroop" && <StroopGame onComplete={(score, metrics) => handleGameComplete("stroop", score, metrics)} />}
      {currentGame === "hanoi" && <TowerOfHanoi onComplete={(score, metrics) => handleGameComplete("hanoi", score, metrics)} />}
      {currentGame === "pattern" && <PatternPuzzler onComplete={(score) => handleGameComplete("pattern", score)} />}
      {currentGame === "maze" && <MazeGame onComplete={(score, metrics) => handleGameComplete("maze", score, metrics)} />}
      {currentGame === "memory" && <MemoryGame onComplete={(score, metrics) => handleGameComplete("memory", score, metrics)} />}
      {currentGame === "word" && <WordPuzzle onComplete={(score, metrics) => handleGameComplete("word", score, metrics)} />}
      {currentGame === "complete" && (
        <Card className="w-full p-6 shadow-xl bg-white border-t-4 border-[#1E3A8A]">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Challenge Complete!</h1>
            <p className="text-gray-600">You've completed all cognitive games!</p>
          </div>

          <div className="bg-[#F3F4F6] p-6 rounded-lg mb-6">
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold text-[#1E3A8A]">Total Score</p>
              <p className="text-4xl font-bold text-[#6D28D9]">{totalScore}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium text-[#1E3A8A]">Stroop Challenge</p>
                <p className="text-xl font-bold text-[#14B8A6]">{gameScores.stroop}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-[#1E3A8A]">Tower of Hanoi</p>
                <p className="text-xl font-bold text-[#14B8A6]">{gameScores.hanoi}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-[#1E3A8A]">Pattern Puzzler</p>
                <p className="text-xl font-bold text-[#14B8A6]">{gameScores.pattern}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-[#1E3A8A]">Maze Navigator</p>
                <p className="text-xl font-bold text-[#14B8A6]">{gameScores.maze}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-[#1E3A8A]">Memory Match</p>
                <p className="text-xl font-bold text-[#14B8A6]">{gameScores.memory}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-[#1E3A8A]">Word Puzzle</p>
                <p className="text-xl font-bold text-[#14B8A6]">{gameScores.word}</p>
              </div>
            </div>
          </div>

          <CognitiveReport scores={gameScores} userData={userData} metrics={cognitiveMetrics} />

          <Button
            onClick={restartSeries}
            className="w-full py-6 text-lg bg-[#6D28D9] hover:bg-[#6D28D9]/90 flex items-center justify-center mt-6"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Session
          </Button>
        </Card>
      )}
    </div>
  );
}
