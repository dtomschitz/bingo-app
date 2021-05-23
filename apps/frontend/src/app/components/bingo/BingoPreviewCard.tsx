import { BingoGame } from '@bingo/models';
import { Card, CardTitle } from '../common/Card';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CreateInstanceContext } from '../../services/contexts';
import { InstanceDialogState } from '../../App';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  onClick?: () => void;
}

export const BingoPreviewCard = ({ game, onClick }: BingoPreviewCardProps) => {
  const history = useHistory();
  const [instanceDialogState, setInstanceDialogState] = useContext(CreateInstanceContext);


  const openGame = (game: BingoGame) => {
    history.push(`/game/${game._id}`);
  };

  const defaultClick = async () => {
    console.log(game.instance)
    if (game.instance) {
      openGame(game);
    }
    else {
      try {
        instanceDialogState.setShow(true);
        const newInstanceDialogState: InstanceDialogState = { show: instanceDialogState.show, setShow: instanceDialogState.setShow, title: game.title, _id: game._id }
        setInstanceDialogState(newInstanceDialogState);
      } catch (e) {
        console.log("Error in GameList BingoPreviewCard", e);
      }
    }
  }

  return (
    <Card onClick={onClick ?? defaultClick}>
      <CardTitle>{game.title}</CardTitle>
    </Card>
  );
};
