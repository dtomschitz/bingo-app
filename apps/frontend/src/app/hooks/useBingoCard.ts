import { BingoCardState, BingoField } from '@bingo/models';
import { useReducer } from 'react';

type Action =
  | {
      type: 'updateBingoField';
      update: { id: string; tile: number; changes: Partial<BingoField> };
    }
  | { type: 'updateState'; update: Partial<BingoCardState> };

const reducer = (state: BingoCardState, action: Action): BingoCardState => {
  switch (action.type) {
    case 'updateBingoField':
      return {
        ...state,
        fields: state.fields.map(field => {
          return field._id === action.update.id
            ? { ...field, ...action.update.changes }
            : field;
        }),
        score: state.score ^ (1 << action.update.tile),
      };

    case 'updateState':
      return {
        ...state,
        ...action.update,
      };
  }
};

const winPatterns = [
  65011712,
  2031616,
  63488,
  1984,
  62,
  34636832,
  17318416,
  8659208,
  4329604,
  2164802,
  34087042,
  2236960,
];

export const useBingoCard = () => {
  const [state, dispatch] = useReducer(reducer, {
    fields: [],
    score: 0,
    hasWon: false,
  });

  const setInitialFields = (fields: BingoField[]) => {
    dispatch({
      type: 'updateState',
      update: {
        fields,
      },
    });
  };

  const onBingoFieldSelected = (tile: number, field: BingoField) => {
    dispatch({
      type: 'updateBingoField',
      update: {
        id: field._id,
        tile,
        changes: {
          isSelected: !field.isSelected,
        },
      },
    });
  };

  const findWinningPattern = (score: number) => {
    return winPatterns.find(pattern => (pattern & score) === pattern) || 0;
  };

  return {
    ...state,
    setInitialFields,
    findWinningPattern,
    onBingoFieldSelected,
  };
};
