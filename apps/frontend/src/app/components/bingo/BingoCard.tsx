import { useEffect } from 'react';
import { BingoCardState, BingoInstanceField } from '@bingo/models';

interface BingoCardProps extends BingoCardState {
  onWin: () => void;
  findWinningPattern: (score: number) => number;
  onBingoFieldSelected: (tile: number, field: BingoInstanceField) => void;
}

interface BingoFieldProps {
  field: BingoInstanceField;
  index: number;
  tile: number;
  winningPattern: number;
  onClick: () => void;
}

export const BingoCard = ({
  fields,
  score,
  onWin,
  findWinningPattern,
  onBingoFieldSelected,
}: BingoCardProps) => {
  useEffect(() => {
    if (findWinningPattern(score) !== 0) {
      onWin.call(this);
    }
  }, [score]);

  return (
    <div className="bingo-card">
      {fields?.map((field, index) => (
        <BingoTile
          key={field._id}
          field={field}
          index={index}
          tile={25 - index}
          winningPattern={findWinningPattern(score)}
          onClick={() => onBingoFieldSelected(25 - index, field)}
        />
      ))}
    </div>
  );
};

const BingoTile = ({
  index,
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
      <span className="id">{index + 1}</span>
    </div>
  );
};
