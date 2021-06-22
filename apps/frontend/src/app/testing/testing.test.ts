import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import BingoPodium from '../components/bingo/BingoPodium';

test('Link changes the class when hovered', () => {
    const component = renderer.create(
      /*<BingoPodium> </BingoPodium>*/
    );
  });

it("renders component xy without error", ()=> {
    
    const component = renderer.create(<MockedProvider> <BingoPodium></BingoPodium></MockedProvider>);

    const tree = component.toJSON();

})