import { BingoField, BingoGrid } from "@bingo/models";
import { useReducer } from "react";
import "../../styling/bingo/BingoCard.scss";
import BingoTile from "./BingoTile";

type Action = {
  type: "updateBingoField";
  update: { row: number; column: number; changes: Partial<BingoField> };
};

interface State {
  grid: BingoGrid;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "updateBingoField":
      const { row, column, changes } = action.update;
      const grid = state.grid;
      grid[row][column] = { ...grid[row][column], ...changes };

      return {
        ...state,
        grid,
      };
  }
};

const transformToGrid = (fields: BingoField[]): BingoGrid => {
  const grid: BingoGrid = [];
  for (let i = 0, k = -1; i < fields.length; i++) {
    if (i % 5 === 0) {
      k++;
      grid[k] = [];
    }

    grid[k].push(fields[i]);
  }

  return grid;
};

const BingoCard = ({ fields }: { fields: BingoField[] }) => {
  const initialState: State = { grid: transformToGrid(fields) };
  const [state, dispatch] = useReducer(reducer, initialState);

  const onStateChange = (row: number, column: number, field: BingoField) => {
    dispatch({
      type: "updateBingoField",
      update: {
        row,
        column,
        changes: {
          isSelected: !field.isSelected,
        },
      },
    });
  };

  return (
    <div className="bingo-card">
      {state.grid.map((row, i) => (
        <div className="bingo-card-row">
          {row.map((field, j) => (
            <BingoTile
              key={field.id}
              field={field}
              onClick={() => onStateChange(i, j, field)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BingoCard;
