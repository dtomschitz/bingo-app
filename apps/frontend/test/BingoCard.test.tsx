import { render } from '@testing-library/react';
import { BingoCard } from '../src/app/components/bingo';

it('renders BingoCard component without error', () => {
  function testOnWin() {
    return null;
  }

  function testFindWinningPattern() {
    return 65011712;
  }

  function testOnBingoFieldSelected() {
    return null;
  }

  const onButtonClickMock = jest.fn();

  const bingocardtest = render(
    <BingoCard
      fields={[]}
      score={0}
      onWin={testOnWin}
      findWinningPattern={testFindWinningPattern}
      onBingoFieldSelected={testOnBingoFieldSelected}
      hasWon={false}
    />,
  );
  expect(bingocardtest).toBeTruthy();
  //const buttonElement = bingocardtest.find('.bingo-field');
  //buttonElement.simulate('click');

  //expect(onButtonClickMock).toHaveBeenCalledTimes(1);
  //expect(onButtonClickMock).toHaveBeenCalledWith(true);
});
