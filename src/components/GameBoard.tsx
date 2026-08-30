/** Game Board Component - 3x3 Grid with Winning Line Overlay */

import { memo, type ReactElement } from 'react';
import { GameCell } from './GameCell';
import type { Board, WinningLine } from '../types/game';
import { getWinningLinePath } from '../utils/gameLogic';

interface GameBoardProps {
  board: Board;
  winningLine: WinningLine;
  onCellClick: (row: number, col: number) => void;
  isGameOver: boolean;
  cellSize: number;
  gap: number;
  disabled?: boolean;
}

export const GameBoard = memo(function GameBoard({
  board,
  winningLine,
  onCellClick,
  isGameOver,
  cellSize,
  gap,
  disabled = false,
}: GameBoardProps): ReactElement {
  // Calculate winning cell positions for highlighting
  const winningCells = winningLine 
    ? new Set(winningLine.map(([r, c]) => `${r}-${c}`))
    : new Set<string>();

  const linePath = getWinningLinePath(winningLine, cellSize, gap);
  const isDisabled = isGameOver || disabled;

  return (
    <div className="game-board-wrapper">
      <div 
        className="game-board" 
        role="grid"
        aria-label="Tablero de 3 en raya"
        style={{
          gridTemplateColumns: `repeat(3, ${cellSize}px)`,
          gridTemplateRows: `repeat(3, ${cellSize}px)`,
          gap: `${gap}px`,
        } as React.CSSProperties}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isWinning={winningCells.has(`${rowIndex}-${colIndex}`)}
              isDisabled={isDisabled}
              onClick={() => onCellClick(rowIndex, colIndex)}
              aria-label={cell 
                ? `Celda ${rowIndex + 1}, ${colIndex + 1}, ocupada por ${cell === 'X' ? 'equis' : 'círculo'}`
                : `Celda vacía ${rowIndex + 1}, ${colIndex + 1}`}
            />
          ))
        )}
        
        {/* Winning Line Overlay */}
        {linePath && (
          <svg className="winning-line-overlay" viewBox={`0 0 ${cellSize * 3 + gap * 2} ${cellSize * 3 + gap * 2}`} aria-hidden="true">
            <path className="winning-line" d={linePath} />
          </svg>
        )}
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';