import { Cell } from "./Cell";

export function initializeBoard(
  boardWidth: number,
  boardHeight: number,
  maxBombs: number
) {
  const newBoard = Array.from({ length: boardHeight }, () =>
    Array.from({ length: boardWidth }, () => new Cell())
  );

  let boardWithBombs = [...newBoard];
  for (let i = 0; i < maxBombs; i++) {
    let bombPlaced = false;
    let row = Math.floor(Math.random() * boardHeight);
    let col = Math.floor(Math.random() * boardWidth);
    const newBoardW = [...boardWithBombs];

    while (!bombPlaced) {
      if (!newBoardW[row][col].isBomb) {
        newBoardW[row][col].setBomb();
        for (let x = row - 1; x <= row + 1; x++) {
          for (let y = col - 1; y <= col + 1; y++) {
            if (
              x >= 0 &&
              x <= boardHeight - 1 &&
              y >= 0 &&
              y <= boardWidth - 1
            ) {
              newBoardW[x][y].addNeighbor();
            }
          }
        }
        bombPlaced = true;
      } else {
        row = Math.floor(Math.random() * boardHeight);
        col = Math.floor(Math.random() * boardWidth);
      }
      boardWithBombs = newBoardW;
    }
  }

  return boardWithBombs;
}

export function revealFlagged(
  row: number,
  col: number,
  board: Cell[][],
  boardHeight: number,
  boardWidth: number,
  incRevealed: () => void
) {
  let flagged = 0;
  for (let x = row - 1; x <= row + 1; x++) {
    for (let y = col - 1; y <= col + 1; y++) {
      if (x >= 0 && x <= boardHeight - 1 && y >= 0 && y <= boardWidth - 1) {
        if (board[x][y].isBomb && board[x][y].isFlagged) {
          flagged++;
        }
      }
    }
  }
  if (flagged === board[row][col].neighborBombs) {
    for (let x = row - 1; x <= row + 1; x++) {
      for (let y = col - 1; y <= col + 1; y++) {
        if (x >= 0 && x <= boardHeight - 1 && y >= 0 && y <= boardWidth - 1) {
          if (!board[x][y].isRevealed && !board[x][y].isBomb) {
            board[x][y].setRevealed();
            incRevealed();
          }
        }
      }
    }
  }
  return board;
}

export function revealAllBombs(board: Cell[][]) {
  const newBoard = [...board];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (newBoard[i][j].isBomb) {
        newBoard[i][j].setRevealed();
      }
    }
  }
  return newBoard;
}

export function macroOpen(
  i: number,
  j: number,
  board: Cell[][],
  incrementRevealed: () => void
) {
  const squares = [...board];

  const stack = [[i, j]];
  while (stack.length) {
    const squareCoordinates = stack.pop();
    let newI = squareCoordinates[0];
    let newJ = squareCoordinates[1];

    if (newI < 0 || newI >= board.length) continue;
    if (newJ < 0 || newJ >= board[0].length) continue;
    if (squares[newI][newJ].isFlagged) continue;
    if (squares[newI][newJ].isBomb) continue;
    if (squares[newI][newJ].neighborBombs) {
      let nextSquare = squares[newI][newJ];
      nextSquare.isMarked = true;
      continue;
    }

    let nextSquare = squares[newI][newJ];

    if (nextSquare.isMarked) continue;

    Array.prototype.push.apply(stack, [
      [newI - 1, newJ],
      [newI + 1, newJ],
      [newI, newJ - 1],
      [newI, newJ + 1],
      [newI - 1, newJ - 1],
      [newI - 1, newJ + 1],
      [newI + 1, newJ - 1],
      [newI + 1, newJ + 1],
    ]);
    nextSquare.isMarked = true;
  }
  return openMarkedCells(squares, incrementRevealed);
}

function openMarkedCells(b: Cell[][], incrementRevealed: () => void) {
  const newBoard = [...b];
  for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      if (newBoard[i][j].isMarked && !newBoard[i][j].isRevealed) {
        newBoard[i][j].setRevealed();
        incrementRevealed();
        newBoard[i][j].unmark();
      }
    }
  }
  return newBoard;
}

export function handleGameFirstClick(
  board: Cell[][],
  row: number,
  col: number
) {
  const bombsToPlace = board[row][col].neighborBombs;

  let returnBoard = [...board];

  //remove bombs from 3x3 area
  for (let x = row - 1; x <= row + 1; x++) {
    for (let y = col - 1; y <= col + 1; y++) {
      if (
        x >= 0 &&
        x <= board.length - 1 &&
        y >= 0 &&
        y <= board[0].length - 1
      ) {
        if (board[x][y].isBomb) {
          board[x][y].unsetBomb();
        }
      }
    }
  }

  //place bombs outside area
  for (let i = 0; i < bombsToPlace; i++) {
    let bombPlaced = false;
    let newRow = Math.floor(Math.random() * board.length);
    let newCol = Math.floor(Math.random() * board[0].length);
    const newBoard = [...board];

    //find place ouside of 3x3 area
    while (
      newRow < row + 1 &&
      newRow > row - 1 &&
      newCol < col + 1 &&
      newCol > col - 1
    ) {
      newRow = Math.floor(Math.random() * board.length);
      newCol = Math.floor(Math.random() * board[0].length);
    }

    while (!bombPlaced) {
      if (
        newRow >= 0 &&
        newRow <= board.length - 1 &&
        newCol >= 0 &&
        newCol <= board[0].length - 1 &&
        !newBoard[newRow][newCol].isBomb
      ) {
        newBoard[newRow][newCol].setBomb();
        bombPlaced = true;
      } else {
        while (true) {
          newRow = Math.floor(Math.random() * board.length);
          newCol = Math.floor(Math.random() * board[0].length);

          if (
            !(
              newRow > row + 1 &&
              newRow < row - 1 &&
              newCol < col + 1 &&
              newCol > col - 1
            )
          ) {
            break;
          }
        }
      }
    }
    returnBoard = newBoard;
  }

  //recalculate neighbors
  for (let i = 0; i < returnBoard.length; i++) {
    for (let j = 0; j < returnBoard[0].length; j++) {
      returnBoard[i][j].setNeighbors(countNeighborBombs(board, i, j));
    }
  }

  return returnBoard;
}

function countNeighborBombs(board: Cell[][], row: number, col: number) {
  let count = 0;
  for (let x = row - 1; x <= row + 1; x++) {
    for (let y = col - 1; y <= col + 1; y++) {
      if (
        x >= 0 &&
        x <= board.length - 1 &&
        y >= 0 &&
        y <= board[0].length - 1
      ) {
        if (board[x][y].isBomb) {
          count++;
        }
      }
    }
  }

  return count;
}
