import { MockedProvider } from '@apollo/client/testing';
import { BingoCard } from '../components/bingo/BingoCard';
import TestRenderer from 'react-test-renderer';

import {BingoInstanceField} from '@bingo/models'
import { useBingoCard } from '../hooks';



const mocks = []; // We'll fill this in next

const card = useBingoCard();

it('renders without error', () => {


  const fields : BingoInstanceField[] = [];


  

  const component = TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
        <BingoCard  {...card} onWin={()=>{}} ></BingoCard>
    </MockedProvider>,
  );

  const tree = component.toJSON();
});


