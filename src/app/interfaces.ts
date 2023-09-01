import { Subject } from 'rxjs';

export enum CellType {
  DISABLED,
  FULFILLED,
  REJECTED,
  PENDING,
  INITIAL,
}

export interface Score {
  computer: number;
  player: number;
}

export enum ROUND_RESULT {
  COMPUTER,
  PLAYER,
  ABORT,
}

export type Cells = Array<Array<Cell>>;
export type Cell = { type: CellType; click$: Subject<void> | null };

export type Winner = ROUND_RESULT.PLAYER | ROUND_RESULT.COMPUTER;
export interface GameResults {
  winner: Winner;
  score: Score;
}
