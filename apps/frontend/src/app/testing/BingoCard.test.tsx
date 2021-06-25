import React from 'react';
import { BingoCard } from '../components/bingo/BingoCard';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});
it('renders BingoCard component without error', ()=> {

  function testOnWin() {
    return null;
  };

  function testFindWinningPattern() {
    return 65011712;
  };

  function testOnBingoFieldSelected() {
    return null;
  }

  const onButtonClickMock = jest.fn();

  const bingocardtest = shallow(<BingoCard fields={[]} score={0} onWin={ testOnWin } findWinningPattern={testFindWinningPattern} onBingoFieldSelected={testOnBingoFieldSelected} hasWon={false}/>);
  expect(bingocardtest).toBeTruthy();
  //const buttonElement = bingocardtest.find('.bingo-field');
  //buttonElement.simulate('click');

  //expect(onButtonClickMock).toHaveBeenCalledTimes(1);
  //expect(onButtonClickMock).toHaveBeenCalledWith(true);
});

