import { BingoField } from "@bingo/models";
import "../../styling/bingo/BingoField.scss";

interface BingoFieldProps {
  field: BingoField;
  onClick: () => void;
}

const BingoTile = ({ field, onClick }: BingoFieldProps) => {
  return (
    <div
      className={`bingo-field ${field.isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {field.text}
    </div>
  );
};

export default BingoTile;
