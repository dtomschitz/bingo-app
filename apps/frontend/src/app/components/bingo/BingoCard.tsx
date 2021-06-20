import { useEffect } from 'react';
import { BingoCardState, BingoInstanceField } from '@bingo/models';

interface BingoCardProps extends BingoCardState {
  onWin: () => void;
  findWinningPattern: (score: number) => number;
  onBingoFieldSelected: (tile: number, field: BingoInstanceField) => void;
}

interface BingoListProps {
  field: BingoInstanceField;
  tile: number;
}

interface BingoFieldProps {
  field: BingoInstanceField;
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
          tile={25 - index}
          winningPattern={findWinningPattern(score)}
          onClick={() => onBingoFieldSelected(25 - index, field)}
        />
      ))}     
      <div className="bingo-list">
        {fields?.map((field, index) => (
          <BingoList
            field={field}
            tile={25 - index}
          />
        ))}
      </div> 
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
      <span className="text">
        {field.text}
      </span>
      <span className="bingo-fieldlist-id">
        {tile}
      </span>
    </div>
  );
};

const BingoList = ({
  tile,
  field,
}: BingoListProps) => {
  return (
    <div className="bingo-fieldlist">
      <span className="bingo-fieldlist-item"> {tile} = {field.text} </span>
    </div>
  )
}