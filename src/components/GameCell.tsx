/** Game Cell Component - Individual Cell with Tesla Styling */

import { memo, type ReactElement } from 'react';
import '../../styles/GameBoard.css';

interface GameCellProps {
  value: 'X' | 'O' | null;
  isWinning: boolean;
  isDisabled: boolean;
  onClick: () => void;
  'aria-label': string;
}

export const GameCell = memo(function GameCell({
  value,
  isWinning,
  isDisabled,
  onClick,
  'aria-label': ariaLabel,
}: GameCellProps): ReactElement {
  const isFilled = value !== null;

  return (
    <button
      className={`game-cell ${isFilled ? 'filled' : ''} ${isDisabled ? 'disabled' : ''} ${isWinning ? 'winning' : ''}`}
      onClick={onClick}
      disabled={isDisabled || isFilled}
      aria-label={ariaLabel}
      aria-pressed={isFilled}
      aria-disabled={isDisabled || isFilled}
      type="button"
    >
      {value === 'X' && (
        <svg className="cell-symbol symbol-x" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <path d="M 20 20 L 80 80" />
          <path d="M 80 20 L 20 80" />
        </svg>
      )}
      {value === 'O' && (
        <svg className="cell-symbol symbol-o" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle cx="50" cy="50" r="35" />
        </svg>
      )}
    </button>
  );
});

GameCell.displayName = 'GameCell';