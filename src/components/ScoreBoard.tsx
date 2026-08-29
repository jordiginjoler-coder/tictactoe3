/** Score Board Component - Shows X/O/Draw scores */

import { memo, type ReactElement } from 'react';
import type { Score } from '../types/game';

interface ScoreBoardProps {
  score: Score;
}

export const ScoreBoard = memo(function ScoreBoard({ score }: ScoreBoardProps): ReactElement {
  return (
    <div className="score-board" role="region" aria-label="Marcador">
      <div className="score-item">
        <span className="score-label">Equis</span>
        <span className="score-value x" data-testid="score-x">{score.x}</span>
      </div>
      <div className="score-divider" aria-hidden="true" />
      <div className="score-item">
        <span className="score-label">Empates</span>
        <span className="score-value draw" data-testid="score-draws">{score.draws}</span>
      </div>
      <div className="score-divider" aria-hidden="true" />
      <div className="score-item">
        <span className="score-label">Círculos</span>
        <span className="score-value o" data-testid="score-o">{score.o}</span>
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';