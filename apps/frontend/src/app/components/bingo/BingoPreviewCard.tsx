import { BingoGame } from '@bingo/models';
import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle } from '../common';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  menu: ReactNode;
  onClick: () => void;
}

export const BingoPreviewCard = ({
  game,
  menu,
  onClick,
}: BingoPreviewCardProps) => {
  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
        {menu}
      </CardHeader>
    </Card>
  );
};
