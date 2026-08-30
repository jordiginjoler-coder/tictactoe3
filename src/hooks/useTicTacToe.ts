/** Custom Hook for Tic-Tac-Toe Game Logic */

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { GameState, Score, Player, GameStatus, GameMode } from '../types/game';
import {
  createInitialState,
  processMove,
  resetGame,
  resetAll,
  updateScore,
  getGameStatus,
  isValidMove,
  getBestMove,
} from '../utils/gameLogic';

interface UseTicTacToeReturn {
  // State
  gameState: GameState;
  score: Score;
  status: GameStatus;
  gameMode: GameMode;
  
  // Actions
  makeMove: (row: number, col: number) => void;
  resetRound: () => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
  
  // Computed
  currentPlayerSymbol: Player;
  isCurrentPlayerX: boolean;
  canMakeMove: (row: number, col: number) => boolean;
  isAIThinking: boolean;
}

export function useTicTacToe(): UseTicTacToeReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [score, setScore] = useState<Score>({ x: 0, o: 0, draws: 0 });
  const [gameMode, setGameModeState] = useState<GameMode>('pvp');
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Derived status
  const status = useMemo(() => getGameStatus(gameState.board), [gameState.board]);

  // Update score when game ends (fix stale closure with useEffect)
  useEffect(() => {
    if (gameState.isGameOver && gameState.winner) {
      setScore(currentScore => updateScore(currentScore, status));
    }
  }, [gameState.isGameOver, gameState.winner, status]);

  // AI move for PvE mode
  const makeAIMove = useCallback(() => {
    if (gameMode !== 'pve' || gameState.isGameOver) return;
    
    setIsAIThinking(true);
    // Small delay for UX
    setTimeout(() => {
      setGameState(prev => {
        if (prev.isGameOver) return prev;
        const bestMove = getBestMove(prev.board, 'O');
        if (bestMove) {
          const [row, col] = bestMove;
          return processMove(prev, row, col);
        }
        return prev;
      });
      setIsAIThinking(false);
    }, 400);
  }, [gameMode, gameState.isGameOver]);

  // Trigger AI move after human move in PvE
  useEffect(() => {
    if (gameMode === 'pve' && gameState.currentPlayer === 'O' && !gameState.isGameOver) {
      makeAIMove();
    }
  }, [gameState.currentPlayer, gameState.isGameOver, gameMode, makeAIMove]);

  // Make a move (human)
  const makeMove = useCallback((row: number, col: number) => {
    setGameState(prev => {
      if (!isValidMove(prev, row, col)) return prev;
      
      const newState = processMove(prev, row, col);
      return newState;
    });
  }, []);

  // Reset round (keep score)
  const resetRound = useCallback(() => {
    setGameState(() => resetGame(score));
  }, [score]);

  // Reset everything
  const resetAllGame = useCallback(() => {
    const { state, score: newScore } = resetAll();
    setGameState(state);
    setScore(newScore);
  }, []);

  // Change game mode - resets everything
  const handleSetGameMode = useCallback((mode: GameMode) => {
    setGameModeState(mode);
    const { state, score: newScore } = resetAll();
    setGameState(state);
    setScore(newScore);
    setIsAIThinking(false);
  }, []);

  // Computed values
  const currentPlayerSymbol = gameState.currentPlayer;
  const isCurrentPlayerX = currentPlayerSymbol === 'X';

  const canMakeMove = useCallback((row: number, col: number) => {
    // In PvE, human can only move as X
    if (gameMode === 'pve' && currentPlayerSymbol === 'O') return false;
    return isValidMove(gameState, row, col);
  }, [gameState, gameMode, currentPlayerSymbol]);

  return {
    gameState,
    score,
    status,
    gameMode,
    makeMove,
    resetRound,
    resetGame: resetAllGame,
    setGameMode: handleSetGameMode,
    currentPlayerSymbol,
    isCurrentPlayerX,
    canMakeMove,
    isAIThinking,
  };
}