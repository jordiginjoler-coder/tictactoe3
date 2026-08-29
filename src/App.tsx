/** Main App Component */

import { useTicTacToe } from './hooks/useTicTacToe';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import type { GameState, GameStatus } from './types/game';
import './styles/global.css';

function App() {
  const {
    gameState,
    score,
    status,
    makeMove,
    resetRound,
    resetGame,
    currentPlayerSymbol,
  } = useTicTacToe();

  const handleCellClick = (row: number, col: number) => {
    makeMove(row, col);
  };

  const handleNewRound = () => {
    resetRound();
  };

  const handleNewGame = () => {
    resetGame();
  };

  // Calculate responsive cell size
  const cellSize = Math.min(
    Math.floor((window.innerWidth - 48) / 3.5),
    120
  );
  const gap = Math.max(8, Math.floor(cellSize / 10));

  return (
    <main className="game-container" role="main">
      <header className="game-header">
        <h1 className="game-title">TESLA TIC-TAC-TOE</h1>
        <p className="game-subtitle">
          Juega al 3 en raya con estilo futurista
        </p>
      </header>

      <ScoreBoard score={score} />

      <GameBoard
        board={gameState.board}
        winningLine={gameState.winningLine}
        onCellClick={handleCellClick}
        isGameOver={gameState.isGameOver}
        cellSize={cellSize}
        gap={gap}
      />

      <GameStatus
        status={status}
        currentPlayer={currentPlayerSymbol}
        onNewRound={handleNewRound}
        onNewGame={handleNewGame}
      />

      <GameControls
        onNewRound={handleNewRound}
        onNewGame={handleNewGame}
        isGameOver={gameState.isGameOver}
      />

      {/* Footer */}
      <footer style={{ marginTop: 'var(--spacing-3xl)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-caption)' }}>
        <p>Construido con React + TypeScript + Vite • Diseño inspirado en Tesla</p>
      </footer>
    </main>
  );
}

export default App;