import { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faEllipsisV,
  faLock,
  faLockOpen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuDivider, MenuItem } from '@szhsin/react-menu';
import { GamePhase } from '@bingo/models';
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
        {gamePhase === GamePhase.EDITING && (
          <MenuItem onClick={onOpenGame}>
            <FontAwesomeIcon icon={faLockOpen} />
            Spiel eröffnen
          </MenuItem>
        )}
        {gamePhase !== GamePhase.FINISHED && gamePhase !== GamePhase.EDITING && (
          <MenuItem onClick={onCloseGame}>
            <FontAwesomeIcon icon={faLock} />
            Spiel abschließen
          </MenuItem>
        )}
        <MenuItem onClick={onDeleteGame}>
          <FontAwesomeIcon icon={faTrash} />
          Spiel löschen
        </MenuItem>
      </Menu>
    </div>
  );
};
