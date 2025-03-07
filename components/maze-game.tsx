"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MazeGameProps {
  onComplete: (score: number) => void;
}

const MAZE_SIZE = 21; // Ensure odd number for better maze structure
const CELL_SIZE = 30; // Adjusted for better fit on screen
const PLAYER = "P";
const WALL = "#";
const EXIT = "E";
const PATH = " ";

const COLORS = {
  START: "#FFD700", // Gold for start position
  END: "#FF4500", // Orange-Red for exit position
  WALL: "#1E3A8A", // Dark Blue for walls
  PLAYER: "#6D28D9", // Purple for the player
  EXIT: "#14B8A6", // Teal for exit
  PATH: "#F3F4F6", // Light gray for paths
};

// Session storage keys for maze game
const MAZE_STORAGE_KEYS = {
  MAZE: "maze_game_maze",
  PLAYER_POS: "maze_game_player_pos",
  GAME_COMPLETE: "maze_game_complete"
};

const generateMaze = () => {
  const maze = Array.from({ length: MAZE_SIZE }, () => Array(MAZE_SIZE).fill(WALL));

  const carvePath = (x: number, y: number) => {
    maze[y][x] = PATH;
    const directions = [
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX > 0 && newX < MAZE_SIZE - 1 && newY > 0 && newY < MAZE_SIZE - 1 && maze[newY][newX] === WALL) {
        maze[newY][newX] = PATH;
        maze[y + dy / 2][x + dx / 2] = PATH;
        carvePath(newX, newY);
      }
    }
  };

  carvePath(1, 1);
  maze[1][1] = PLAYER;
  maze[MAZE_SIZE - 2][MAZE_SIZE - 2] = EXIT;
  return maze;
};

const saveMazeToStorage = (maze: string[][], playerPos: { x: number, y: number }, gameComplete: boolean) => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(MAZE_STORAGE_KEYS.MAZE, JSON.stringify(maze));
    sessionStorage.setItem(MAZE_STORAGE_KEYS.PLAYER_POS, JSON.stringify(playerPos));
    sessionStorage.setItem(MAZE_STORAGE_KEYS.GAME_COMPLETE, JSON.stringify(gameComplete));
  } catch (error) {
    console.error("Error saving maze game to session storage:", error);
  }
};

const clearMazeStorage = () => {
  if (typeof window === 'undefined') return;
  
  Object.values(MAZE_STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
};

export default function MazeGame({ onComplete }: MazeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maze, setMaze] = useState(() => {
    // Try to load maze from session storage
    if (typeof window !== 'undefined') {
      try {
        const savedMaze = sessionStorage.getItem(MAZE_STORAGE_KEYS.MAZE);
        if (savedMaze) {
          return JSON.parse(savedMaze);
        }
      } catch (error) {
        console.error("Error loading maze from session storage:", error);
      }
    }
    return generateMaze();
  });
  
  const [playerPos, setPlayerPos] = useState(() => {
    // Try to load player position from session storage
    if (typeof window !== 'undefined') {
      try {
        const savedPlayerPos = sessionStorage.getItem(MAZE_STORAGE_KEYS.PLAYER_POS);
        if (savedPlayerPos) {
          return JSON.parse(savedPlayerPos);
        }
      } catch (error) {
        console.error("Error loading player position from session storage:", error);
      }
    }
    return { x: 1, y: 1 };
  });
  
  const [gameComplete, setGameComplete] = useState(() => {
    // Try to load game complete state from session storage
    if (typeof window !== 'undefined') {
      try {
        const savedGameComplete = sessionStorage.getItem(MAZE_STORAGE_KEYS.GAME_COMPLETE);
        if (savedGameComplete) {
          return JSON.parse(savedGameComplete);
        }
      } catch (error) {
        console.error("Error loading game complete state from session storage:", error);
      }
    }
    return false;
  });

  // Save game state to session storage whenever it changes
  useEffect(() => {
    saveMazeToStorage(maze, playerPos, gameComplete);
  }, [maze, playerPos, gameComplete]);

  const drawMaze = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = MAZE_SIZE * CELL_SIZE;
    canvas.height = MAZE_SIZE * CELL_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        ctx.fillStyle = COLORS[maze[y][x] as keyof typeof COLORS] || COLORS.PATH;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        if (maze[y][x] === WALL) {
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 3;
          ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    ctx.fillStyle = COLORS.START;
    ctx.fillRect(1 * CELL_SIZE, 1 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    ctx.fillStyle = COLORS.END;
    ctx.fillRect((MAZE_SIZE - 2) * CELL_SIZE, (MAZE_SIZE - 2) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    ctx.fillStyle = COLORS.PLAYER;
    ctx.beginPath();
    ctx.arc(
      playerPos.x * CELL_SIZE + CELL_SIZE / 2,
      playerPos.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [maze, playerPos]);

  useEffect(() => {
    drawMaze();
  }, [drawMaze]);

  const resetGame = useCallback(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGameComplete(false);
    clearMazeStorage();
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX < 0 || newY < 0 || newX >= MAZE_SIZE || newY >= MAZE_SIZE) return;
    if (maze[newY][newX] === WALL) return;

    setPlayerPos({ x: newX, y: newY });
    if (maze[newY][newX] === EXIT) {
      setGameComplete(true);
      // Clear storage when game is complete
      clearMazeStorage();
      setTimeout(() => onComplete(1000), 500);
    }
  }, [playerPos, maze, onComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameComplete) return;
      switch (event.key) {
        case "ArrowUp": movePlayer(0, -1); break;
        case "ArrowDown": movePlayer(0, 1); break;
        case "ArrowLeft": movePlayer(-1, 0); break;
        case "ArrowRight": movePlayer(1, 0); break;
        case "r": resetGame(); break; // Add 'r' key to reset the game
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, gameComplete, resetGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F4F6] py-4">
      <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2">Maze Navigator</h2>
      {gameComplete ? (
        <p className="text-[#E53E3E] font-bold mb-4">You reached the exit!</p>
      ) : (
        <div className="text-center mb-2">
          <p className="text-[#1E3A8A]">Use Arrow Keys to Move</p>
          <p className="text-sm text-gray-500">Press 'R' to reset the maze</p>
        </div>
      )}
      <canvas ref={canvasRef} className="border-4 border-[#1E3A8A] bg-[#F3F4F6]" style={{ width: MAZE_SIZE * CELL_SIZE, height: MAZE_SIZE * CELL_SIZE }} />
    </div>
  );
}
