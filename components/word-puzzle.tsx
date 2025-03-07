"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Timer } from "lucide-react"

interface WordPuzzleProps {
  onComplete: (score: number) => void
}

const WORDS = [
  "COGNITIVE",
  "PUZZLE",
  "BRAIN",
  "MEMORY",
  "CHALLENGE",
  "INTELLIGENCE",
  "LEARNING",
  "KNOWLEDGE",
  "THINKING",
  "PROBLEM",
]

// Session storage keys for word puzzle game
const WORD_PUZZLE_KEYS = {
  CURRENT_WORD: "word_puzzle_current_word",
  SHUFFLED_WORD: "word_puzzle_shuffled_word",
  USER_INPUT: "word_puzzle_user_input",
  SCORE: "word_puzzle_score",
  TIME_LEFT: "word_puzzle_time_left",
  GAME_STATE: "word_puzzle_game_state"
}

const shuffleWord = (word: string) => {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

export default function WordPuzzle({ onComplete }: WordPuzzleProps) {
  const [currentWord, setCurrentWord] = useState("")
  const [shuffledWord, setShuffledWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState<"ready" | "playing" | "complete">("ready")

  // Load saved state from session storage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCurrentWord = sessionStorage.getItem(WORD_PUZZLE_KEYS.CURRENT_WORD)
        const savedShuffledWord = sessionStorage.getItem(WORD_PUZZLE_KEYS.SHUFFLED_WORD)
        const savedUserInput = sessionStorage.getItem(WORD_PUZZLE_KEYS.USER_INPUT)
        const savedScore = sessionStorage.getItem(WORD_PUZZLE_KEYS.SCORE)
        const savedTimeLeft = sessionStorage.getItem(WORD_PUZZLE_KEYS.TIME_LEFT)
        const savedGameState = sessionStorage.getItem(WORD_PUZZLE_KEYS.GAME_STATE) as "ready" | "playing" | "complete" | null

        if (savedCurrentWord) setCurrentWord(savedCurrentWord)
        if (savedShuffledWord) setShuffledWord(savedShuffledWord)
        if (savedUserInput) setUserInput(savedUserInput)
        if (savedScore) setScore(parseInt(savedScore))
        if (savedTimeLeft) setTimeLeft(parseInt(savedTimeLeft))
        if (savedGameState) setGameState(savedGameState)

        // If we have a saved game but no current word, generate a new one
        if (savedGameState === "playing" && !savedCurrentWord) {
          nextWord()
        }
      } catch (error) {
        console.error("Error loading Word Puzzle game from session storage:", error)
        // Continue with default state if there's an error
      }
    }
  }, [])

  // Update session storage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(WORD_PUZZLE_KEYS.CURRENT_WORD, currentWord)
      sessionStorage.setItem(WORD_PUZZLE_KEYS.SHUFFLED_WORD, shuffledWord)
      sessionStorage.setItem(WORD_PUZZLE_KEYS.USER_INPUT, userInput)
      sessionStorage.setItem(WORD_PUZZLE_KEYS.SCORE, score.toString())
      sessionStorage.setItem(WORD_PUZZLE_KEYS.TIME_LEFT, timeLeft.toString())
      sessionStorage.setItem(WORD_PUZZLE_KEYS.GAME_STATE, gameState)
    }
  }, [currentWord, shuffledWord, userInput, score, timeLeft, gameState])

  // Timer effect
  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setGameState("complete")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameState])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(60)
    nextWord()
    
    // Clear previous session data for this game
    clearSessionStorage()
  }

  const resetGame = () => {
    setGameState("ready")
    setScore(0)
    setTimeLeft(60)
    nextWord()
    
    // Clear session storage
    clearSessionStorage()
  }

  const clearSessionStorage = () => {
    if (typeof window !== 'undefined') {
      Object.values(WORD_PUZZLE_KEYS).forEach(key => {
        sessionStorage.removeItem(key)
      })
    }
  }

  const nextWord = useCallback(() => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(word)
    setShuffledWord(shuffleWord(word))
    setUserInput("")
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.toUpperCase() === currentWord) {
      setScore(score + 1)
      nextWord()
    } else {
      alert("Incorrect! Try again.")
    }
  }

  const handleComplete = () => {
    // Clear session storage when game is complete
    clearSessionStorage()
    onComplete(score * 100) // Each correct word is worth 100 points
    alert(`Game Over! Your score: ${score * 100}`)
  }

  return (
    <Card className="w-full p-6 shadow-xl bg-white">
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2 text-center">Word Puzzle</h1>
      <p className="text-gray-600 text-center mb-4">Game 6 of 6: Unscramble the words</p>

      {gameState === "ready" && (
        <div className="text-center space-y-4">
          <p>Unscramble as many words as you can before time runs out!</p>
          <Button onClick={startGame} className="w-full bg-[#6D28D9] hover:bg-[#5B21B6]">
            Start Game
          </Button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Score: {score}</span>
            <div className="flex items-center">
              <Timer className="w-5 h-5 mr-1 text-[#1E3A8A]" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-[#6D28D9]">{shuffledWord}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your guess"
              className="text-center"
            />
            <Button type="submit" className="w-full bg-[#14B8A6] hover:bg-[#0D9488]">
              Submit
            </Button>
          </form>
        </>
      )}

      {gameState === "complete" && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Game Complete!</h2>
          <p className="text-xl font-bold">Words Unscrambled: {score}</p>
          <p className="text-xl font-bold">Score: {score * 100}</p>
          <Button onClick={handleComplete} className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF]">
            Complete Challenge Series
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  )
}

