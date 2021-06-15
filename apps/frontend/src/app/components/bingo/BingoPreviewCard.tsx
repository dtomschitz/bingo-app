import { BingoGame, Phase } from '@bingo/models';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  menu: ReactNode;
  onClick: () => void;
}

function parseGamePhase(phase: Phase) {
  switch (phase) {
    case 'editing':
      return 'Spiel wird bearbeitet';
    case 'open':
      return 'Spiel ist offen für Anmeldung';
    case 'playing':
      return 'Spiel hat gestartet';
    case 'finished':
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
