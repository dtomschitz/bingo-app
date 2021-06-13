import { useEffect, useReducer } from 'react';
import { BingoInstanceField } from '@bingo/models';

interface BingoCardProps {
  fields?: BingoInstanceField[];
  onWin?: () => void;
}

interface BingoFieldProps {
  field: BingoInstanceField;
  tile: number;
  winningPattern: number;
  onClick: () => void;
}

interface State {
  fields: BingoInstanceField[];
  score: number;
  hasWon: boolean;
}

type Action =
  | {
      type: 'updateBingoField';
      update: {
        id: string;
        tile: number;
        changes: Partial<BingoInstanceField>;
      };
    }
  | { type: 'updateState'; update: Partial<State> };

const reducer = (state: State, action: Action): State => {
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

const findWinningPattern = (score: number) => {
  return winPatterns.find(pattern => (pattern & score) === pattern) || 0;
};

export const BingoCard = ({ fields, onWin }: BingoCardProps) => {
  const initialState: State = {
    fields,
    score: 0,
    hasWon: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (findWinningPattern(state.score) !== 0) {
      onWin();
    }
  }, [onWin, state]);

  const onBingoTileClick = (tile: number, field: BingoInstanceField) => {
    dispatch({
      type: 'updateBingoField',
      update: {
        id: field._id,
        tile,
        changes: {
          selected: !field.selected,
        },
      },
    });
  };

  return (
    <div className="bingo-card">
      {state.fields?.map((field, index) => (
        <BingoTile
          key={field._id}
          field={field}
          tile={25 - index}
          winningPattern={findWinningPattern(state.score)}
          onClick={() => onBingoTileClick(25 - index, field)}
        />
      ))}
    </div>
  );
};

const BingoTile = ({
  tile,
  field,
  onClick,
  winningPattern,
}: BingoFieldProps) => {
  const isWin = !!(winningPattern & (1 << tile));
  const classes = `bingo-field
    ${field.selected ? 'selected' : ''}
    ${isWin ? 'win' : ''}`;

  return (
    <div className={classes} onClick={onClick}>
      <span className="text">{field.text}</span>
    </div>
  );
};
