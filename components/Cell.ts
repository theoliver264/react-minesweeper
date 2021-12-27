export class Cell {
  constructor(
    public isBomb: boolean = false,
    public isRevealed: boolean = false,
    public isFlagged: boolean = false,
    public isMarked: boolean = false,
    public neighborBombs: number = 0,
    public isLosingBomb = false
  ) {}

  public setBomb() {
    this.isBomb = true;
  }

  public setRevealed() {
    this.isRevealed = true;
  }

  public addNeighbor() {
    this.neighborBombs++;
  }

  public setFlagged() {
    this.isFlagged = true;
  }

  public setUnflagged() {
    this.isFlagged = false;
  }

  public setLosingBomb() {
    this.isLosingBomb = true;
  }

  public mark() {
    this.isMarked = true;
  }

  public unmark() {
    this.isMarked = false;
  }
}
