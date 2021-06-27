import React from 'react';
import { render } from '@testing-library/react';
import BingoPodium from '../components/bingo/BingoPodium';
import { Podium } from '@bingo/models';

it('renders no BingoPodium if podium is empty | placment = null/undefinded/NaN', () => {
  const podium: Podium[] = [
    {
      userId: '',
      name: '',
      placement: null,
    },
    {
      userId: '',
      name: '',
      placement: undefined,
    },
    {
      userId: '',
      name: '',
      placement: NaN,
    },
  ];

  const component = render(<BingoPodium podium={podium} />);
  expect(component).toMatchObject({});
});

it('BingoPodium does not contain winners/text if podium is empty', () => {
  const podium: Podium[] = [
    {
      userId: '',
      name: '',
      placement: 1,
    },
    {
      userId: '',
      name: '',
      placement: 2,
    },
    {
      userId: '',
      name: '',
      placement: 3,
    }
  ];

  const component = render(<BingoPodium podium={podium}/>);
  
  const winners = component.baseElement.textContent;

  expect(winners).not.toContain('🥇 first place');
  expect(winners).not.toContain('🥈 second place');
  expect(winners).not.toContain('🥉 third place');

});

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

  expect(winners).toContain('🥇 first place');
  expect(winners).toContain('🥈 second place');
  expect(winners).toContain('🥉 third place');
});