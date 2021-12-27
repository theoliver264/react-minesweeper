import { Cell } from "./Cell";

interface CellStateProps {
  cell: Cell;
  onClick: () => void;
  cellSize: string;
  onContextMenu: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export function CellState({
  cell,
  onClick,
  cellSize,
  onContextMenu,
}: CellStateProps) {
  const imgSrc = () => {
    if (cell.isLosingBomb) {
      return "./assets/bombdeath.gif";
    }
    if (cell.isRevealed) {
      if (cell.isBomb) {
        return "/assets/bombrevealed.gif";
      }
      return `/assets/open${cell.neighborBombs}.gif`;
    }
    if (cell.isFlagged) {
      return "/assets/bombflagged.gif";
    }
    return "/assets/blank.gif";
  };

  return (
    <img
      style={{
        width: cellSize,
        height: cellSize,
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      src={imgSrc()}
    />
  );
}
