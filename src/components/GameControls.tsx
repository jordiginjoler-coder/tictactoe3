/** Game Controls Component - Action Buttons */

import { memo, type ReactElement } from 'react';

interface GameControlsProps {
  onNewRound: () => void;
  onNewGame: () => void;
  isGameOver: boolean;
}

export const GameControls = memo(function GameControls({
  onNewRound,
  onNewGame,
  isGameOver,
}: GameControlsProps): ReactElement {
  return (
    <div className="game-controls" role="group" aria-label="Controles del juego">
      <button
        className="btn btn-primary btn-lg"
        onClick={onNewRound}
        disabled={!isGameOver}
        aria-disabled={!isGameOver}
      >
        {isGameOver ? 'Nueva Partida' : 'Partida en curso'}
      </button>
      <button
        className="btn btn-secondary btn-lg"
        onClick={onNewGame}
      >
        Reiniciar Marcador
      </button>
    </div>
  );
});

GameControls.displayName = 'GameControls';