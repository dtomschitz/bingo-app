import React from 'react';
import { render } from '@testing-library/react';
import {BingoPodium} from '../components/bingo/BingoPodium';
import { Podium } from '@bingo/models';

it('renders BingoPodium', () => {
  const podium: Podium[] = [
    {
      userId: '123',
      name: 'third place',
      placement: 3,
    },
    {
      userId: '123',
      name: 'second place',
      placement: 2,
    },
    {
      userId: '123',
      name: 'first place',
      placement: 1,
    },
  ];

  const component = render(<BingoPodium podium={podium} />);

  expect(component).toBeTruthy();

  const winners = component.baseElement.textContent;

  expect(winners).toContain('🥇first place');
  expect(winners).toContain('🥈second place');
  expect(winners).toContain('🥉third place');
});
