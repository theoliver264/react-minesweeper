import { Flex, Grid } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { GameStateContext } from "../context/gameState";
import {
  initializeBoard,
  macroOpen,
  revealAllBombs,
  revealFlagged,
} from "./boardOperations";
import { Cell } from "./Cell";
import { CellState } from "./CellState";
import { Clock } from "./clock";
import { Flags } from "./flags";

export function Board({ cellSize }: { cellSize: string }) {
  const [board, setBoard] = useState<Cell[][]>([]);
  const {
    startGame,
    resetGame,
    loseGame,
    gameStarted,
    gameOver,
    boardHeight,
    boardWidth,
    maxBombs,
    decrementFlags,
    incrementFlags,
    flagCount,
    incrementRevealed,
    maxFreeSquares,
    squaresRevealed,
  } = useContext(GameStateContext);

  useEffect(() => {
    const newBoard = initializeBoard(boardWidth, boardHeight, maxBombs);
    setBoard(newBoard);
  }, []);

  function clickFace() {
    resetGame();
    const newBoard = initializeBoard(boardWidth, boardHeight, maxBombs);
    setBoard(newBoard);
  }

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (gameOver) {
        return;
      }

      const newBoard = [...board];

      if (newBoard[row][col].isFlagged) {
        return;
      }

      if (!gameStarted) {
        startGame();
      }

      if (newBoard[row][col].isBomb) {
        newBoard[row][col].setLosingBomb();
        loseGame();
        const b = revealAllBombs(newBoard);
        setBoard(b);
        return;
      }

      if (!newBoard[row][col].isBomb) {
        if (newBoard[row][col].neighborBombs === 0) {
          for (let x = row - 1; x <= row + 1; x++) {
            for (let y = col - 1; y <= col + 1; y++) {
              if (
                x >= 0 &&
                x <= boardHeight - 1 &&
                y >= 0 &&
                y <= boardWidth - 1
              ) {
                if (!newBoard[x][y].isRevealed) incrementRevealed();
                newBoard[x][y].setRevealed();
              }
            }
          }
          const newB = macroOpen(row, col, newBoard, incrementRevealed);
          setBoard(newB);
          return;
        }

        if (newBoard[row][col].isRevealed) {
          if (newBoard[row][col].neighborBombs === 0) {
            const newB = macroOpen(row, col, newBoard, incrementRevealed);
            setBoard(newB);
            return;
          }
          const newB = revealFlagged(
            row,
            col,
            newBoard,
            boardHeight,
            boardWidth,
            incrementRevealed
          );
          setBoard(newB);
          return;
        }
        newBoard[row][col].setRevealed();
        incrementRevealed();
      }

      setBoard(newBoard);
    },
    [board, boardHeight, boardWidth, gameOver, gameStarted, loseGame, maxBombs]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>, row: number, col: number) => {
      e.preventDefault();

      const newBoard = [...board];

      if (newBoard[row][col].isRevealed) {
        return;
      }

      if (newBoard[row][col].isFlagged) {
        newBoard[row][col].setUnflagged();
        incrementFlags();
        setBoard(newBoard);
        return;
      }

      if (!flagCount) {
        return;
      }

      newBoard[row][col].setFlagged();
      decrementFlags();
      setBoard(newBoard);
    },
    [board, setBoard]
  );
  return (
    <Grid templateRows="auto 1fr" gap="4px">
      <Flex flexDir="row" justifyContent={"space-between"}>
        <Flags />
        <p>{maxFreeSquares}</p>
        <img
          src={gameOver ? "/assets/facedead.gif" : "/assets/facesmile.gif"}
          width="26px"
          height="26px"
          onClick={clickFace}
        />
        <p>{squaresRevealed}</p>
        <Clock />
      </Flex>

      <Grid
        templateColumns={`repeat(${boardWidth}, ${cellSize})`}
        templateRows={`repeat(${boardHeight}, ${cellSize})`}
      >
        {board.map((row: Cell[], i) => {
          return row.map((cell, j) => {
            return (
              <CellState
                key={`${i}-${j}`}
                cell={cell}
                onClick={() => handleClick(i, j)}
                onContextMenu={(e) => handleRightClick(e, i, j)}
                cellSize={cellSize}
              />
            );
          });
        })}
      </Grid>
    </Grid>
  );
}
