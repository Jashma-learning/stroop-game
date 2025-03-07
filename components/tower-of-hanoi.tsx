"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Timer, ArrowRight, RotateCcw } from "lucide-react"

interface TowerOfHanoiProps {
  onComplete: (score: number) => void
}

// Disk sizes and colors
const DISK_COLORS = ["#1E3A8A", "#6D28D9", "#14B8A6"]

// Session storage keys for Tower of Hanoi
const HANOI_STORAGE_KEYS = {
  GAME_STATE: "hanoi_game_state",
  TOWERS: "hanoi_towers",
  SELECTED_TOWER: "hanoi_selected_tower",
  MOVES: "hanoi_moves",
  TIME_LEFT: "hanoi_time_left",
  BEST_MOVES: "hanoi_best_moves",
  SCORE: "hanoi_score"
}

export default function TowerOfHanoi({ onComplete }: TowerOfHanoiProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameOver">(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem(HANOI_STORAGE_KEYS.GAME_STATE);
      return (savedState as "ready" | "playing" | "gameOver") || "ready";
    }
    return "ready";
  });
  
  const [towers, setTowers] = useState<number[][]>(() => {
    if (typeof window !== 'undefined') {
      const savedTowers = sessionStorage.getItem(HANOI_STORAGE_KEYS.TOWERS);
      return savedTowers ? JSON.parse(savedTowers) : [[3, 2, 1], [], []];
    }
    return [[3, 2, 1], [], []];
  });
  
  const [selectedTower, setSelectedTower] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const savedSelected = sessionStorage.getItem(HANOI_STORAGE_KEYS.SELECTED_TOWER);
      return savedSelected ? parseInt(savedSelected) : null;
    }
    return null;
  });
  
  const [moves, setMoves] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMoves = sessionStorage.getItem(HANOI_STORAGE_KEYS.MOVES);
      return savedMoves ? parseInt(savedMoves) : 0;
    }
    return 0;
  });
  
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTime = sessionStorage.getItem(HANOI_STORAGE_KEYS.TIME_LEFT);
      return savedTime ? parseInt(savedTime) : 60;
    }
    return 60;
  });
  
  const [bestMoves, setBestMoves] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBestMoves = sessionStorage.getItem(HANOI_STORAGE_KEYS.BEST_MOVES);
      return savedBestMoves ? parseInt(savedBestMoves) : 0;
    }
    return 0;
  });
  
  const [score, setScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedScore = sessionStorage.getItem(HANOI_STORAGE_KEYS.SCORE);
      return savedScore ? parseInt(savedScore) : 0;
    }
    return 0;
  });
  
  const optimalMoves = 7 // 2^n - 1 where n is the number of disks (3)

  // Save game state to session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(HANOI_STORAGE_KEYS.GAME_STATE, gameState);
      sessionStorage.setItem(HANOI_STORAGE_KEYS.TOWERS, JSON.stringify(towers));
      sessionStorage.setItem(HANOI_STORAGE_KEYS.SELECTED_TOWER, selectedTower?.toString() || "");
      sessionStorage.setItem(HANOI_STORAGE_KEYS.MOVES, moves.toString());
      sessionStorage.setItem(HANOI_STORAGE_KEYS.TIME_LEFT, timeLeft.toString());
      sessionStorage.setItem(HANOI_STORAGE_KEYS.BEST_MOVES, bestMoves.toString());
      sessionStorage.setItem(HANOI_STORAGE_KEYS.SCORE, score.toString());
    }
  }, [gameState, towers, selectedTower, moves, timeLeft, bestMoves, score]);

  // Clear session storage
  const clearSessionStorage = () => {
    if (typeof window !== 'undefined') {
      Object.values(HANOI_STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
      });
    }
  };

  // Start the game
  const startGame = () => {
    setGameState("playing")
    setTowers([[3, 2, 1], [], []])
    setSelectedTower(null)
    setMoves(0)
    setTimeLeft(60)
    clearSessionStorage(); // Clear previous session data
  }

  // Handle tower click
  const handleTowerClick = (towerIndex: number) => {
    if (selectedTower === null) {
      // If no tower is selected and the clicked tower has disks, select it
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex)
      }
    } else {
      // If a tower is already selected
      if (selectedTower === towerIndex) {
        // Clicking the same tower deselects it
        setSelectedTower(null)
      } else {
        // Try to move disk from selected tower to clicked tower
        const sourceDisks = [...towers[selectedTower]]
        const targetDisks = [...towers[towerIndex]]

        if (targetDisks.length === 0 || sourceDisks[sourceDisks.length - 1] < targetDisks[targetDisks.length - 1]) {
          // Valid move: either target tower is empty or top disk of source is smaller than top disk of target
          const diskToMove = sourceDisks.pop()!
          targetDisks.push(diskToMove)

          const newTowers = [...towers]
          newTowers[selectedTower] = sourceDisks
          newTowers[towerIndex] = targetDisks

          setTowers(newTowers)
          setMoves(moves + 1)
          setSelectedTower(null)

          // Check if the game is won (all disks moved to tower 3)
          if (newTowers[2].length === 3) {
            // Calculate score based on moves and time left
            const moveScore = Math.max(100 - (moves - optimalMoves) * 10, 10)
            const timeBonus = Math.floor(timeLeft * 2)
            const totalScore = moveScore + timeBonus

            setScore(totalScore)
            setGameState("gameOver")

            // Update best moves if this is better
            if (bestMoves === 0 || moves < bestMoves) {
              setBestMoves(moves)
            }
          }
        } else {
          // Invalid move, just deselect
          setSelectedTower(null)
        }
      }
    }
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setGameState("gameOver")

            // Calculate a partial score based on progress
            const progressScore = Math.floor(towers[2].length * 30 + towers[1].length * 10)
            setScore(progressScore)

            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameState, towers])

  // Move to next game
  const handleNextGame = () => {
    clearSessionStorage();
    onComplete(score)
  }

  return (
    <Card className="w-full p-6 shadow-xl bg-white">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Tower of Hanoi</h1>
        <p className="text-gray-600">Game 2 of 3: Move all disks to the rightmost tower</p>
      </div>

      {gameState === "ready" && (
        <div className="text-center space-y-6">
          <div className="bg-[#F3F4F6] p-4 rounded-lg">
            <p className="mb-4">Move all disks from the leftmost tower to the rightmost tower.</p>
            <p className="mb-4">
              Rules:
              <br />• Move only one disk at a time
              <br />• A larger disk cannot be placed on a smaller disk
            </p>
            <p>You have 60 seconds. Try to solve it in as few moves as possible!</p>
          </div>
          <Button onClick={startGame} className="w-full py-6 text-lg bg-[#6D28D9] hover:bg-[#5B21B6]">
            Start Game
          </Button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="font-bold">Moves: {moves}</span>
            </div>
            <div className="flex items-center">
              <Timer className="w-5 h-5 mr-1 text-[#1E3A8A]" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>

          <Progress value={(timeLeft / 60) * 100} className="mb-6" />

          <div className="flex justify-between items-end h-64 mb-6 bg-[#F3F4F6] rounded-lg p-4">
            {towers.map((tower, towerIndex) => (
              <div
                key={towerIndex}
                className={`relative flex flex-col-reverse items-center justify-end h-full w-1/3 mx-2 cursor-pointer ${
                  selectedTower === towerIndex ? "bg-[#6D28D9]/20 rounded-lg" : ""
                }`}
                onClick={() => handleTowerClick(towerIndex)}
              >
                {/* Tower pole */}
                <div className="absolute h-full w-2 bg-gray-400 rounded-full" />

                {/* Tower base */}
                <div className="relative w-full h-3 bg-gray-500 rounded-lg mb-1" />

                {/* Disks */}
                {tower.map((diskSize, diskIndex) => (
                  <div
                    key={diskIndex}
                    className="relative z-10 rounded-lg mb-1 h-8 flex items-center justify-center text-white font-bold"
                    style={{
                      width: `${diskSize * 25}%`,
                      backgroundColor: DISK_COLORS[diskSize - 1],
                    }}
                  >
                    {diskSize}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => startGame()}
              className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0E9384] flex items-center justify-center mx-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        </>
      )}

      {gameState === "gameOver" && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">
            {towers[2].length === 3 ? "Puzzle Solved!" : "Time's Up!"}
          </h2>

          <div className="bg-[#F3F4F6] p-6 rounded-lg">
            <div className="mb-4">
              <p className="text-lg font-semibold">Your Score</p>
              <p className="text-4xl font-bold text-[#6D28D9]">{score}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Moves Used</p>
                <p className="text-xl font-bold text-[#14B8A6]">{moves}</p>
              </div>
              <div>
                <p className="font-medium">Optimal Moves</p>
                <p className="text-xl font-bold text-[#14B8A6]">{optimalMoves}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleNextGame}
            className="w-full py-6 text-lg bg-[#6D28D9] hover:bg-[#5B21B6] flex items-center justify-center"
          >
            Next Game: Pattern Puzzler
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  )
}

