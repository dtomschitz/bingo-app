import { Card, CardTitle } from 'components/common/Card';
import { BingoGame } from '../../../../lib/models';

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
