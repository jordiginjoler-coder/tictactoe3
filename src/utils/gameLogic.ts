/** Game Logic - Pure functions for Tic-Tac-Toe */

import type { Board, CellValue, GameState, Player, WinningLine, Score, GameStatus } from '../types/game';
import { WINNING_COMBINATIONS, INITIAL_BOARD } from '../types/game';

/**
 * Creates a new empty board
 */
export function createEmptyBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

/**
 * Checks if a cell is empty
 */
export function isCellEmpty(board: Board, row: number, col: number): boolean {
  return board[row][col] === null;
}

/**
 * Makes a move on the board (immutable)
 */
export function makeMove(board: Board, row: number, col: number, player: Player): Board {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = player;
  return newBoard;
}

/**
 * Checks for a winner
 * Returns the winning player and the winning line coordinates, or null if no winner
 */
export function checkWinner(board: Board): { player: Player; line: WinningLine } | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const cellA = board[a[0]][a[1]];
    const cellB = board[b[0]][b[1]];
    const cellC = board[c[0]][c[2]];

    if (cellA && cellA === cellB && cellB === cellC) {
      return { player: cellA, line: combination };
    }
  }
  return null;
}

/**
 * Checks if the board is full (draw)
 */
export function isBoardFull(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== null));
}

/**
 * Gets the game status
 */
export function getGameStatus(board: Board): GameStatus {
  const winnerResult = checkWinner(board);
  if (winnerResult) {
    return winnerResult.player === 'X' ? 'x_wins' : 'o_wins';
  }
  if (isBoardFull(board)) {
    return 'draw';
  }
  return 'playing';
}

/**
 * Gets the next player
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Updates score based on game result
 */
export function updateScore(score: Score, status: GameStatus): Score {
  const newScore = { ...score };
  switch (status) {
    case 'x_wins':
      newScore.x += 1;
      break;
    case 'o_wins':
      newScore.o += 1;
      break;
    case 'draw':
      newScore.draws += 1;
      break;
  }
  return newScore;
}

/**
 * Creates initial game state
 */
export function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    isGameOver: false,
    moveCount: 0,
  };
}

/**
 * Processes a move and returns new game state
 */
export function processMove(state: GameState, row: number, col: number): GameState {
  // Don't process if game is over or cell is filled
  if (state.isGameOver || !isCellEmpty(state.board, row, col)) {
    return state;
  }

  const newBoard = makeMove(state.board, row, col, state.currentPlayer);
  const status = getGameStatus(newBoard);
  const winnerResult = checkWinner(newBoard);
  const moveCount = state.moveCount + 1;

  const newState: GameState = {
    board: newBoard,
    currentPlayer: getNextPlayer(state.currentPlayer),
    winner: status === 'x_wins' ? 'X' : status === 'o_wins' ? 'O' : status === 'draw' ? 'draw' : null,
    winningLine: winnerResult?.line ?? null,
    isGameOver: status !== 'playing',
    moveCount,
  };

  return newState;
}

/**
 * Resets game state but keeps score
 */
export function resetGame(score: Score): GameState {
  return {
    ...createInitialState(),
  };
}

/**
 * Resets everything including score
 */
export function resetAll(): { state: GameState; score: Score } {
  return {
    state: createInitialState(),
    score: { x: 0, o: 0, draws: 0 },
  };
}

/**
 * Gets winning line coordinates for SVG drawing
 */
export function getWinningLinePath(line: WinningLine, cellSize: number, gap: number): string | null {
  if (!line) return null;

  const [[r1, c1], , [r3, c3]] = line;
  
  const centerX = (col: number) => gap + col * (cellSize + gap) + cellSize / 2;
  const centerY = (row: number) => gap + row * (cellSize + gap) + cellSize / 2;

  const x1 = centerX(c1);
  const y1 = centerY(r1);
  const x2 = centerX(c3);
  const y2 = centerY(r3);

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

/**
 * Validates if a move is legal
 */
export function isValidMove(state: GameState, row: number, col: number): boolean {
  return (
    row >= 0 && row < 3 &&
    col >= 0 && col < 3 &&
    !state.isGameOver &&
    isCellEmpty(state.board, row, col)
  );
}