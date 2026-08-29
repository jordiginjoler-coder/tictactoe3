/** Custom Hook for Tic-Tac-Toe Game Logic */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { GameState, Score, Player, GameStatus } from '../types/game';
import {
  createInitialState,
  processMove,
  resetGame,
  resetAll,
  updateScore,
  getGameStatus,
  isValidMove,
} from '../utils/gameLogic';

export interface UseTicTacToeReturn {
  // State
  gameState: GameState;
  score: Score;
  status: GameStatus;
  
  // Actions
  makeMove: (row: number, col: number) => void;
  resetRound: () => void;
  resetGame: () => void;
  
  // Computed
  currentPlayerSymbol: Player;
  isCurrentPlayerX: boolean;
  canMakeMove: (row: number, col: number) => boolean;
}

export function useTicTacToe(): UseTicTacToeReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [score, setScore] = useState<Score>({ x: 0, o: 0, draws: 0 });

  // Derived status
  const status = useMemo(() => getGameStatus(gameState.board), [gameState.board]);

  // Make a move
  const makeMove = useCallback((row: number, col: number) => {
    setGameState(prev => {
      if (!isValidMove(prev, row, col)) return prev;
      
      const newState = processMove(prev, row, col);
      
      // Update score if game ended
      if (newState.isGameOver && newState.winner) {
        setScore(currentScore => updateScore(currentScore, status));
      }
      
      return newState;
    });
  }, []);

  // Reset round (keep score)
  const resetRound = useCallback(() => {
    setGameState(prev => resetGame(score));
  }, [score]);

  // Reset everything
  const resetAllGame = useCallback(() => {
    const { state, score: newScore } = resetAll();
    setGameState(state);
    setScore(newScore);
  }, []);

  // Computed values
  const currentPlayerSymbol = gameState.currentPlayer;
  const isCurrentPlayerX = currentPlayerSymbol === 'X';

  const canMakeMove = useCallback((row: number, col: number) => {
    return isValidMove(gameState, row, col);
  }, [gameState]);

  return {
    gameState,
    score,
    status,
    makeMove,
    resetRound,
    resetGame: resetAllGame,
    currentPlayerSymbol,
    isCurrentPlayerX,
    canMakeMove,
  };
}