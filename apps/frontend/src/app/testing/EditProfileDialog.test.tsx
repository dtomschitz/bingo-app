import React from 'react';
import { render } from '@testing-library/react';
import { BingoCard } from '../components/bingo/BingoCard';
import { BingoCardState, BingoInstanceField } from '@bingo/models';
import { CreateGameDialog } from '../dialogs';
import { EditProfileDialog } from '../dialogs/EditProfileDialog';
import { FlatButton } from '../components/common';
import { act } from 'react-dom/test-utils';

import { Enzyme, shallow } from 'enzyme';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

describe('EditProfileDialog', () => {
  it('renders EditProfileDialog component without error', async () => {
    const open = () => {};

    const close = () => {};
    await act(async () => {
      const editProfileDialog = render(
        <EditProfileDialog
          show={false}
          fullscreen={false}
          data={undefined}
          open={open}
          close={close}
        />,
      );

      expect(editProfileDialog).toBeTruthy();


      console.log(document.children[0].children[0].textContent);

    

    });
  });
});
