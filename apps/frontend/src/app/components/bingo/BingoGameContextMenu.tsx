import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuDivider, MenuItem } from '@szhsin/react-menu';
import { MouseEvent } from 'react';
import { IconButton } from '../common';

interface BingoGameContextMenuProps {
  onModifyFields: () => void;
  onDeleteGame: () => void;
}

export const BingoGameContextMenu = ({
  onModifyFields,
  onDeleteGame,
}: BingoGameContextMenuProps) => {
  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div onClick={stopPropagation}>
      <Menu
        menuButton={<IconButton onClick={stopPropagation} icon={faEllipsisV} />}
      >
        <MenuItem onClick={onModifyFields}>Felder bearbeiten</MenuItem>
        <MenuDivider />
        <MenuItem onClick={onDeleteGame}>Spiel beenden</MenuItem>
      </Menu>
    </div>
  );
};
