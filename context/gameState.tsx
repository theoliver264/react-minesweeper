import { createContext, useEffect, useMemo, useState } from "react";
import { useTimer } from "./useTimer";

const initialGameState = {
  clock: 0,
  gameOver: false,
  gameStarted: false,
  gameWon: false,
  maxBombs: 0,
  boardWidth: 0,
  boardHeight: 0,
  flagCount: 0,
  squaresRevealed: 0,
  maxFreeSquares: 0,
  startGame: () => {},
  resetGame: () => {},
  loseGame: () => {},
  decrementFlags: () => {},
  incrementFlags: () => {},
  incrementRevealed: () => {},
};

export const GameStateContext = createContext(initialGameState);

interface GameStateProviderProps {
  children: React.ReactNode;
  boardWidth: number;
  boardHeight: number;
  maxBombs: number;
}
export function GameStateProvider({
  children,
  boardWidth,
  boardHeight,
  maxBombs,
}: GameStateProviderProps) {
  const { pause, reset, seconds: clock, start, stop } = useTimer();
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [flagCount, setFlagCount] = useState(maxBombs);
  const [squaresRevealed, setSquaresRevealed] = useState(0);

  const maxFreeSquares = useMemo(() => boardWidth * boardHeight - maxBombs, [
    boardWidth,
    boardHeight,
    maxBombs,
  ]);

  const gameWon = useMemo(() => squaresRevealed === maxFreeSquares, [
    squaresRevealed,
    maxFreeSquares,
  ]);

  function startGame() {
    setGameStarted(true);
    reset();
    start();
  }

  function loseGame() {
    setGameOver(true);
    pause();
  }

  function resetGame() {
    setGameStarted(false);
    setGameOver(false);
    setSquaresRevealed(0);
    setFlagCount(maxBombs);
    stop();
  }

  function winGame() {
    pause();
    alert("You won!");
  }

  function decrementFlags() {
    setFlagCount((curr) => curr - 1);
  }

  function incrementFlags() {
    setFlagCount((curr) => curr + 1);
  }

  function incrementRevealed() {
    setSquaresRevealed((curr) => curr + 1);
  }

  useEffect(() => {
    if (gameStarted && gameWon) {
      winGame();
    }
  }, [gameWon]);

  return (
    <GameStateContext.Provider
      value={{
        gameWon,
        flagCount,
        squaresRevealed,
        maxFreeSquares,
        boardWidth,
        boardHeight,
        maxBombs,
        clock,
        gameOver,
        gameStarted,
        startGame,
        resetGame,
        loseGame,
        decrementFlags,
        incrementFlags,
        incrementRevealed,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
