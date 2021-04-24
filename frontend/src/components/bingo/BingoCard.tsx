import { BingoField, BingoGrid } from "@bingo/models";
import { useReducer } from "react";
import "../../styling/bingo/BingoCard.scss";
import BingoTile from "./BingoTile";

type Action = {
  type: "updateBingoField";
  update: { id: string; changes: Partial<BingoField> };
};

interface State {
  fields: BingoField[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "updateBingoField":
      const { id, changes } = action.update;

      return {
        ...state.fields,
        fields: state.fields.map((field) => {
          return field.id === id ? { ...field, ...changes } : field;
        }),
      };
  }
};

const BingoCard = ({ fields }: { fields: BingoField[] }) => {
  const initialState: State = { fields };
  const [state, dispatch] = useReducer(reducer, initialState);

  const transformToGrid = (fields: BingoField[]): BingoGrid => {
    const grid: BingoGrid = [];
    for (let i = 0, k = -1; i < fields.length; i++) {
      if (i % 5 === 0) {
        k++;
        grid[k] = [];
      }

      grid[k].push({
        ...fields[i],
        row: k,
        column: i,
      });
    }

    return grid;
  };

  const onStateChange = (field: BingoField) => {
    dispatch({
      type: "updateBingoField",
      update: {
        id: field.id,
        changes: {
          isSelected: !field.isSelected,
        },
      },
    });
  };

  return (
    <div className="bingo-card">
      {transformToGrid(state.fields).map((row) => (
        <div className="bingo-card-row">
          {row.map((field) => (
            <BingoTile
              key={field.id}
              field={field}
              onClick={() => onStateChange(field)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BingoCard;
