/** Game Types - Type-safe Tic-Tac-Toe */

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[][];
export type WinningLine = [number, number][] | null;

export type GameMode = 'pvp' | 'pve'; // Player vs Player | Player vs Engine

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  winningLine: WinningLine;
  isGameOver: boolean;
  moveCount: number;
}

export interface Score {
  x: number;
  o: number;
  draws: number;
}

export interface GameAction {
  type: 'MOVE' | 'RESET' | 'RESET_SCORE';
  payload?: {
    row: number;
    col: number;
  };
}

export type GameStatus = 'playing' | 'x_wins' | 'o_wins' | 'draw';

export const WINNING_COMBINATIONS: [number, number][][] = [
  // Rows
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  // Columns
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  // Diagonals
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

export const INITIAL_BOARD: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export const INITIAL_STATE: GameState = {
  board: INITIAL_BOARD,
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
  isGameOver: false,
  moveCount: 0,
};

export const INITIAL_SCORE: Score = {
  x: 0,
  o: 0,
  draws: 0,
};