/** Game Status Component - Shows current player or game result */

import { memo, type ReactElement, useEffect, useState } from 'react';
import type { Player, GameStatus } from '../types/game';

interface GameStatusProps {
  status: GameStatus;
  currentPlayer: Player;
  onNewRound: () => void;
  onNewGame: () => void;
}

export const GameStatus = memo(function GameStatus({
  status,
  currentPlayer,
  onNewRound,
  onNewGame,
}: GameStatusProps): ReactElement {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status !== 'playing') {
      // Small delay for animation to complete
      const timer = setTimeout(() => setShowModal(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [status]);

  // Current player indicator (during play)
  if (status === 'playing') {
    return (
      <div className="current-player" role="status" aria-live="polite">
        <div className="player-indicator">
          <span className="player-label">Turno de</span>
          <svg className={`player-symbol ${currentPlayer.toLowerCase()}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            {currentPlayer === 'X' ? (
              <>
                <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 80 20 L 20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="none" />
            )}
          </svg>
        </div>
        <span className={`player-turn-indicator active ${currentPlayer === 'O' ? 'o' : ''}`}>
          JUGANDO
        </span>
      </div>
    );
  }

  // Game Over Modal
  const titles: Record<GameStatus, { text: string; className: string }> = {
    x_wins: { text: '¡EQUIPAS GANA!', className: 'x-wins' },
    o_wins: { text: '¡CÍRCULOS GANAN!', className: 'o-wins' },
    draw: { text: 'EMPATE', className: 'draw' },
    playing: { text: '', className: '' },
  };

  const messages: Record<GameStatus, string> = {
    x_wins: 'Las equis han dominado el tablero',
    o_wins: 'Los círculos han completado la línea',
    draw: 'Ambos jugadores han jugado perfectamente',
    playing: '',
  };

  const titleInfo = titles[status];

  return (
    <>
      {/* Current player indicator hidden during game over */}
      <div className="current-player" style={{ visibility: 'hidden' }} aria-hidden="true">
        <div className="player-indicator">
          <span className="player-label">Turno de</span>
          <svg className={`player-symbol ${currentPlayer.toLowerCase()}`} viewBox="0 0 100 100" aria-hidden="true">
            {currentPlayer === 'X' ? (
              <>
                <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 80 20 L 20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="none" />
            )}
          </svg>
        </div>
      </div>

      {/* Game Over Modal */}
      {showModal && (
        <div className="game-over-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true" aria-labelledby="game-over-title">
          <div className="game-over-modal" onClick={e => e.stopPropagation()}>
            <h2 id="game-over-title" className={`game-over-title ${titleInfo.className}`}>
              {titleInfo.text}
            </h2>
            <p className="game-over-message">{messages[status]}</p>
            
            <div className="game-over-stats">
              <div className="stat-item">
                <span className="stat-label">Movimientos</span>
                <span className="stat-value">{9 - (status === 'draw' ? 0 : 1)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Resultado</span>
                <span className="stat-value">{status === 'draw' ? 'Empate' : 'Victoria'}</span>
              </div>
            </div>

            <div className="game-over-actions">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => { setShowModal(false); onNewRound(); }}
                autoFocus
              >
                Nueva Partida
              </button>
              <button 
                className="btn btn-secondary btn-lg" 
                onClick={() => { setShowModal(false); onNewGame(); }}
              >
                Reiniciar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

GameStatus.displayName = 'GameStatus';