/** Game Mode Selector Component - Choose between PvP and PvE */

import { memo, type ReactElement } from 'react';
import type { GameMode } from '../types/game';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export const GameModeSelector = memo(function GameModeSelector({
  currentMode,
  onChange,
  disabled = false,
}: GameModeSelectorProps): ReactElement {
  const modes: { value: GameMode; label: string; description: string }[] = [
    { value: 'pvp', label: '2 Jugadores', description: 'Humano vs Humano' },
    { value: 'pve', label: '1 Jugador', description: 'Humano vs Máquina' },
  ];

  return (
    <div className="game-mode-selector" role="group" aria-label="Modo de juego">
      {modes.map(({ value, label, description }) => (
        <button
          key={value}
          className={`mode-btn ${currentMode === value ? 'active' : ''}`}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          aria-pressed={currentMode === value}
        >
          <span className="mode-label">{label}</span>
          <span className="mode-description">{description}</span>
        </button>
      ))}
    </div>
  );
});

GameModeSelector.displayName = 'GameModeSelector';