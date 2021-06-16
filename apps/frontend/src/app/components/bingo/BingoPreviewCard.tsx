import { BingoGame, GamePhase } from '@bingo/models';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  menu: ReactNode;
  onClick: () => void;
}

function parseGamePhase(phase: GamePhase) {
  switch (phase) {
    case 'EDITING':
      return 'Spiel wird bearbeitet';
    case 'OPEN':
      return 'Spiel ist offen für Anmeldung';
    case 'PLAYING':
      return 'Spiel hat gestartet';
    case 'FINISHED':
      return 'Spiel wurde beendet';
    default:
      return 'Error';
  }
}

export const BingoPreviewCard = ({
  game,
  menu,
  onClick,
}: BingoPreviewCardProps) => {
  return (
    <Card onClick={onClick}>
      <CardContent>{parseGamePhase(game.phase)}</CardContent>
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
        {menu}
      </CardHeader>
    </Card>
  );
};
