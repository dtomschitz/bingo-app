import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { EditAccountDialog } from '../src/app/dialogs';

describe('EditAccountDialog', () => {
  it('renders EditAccountDialog component without error', async () => {
    const open = () => {
      //
    };

    const close = () => {
      //
    };

    await act(async () => {
      const editAccountDialog = render(
        <EditAccountDialog
          show={false}
          fullscreen={false}
          data={undefined}
          open={open}
          close={close}
        />,
      );

      expect(editAccountDialog).toBeTruthy();

      console.log(document.children[0].children[0].textContent);
    });
  });
});
