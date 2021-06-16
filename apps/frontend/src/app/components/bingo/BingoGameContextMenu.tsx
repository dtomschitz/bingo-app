import { GamePhase } from '@bingo/models';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuDivider, MenuItem } from '@szhsin/react-menu';
import { MouseEvent } from 'react';
import { IconButton } from '../common';

interface BingoGameContextMenuProps {
  gamePhase: GamePhase;
  onModifyTitle: () => void;
  onModifyFields: () => void;
  onDeleteGame: () => void;
  onOpenGame: () => void;
  onCloseGame: () => void;
}

export const BingoGameContextMenu = ({
  gamePhase,
  onModifyTitle,
  onModifyFields,
  onDeleteGame,
  onOpenGame,
  onCloseGame,
}: BingoGameContextMenuProps) => {
  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div onClick={stopPropagation}>
      <Menu
        menuButton={<IconButton onClick={stopPropagation} icon={faEllipsisV} />}
      >
        <MenuItem onClick={onModifyTitle}>Titel bearbeiten</MenuItem>
        <MenuItem onClick={onModifyFields}>Felder bearbeiten</MenuItem>
        <MenuDivider />
        {gamePhase === 'EDITING' && (
          <MenuItem onClick={onOpenGame}>Spiel eröffnen</MenuItem>
        )}

        {gamePhase !== 'FINISHED' && gamePhase !== 'EDITING' && (
          <MenuItem onClick={onCloseGame}>Spiel Abschließen</MenuItem>
        )}
        <MenuItem onClick={onDeleteGame}>Spiel Löschen</MenuItem>
      </Menu>
    </div>
  );
};
