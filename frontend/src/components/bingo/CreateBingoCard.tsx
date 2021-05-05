import { CreateBingoField } from '../../../../lib/models/bingo/BingoField';

interface BingoCardProps {
  fields: CreateBingoField[];
  onCreateBingoField: () => void;
}

interface BingoTileProps {
  field: CreateBingoField;
}

interface CreateBingoTileProps {
  onClick: () => void;
}

export const CreateBingoCard = ({
  fields,
  onCreateBingoField,
}: BingoCardProps) => {
  return (
    <>
      <div className="bingo-card">
        {fields.map(field => (
          <BingoTile field={field} />
        ))}
        {<CreateBingoTile onClick={onCreateBingoField} />}
      </div>
    </>
  );
};

const BingoTile = ({ field }: BingoTileProps) => {
  return <div className="bingo-field">{field.text}</div>;
};

const CreateBingoTile = ({ onClick }: CreateBingoTileProps) => {
  return (
    <div className="bingo-field create" onClick={onClick}>
      <img
        className="icon"
        alt="Create"
        src={'https://fonts.gstatic.com/s/i/materialicons/add/v13/24px.svg'}
      />
    </div>
  );
};
