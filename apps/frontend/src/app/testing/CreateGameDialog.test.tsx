import React from 'react';
import { render } from '@testing-library/react';
import { BingoCard } from '../components/bingo/BingoCard';
import { BingoCardState, BingoInstanceField } from '@bingo/models';
import { CreateGameDialog } from '../dialogs';

it('renders CreateGameDialog component without error', () => {
  const onButtonClickMock = jest.fn();

  const open = () => {};

  const close = () => {};

  const createGameDialog = render(
    <CreateGameDialog
      show={false}
      fullscreen={false}
      data={undefined}
      open={open}
      close={close}
    />,
  );

  expect(createGameDialog).toBeTruthy();
});
