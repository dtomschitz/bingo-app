import { BingoGame, GamePhase } from '@bingo/models';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Badge, Card, CardHeader, CardTitle, FlexSpacer } from '../common';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  menu: ReactNode;
  onClick: () => void;
}

const stateMessages: { [key in GamePhase]: string } = {
  EDITING: 'In Bearbeitung',
  OPEN: 'Lobby',
  PLAYING: 'Im Spiel',
  FINISHED: 'Spiel beendet',
};

export const BingoPreviewCard = ({
  game,
  menu,
  onClick,
}: BingoPreviewCardProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
  const className = classNames('info', game.phase.toLowerCase(), {
    mobile: isMobile,
  });
  const message = stateMessages[game.phase];

  return (
    <Card onClick={onClick}>
      <CardHeader>
        <div className="mobile-header">
          <CardTitle>{game.title}</CardTitle>
          <div className="subtitle">
            {isMobile && <Badge className={className} text={message} />}
            <FlexSpacer />
          </div>
        </div>
        {!isMobile && <Badge className={className} text={message} />}
        {menu}
      </CardHeader>
    </Card>
  );
};
