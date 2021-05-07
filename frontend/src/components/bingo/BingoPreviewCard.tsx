import { BingoGame } from '../../../../lib/models';
import { Card, CardTitle } from '../common/Card';

interface BingoPreviewCardProps {
  game: BingoGame;
  onClick: () => void;
}

export const BingoPreviewCard = ({ game, onClick }: BingoPreviewCardProps) => {
  return (
    <Card onClick={onClick}>
      <CardTitle>{game.title}</CardTitle>
    </Card>
  );
};
