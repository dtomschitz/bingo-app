import { BingoField } from "../../../../lib/models/bingo/BingoField";
import { useEffect, useReducer } from "react";
import { BingoCardHeader } from "./BingoCardHeader";

type Action =
  | {
      type: "updateBingoField";
      update: { id: string; tile: number; changes: Partial<BingoField> };
    }
  | { type: "updateState"; update: Partial<State> };

interface State {
  fields: BingoField[];
  score: number;
  hasWon: boolean;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "updateBingoField":
      const { id, changes } = action.update;

      return {
        ...state,
        fields: state.fields.map((field) => {
          return field.id === id ? { ...field, ...changes } : field;
        }),
        score: state.score ^ (1 << action.update.tile),
      };

    case "updateState":
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
  return winPatterns.find((pattern) => (pattern & score) === pattern) || 0;
};

interface BingoCardProps {
  fields: BingoField[];
  createModeEnabled: boolean;
  onWin?: () => void;
}

export const BingoCard = ({ fields, onWin }: BingoCardProps) => {
  const initialState: State = { fields, score: 0, hasWon: false };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (findWinningPattern(state.score) !== 0) {
      onWin!();
    }
  }, [onWin, state]);

  const onBingoTileClick = (tile: number, field: BingoField) => {
    dispatch({
      type: "updateBingoField",
      update: {
        id: field.id,
        tile,
        changes: {
          isSelected: !field.isSelected,
        },
      },
    });
  };

  return (
    <>
      <BingoCardHeader />
      <div className="bingo-card">
        {state.fields.map((field, index) => (
          <BingoTile
            key={field.id}
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

interface BingoFieldProps {
  field: BingoField;
  tile: number;
  winningPattern: number;
  onClick: () => void;
}

const BingoTile = ({
  tile,
  field,
  onClick,
  winningPattern,
}: BingoFieldProps) => {
  const isWin = !!(winningPattern & (1 << tile));
  const classes = `bingo-field 
    ${field.isSelected ? "selected" : ""} 
    ${isWin ? "win" : ""}`;

  return (
    <div className={classes} onClick={onClick}>
      <span className="text">{field.text}</span>
    </div>
  );
};
