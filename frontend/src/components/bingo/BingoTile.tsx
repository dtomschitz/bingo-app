import { BingoField } from "@bingo/models";
import "../../styling/bingo/BingoField.scss";

interface BingoFieldProps {
  tile: number;
  field: BingoField;
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
      {field.text}
    </div>
  );
};

export default BingoTile;
