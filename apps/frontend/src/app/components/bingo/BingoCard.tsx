import { useEffect, useReducer } from 'react';
import { BingoField } from '@bingo/models';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

interface BingoCardProps {
  fields?: BingoField[];
  onWin?: () => void;
}

interface BingoFieldProps {
  field: BingoField;
  tile: number;
  winningPattern: number;
  onClick: () => void;
}

interface State {
  fields: BingoField[];
  score: number;
  hasWon: boolean;
}

type Action =
  | {
    type: 'updateBingoField';
    update: { id: string; tile: number; changes: Partial<BingoField> };
  }
  | { type: 'updateState'; update: Partial<State> }
  | { type: 'loadBingoField'; update: Partial<any> };

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
    case 'loadBingoField':
      return { fields: action.update?.instance?.map((field) => { return { _id: field._id, text: field.name } }), score: 0, hasWon: false };
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

const GET_INSTANCE = gql`
query GetInstance($id: ID!){
  instance(_id: $id){
    _id,
    name
  }
}
`

export const BingoCard = ({ fields, onWin }: BingoCardProps) => {
  const { id } = useParams();
  const { error, loading, data, refetch } = useQuery(GET_INSTANCE, {
    variables: {
      id: id,
    }
  });

  const initialState: State = { fields: fields ?? data?.instance?.map((field) => { return { _id: field._id, text: field.name } }), score: 0, hasWon: false };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (findWinningPattern(state.score) !== 0) {
      onWin!();
    }
  }, [onWin, state]);

  const onBingoTileClick = (tile: number, field: BingoField) => {
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

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'loadBingoField',
        update: data
      })
    }
  }, [data])

  return (
    <>
      <BingoCardHeader />
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
    </>
  );
};

const BingoCardHeader = () => {
  return (
    <div className="bingo-card-header">
      <div className="letter">B</div>
      <div className="letter">I</div>
      <div className="letter">N</div>
      <div className="letter">G</div>
      <div className="letter">O</div>
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
    ${field.isSelected ? 'selected' : ''}
    ${isWin ? 'win' : ''}`;

  return (
    <div className={classes} onClick={onClick}>
      <span className="text">{field.text}</span>
    </div>
  );
};
