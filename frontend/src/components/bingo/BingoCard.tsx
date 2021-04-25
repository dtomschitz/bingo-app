import { BingoField } from "@bingo/models";
import { useEffect, useReducer } from "react";
import "../../styling/bingo/BingoCard.scss";
import BingoTile from "./BingoTile";

type Action =
  | {
      type: "updateBingoField";
      update: { id: string; changes: Partial<BingoField> };
    }
  | {
      type: "updateState";
      changes: Partial<State>;
    };

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
      };

    case "updateState":
      return {
        ...state,
        ...action.changes,
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
  onWin: () => void;
}

const BingoCard = ({ fields, onWin }: BingoCardProps) => {
  const initialState: State = { fields, score: 0, hasWon: false };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (findWinningPattern(state.score) !== 0) {
      onWin();
    }
  }, [onWin, state]);

  const onBingoTileClick = (tile: number, field: BingoField) => {
    dispatch({
      type: "updateBingoField",
      update: {
        id: field.id,
        changes: {
          isSelected: !field.isSelected,
        },
      },
    });

    dispatch({
      type: "updateState",
      changes: {
        score: state.score ^ (1 << tile),
      },
    });
  };

  return (
    <div className="bingo-card">
      <div className="bingo-header">B</div>
      <div className="bingo-header">I</div>
      <div className="bingo-header">N</div>
      <div className="bingo-header">G</div>
      <div className="bingo-header">O</div>
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
  );
};

export default BingoCard;
