"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Timer, Trophy, ArrowRight } from "lucide-react"

// Define the color palette
const COLORS = {
  red: "#E53E3E",
  blue: "#1E3A8A", 
  green: "#10B981",
  yellow: "#F59E0B",
  orange: "#FB923C",
}

// Color names for the game
const COLOR_NAMES = ["red", "blue", "green", "yellow", "orange"]

type GameState = "ready" | "playing" | "gameOver"

interface StroopGameProps {
  onComplete: (score: number) => void
}

// Session storage keys for this game
const STROOP_SESSION_KEYS = {
  GAME_STATE: "stroop_game_state",
  SCORE: "stroop_score",
  TIME_LEFT: "stroop_time_left",
  CURRENT_WORD: "stroop_current_word",
  CURRENT_COLOR: "stroop_current_color",
  STREAK: "stroop_streak",
  BEST_STREAK: "stroop_best_streak"
}

export default function StroopGame({ onComplete }: StroopGameProps) {
  const [gameState, setGameState] = useState<GameState>("ready")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30) // Reduced time for the game series
  const [currentWord, setCurrentWord] = useState("")
  const [currentColor, setCurrentColor] = useState("")
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  // Generate a new challenge
  const generateChallenge = useCallback(() => {
    const randomWordIndex = Math.floor(Math.random() * COLOR_NAMES.length)
    const randomColorIndex = Math.floor(Math.random() * COLOR_NAMES.length)

    // Ensure the word and color are different at least 70% of the time to make it challenging
    const shouldBeDifferent = Math.random() < 0.7
    const finalColorIndex =
      shouldBeDifferent && randomWordIndex === randomColorIndex
        ? (randomColorIndex + 1) % COLOR_NAMES.length
        : randomColorIndex

    setCurrentWord(COLOR_NAMES[randomWordIndex])
    setCurrentColor(COLOR_NAMES[finalColorIndex])
  }, [])

  // Load saved state from session storage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedGameState = sessionStorage.getItem(STROOP_SESSION_KEYS.GAME_STATE) as GameState | null
        const savedScore = sessionStorage.getItem(STROOP_SESSION_KEYS.SCORE)
        const savedTimeLeft = sessionStorage.getItem(STROOP_SESSION_KEYS.TIME_LEFT)
        const savedCurrentWord = sessionStorage.getItem(STROOP_SESSION_KEYS.CURRENT_WORD)
        const savedCurrentColor = sessionStorage.getItem(STROOP_SESSION_KEYS.CURRENT_COLOR)
        const savedStreak = sessionStorage.getItem(STROOP_SESSION_KEYS.STREAK)
        const savedBestStreak = sessionStorage.getItem(STROOP_SESSION_KEYS.BEST_STREAK)

        if (savedGameState) {
          setGameState(savedGameState as GameState)
        }
        
        if (savedScore) {
          setScore(parseInt(savedScore))
        }
        
        if (savedTimeLeft) {
          setTimeLeft(parseInt(savedTimeLeft))
        }
        
        if (savedCurrentWord) {
          setCurrentWord(savedCurrentWord)
        }
        
        if (savedCurrentColor) {
          setCurrentColor(savedCurrentColor)
        }
        
        if (savedStreak) {
          setStreak(parseInt(savedStreak))
        }
        
        if (savedBestStreak) {
          setBestStreak(parseInt(savedBestStreak))
        }
        
        // If we have a saved game but no challenge, generate one
        if (savedGameState === "playing" && (!savedCurrentWord || !savedCurrentColor)) {
          generateChallenge()
        }
      } catch (error) {
        console.error("Error loading Stroop game from session storage:", error)
        // Continue with default state if there's an error
      }
    }
  }, [generateChallenge])

  // Update session storage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STROOP_SESSION_KEYS.GAME_STATE, gameState)
      sessionStorage.setItem(STROOP_SESSION_KEYS.SCORE, score.toString())
      sessionStorage.setItem(STROOP_SESSION_KEYS.TIME_LEFT, timeLeft.toString())
      sessionStorage.setItem(STROOP_SESSION_KEYS.CURRENT_WORD, currentWord)
      sessionStorage.setItem(STROOP_SESSION_KEYS.CURRENT_COLOR, currentColor)
      sessionStorage.setItem(STROOP_SESSION_KEYS.STREAK, streak.toString())
      sessionStorage.setItem(STROOP_SESSION_KEYS.BEST_STREAK, bestStreak.toString())
    }
  }, [gameState, score, timeLeft, currentWord, currentColor, streak, bestStreak])

  // Start the game
  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(30) // Reduced time for the game series
    setStreak(0)
    generateChallenge()
    
    // Clear previous session data for this game
    if (typeof window !== 'undefined') {
      Object.values(STROOP_SESSION_KEYS).forEach(key => {
        sessionStorage.removeItem(key)
      })
    }
  }

  // Handle user selection
  const handleColorSelect = (selectedColor: string) => {
    if (selectedColor === currentColor) {
      setScore(score + 1)
      setStreak(streak + 1)
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1)
      }
    } else {
      setStreak(0)
    }
    generateChallenge()
  }

  // Move to next game
  const handleNextGame = () => {
    // Clear session storage for this game when moving to the next game
    if (typeof window !== 'undefined') {
      Object.values(STROOP_SESSION_KEYS).forEach(key => {
        sessionStorage.removeItem(key)
      })
    }
    onComplete(score)
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
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameState])

  return (
    <Card className="w-full p-6 shadow-xl bg-white">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Stroop Challenge</h1>
        <p className="text-gray-600">
          Game 1 of 3: Select the <strong>color</strong> of the text, not what it says!
        </p>
      </div>

      {gameState === "ready" && (
        <div className="text-center space-y-6">
          <div className="bg-[#F3F4F6] p-4 rounded-lg">
            <p className="mb-4">
              The Stroop effect demonstrates how our brains process conflicting information. Your task is to identify
              the <strong>color</strong> of the text, ignoring what the word actually says.
            </p>
            <p>You have 30 seconds. How many can you get right?</p>
          </div>
          <Button onClick={startGame} className="w-full py-6 text-lg bg-[#1E3A8A] hover:bg-[#1E40AF]">
            Start Game
          </Button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-1 text-[#E53E3E]" />
              <span className="font-bold">{score}</span>
            </div>
            <div className="flex items-center">
              <Timer className="w-5 h-5 mr-1 text-[#1E3A8A]" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">Streak: {streak}</span>
            </div>
          </div>

          <Progress value={(timeLeft / 30) * 100} className="mb-6" />

          <div className="flex justify-center items-center h-32 mb-8 bg-[#F3F4F6] rounded-lg">
            <span className="text-5xl font-bold" style={{ color: COLORS[currentColor as keyof typeof COLORS] }}>
              {currentWord.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {COLOR_NAMES.map((color) => (
              <Button
                key={color}
                onClick={() => handleColorSelect(color)}
                className="py-6"
                style={{
                  backgroundColor: COLORS[color as keyof typeof COLORS],
                  borderColor: COLORS[color as keyof typeof COLORS],
                }}
              >
                <span className="sr-only">{color}</span>
              </Button>
            ))}
          </div>
        </>
      )}

      {gameState === "gameOver" && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Game Complete!</h2>

          <div className="bg-[#F3F4F6] p-6 rounded-lg">
            <div className="mb-4">
              <p className="text-lg font-semibold">Your Score</p>
              <p className="text-4xl font-bold text-[#E53E3E]">{score}</p>
            </div>

            <div className="text-sm">
              <p className="font-medium">Best Streak</p>
              <p className="text-xl font-bold text-[#10B981]">{bestStreak}</p>
            </div>
          </div>

          <Button
            onClick={handleNextGame}
            className="w-full py-6 text-lg bg-[#1E3A8A] hover:bg-[#1E40AF] flex items-center justify-center"
          >
            Next Game: Tower of Hanoi
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  )
}

