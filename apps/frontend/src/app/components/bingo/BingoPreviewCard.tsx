import { BingoGame } from '@bingo/models';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { Card, CardTitle } from '../common/Card';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  onClick?: () => void;
}

export const BingoPreviewCard = ({ game, onClick }: BingoPreviewCardProps) => {
  const history = useHistory();
  const auth = useAuthContext();

  //TODO null mit auth user id ersetzen
  return (
    <Card>
      <button onClick={onClick}>
        <CardTitle>{game.title}</CardTitle>
      </button>
      {game.authorId !== null && <button onClick={() => history.push(`/game/${game._id}/edit`)}>Admin</button>}
    </Card>
  );
};
