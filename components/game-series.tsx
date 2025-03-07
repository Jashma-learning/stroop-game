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

type GameType = "form" | "stroop" | "hanoi" | "pattern" | "maze" | "memory" | "word" | "complete";

interface UserData {
  name: string;
  age: number;
  education: string;
}

const SESSION_KEYS = {
  CURRENT_GAME: "cognitive_current_game",
  TOTAL_SCORE: "cognitive_total_score",
  GAME_SCORES: "cognitive_game_scores",
  USER_DATA: "cognitive_user_data",
};

export default function GameSeries() {
  const [currentGame, setCurrentGame] = useState<GameType>("form");
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCurrentGame = sessionStorage.getItem(SESSION_KEYS.CURRENT_GAME);
        const savedTotalScore = sessionStorage.getItem(SESSION_KEYS.TOTAL_SCORE);
        const savedGameScores = sessionStorage.getItem(SESSION_KEYS.GAME_SCORES);
        const savedUserData = sessionStorage.getItem(SESSION_KEYS.USER_DATA);

        if (savedCurrentGame) setCurrentGame(savedCurrentGame as GameType);
        if (savedTotalScore) setTotalScore(parseInt(savedTotalScore));
        if (savedGameScores) setGameScores(JSON.parse(savedGameScores));
        if (savedUserData) setUserData(JSON.parse(savedUserData));
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
      if (userData) sessionStorage.setItem(SESSION_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }, [currentGame, totalScore, gameScores, userData]);

  const handleUserSubmit = (data: UserData) => {
    setUserData(data);
    setCurrentGame("stroop");
  };

  const handleGameComplete = (game: GameType, score: number) => {
    setGameScores((prev) => ({
      ...prev,
      [game]: score,
    }));
    setTotalScore((prev) => prev + score);

    const gameOrder: GameType[] = ["stroop", "hanoi", "pattern", "maze", "memory", "word", "complete"];
    const currentIndex = gameOrder.indexOf(game);
    if (currentIndex < gameOrder.length - 1) {
      setCurrentGame(gameOrder[currentIndex + 1]);
    }
  };

  const restartSeries = () => {
    setCurrentGame("form");
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.CURRENT_GAME);
      sessionStorage.removeItem(SESSION_KEYS.TOTAL_SCORE);
      sessionStorage.removeItem(SESSION_KEYS.GAME_SCORES);
      sessionStorage.removeItem(SESSION_KEYS.USER_DATA);
    }
  };

  return (
    <div className="w-full max-w-md">
      {currentGame === "form" && <UserForm onSubmit={handleUserSubmit} />}
      {currentGame === "stroop" && <StroopGame onComplete={(score) => handleGameComplete("stroop", score)} />}
      {currentGame === "hanoi" && <TowerOfHanoi onComplete={(score) => handleGameComplete("hanoi", score)} />}
      {currentGame === "pattern" && <PatternPuzzler onComplete={(score) => handleGameComplete("pattern", score)} />}
      {currentGame === "maze" && <MazeGame onComplete={(score) => handleGameComplete("maze", score)} />}
      {currentGame === "memory" && <MemoryGame onComplete={(score) => handleGameComplete("memory", score)} />}
      {currentGame === "word" && <WordPuzzle onComplete={(score) => handleGameComplete("word", score)} />}
      {currentGame === "complete" && (
        <Card className="w-full p-6 shadow-xl bg-white">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Challenge Complete!</h1>
            <p className="text-gray-600">You've completed all cognitive games!</p>
          </div>
          <CognitiveReport scores={gameScores} userData={userData} />
          <Button onClick={restartSeries} className="w-full py-6 text-lg bg-[#6D28D9] hover:bg-[#5B21B6] flex items-center justify-center mt-6">
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Session
          </Button>
        </Card>
      )}
    </div>
  );
}
