import { BingoGame } from '@bingo/models';
import { Card, CardTitle } from '../common/Card';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface BingoPreviewCardProps {
  key: string;
  game: BingoGame;
  onClick?: () => void;
}

const GET_INSTANCE = gql`
query GetInstance($id: ID!){
  instance(_id: $id){
    _id,
    name
  }
}
`

const CREATE_INSTANCE = gql`
mutation CreateInstance($id: ID!){
  createInstance(_id: $id)
}
`

export const BingoPreviewCard = ({ game, onClick }: BingoPreviewCardProps) => {
  const history = useHistory();
  const [isRefetching, setIsRefetching] = useState(false);
  const { error, loading, data, refetch } = useQuery(GET_INSTANCE, {
    variables: {
      id: game._id,
    }
  });
  const [createInstance] = useMutation(CREATE_INSTANCE);

  const openGame = (game: BingoGame) => {
    history.push(`/game/${game._id}`);
  };

  const defaultClick = async () => {
    if (data) {
      console.log("TODO: load instance");
      openGame(game);
    }
    else {
      try {
        console.log("TODO: ask user if he want to enter");
        const newInstance = await createInstance({
          variables: {
            id: game._id,
          }
        })
      } catch (e) {
        setIsRefetching(true);
        await refetch();
      }
    }
  }

  useEffect(() => {
    if (isRefetching) {
      console.log("TODO: load instance");
      setIsRefetching(false);
      openGame(game);
    }
  }, [data])

  return (
    <Card onClick={onClick ?? defaultClick}>
      <CardTitle>{game.title}</CardTitle>
    </Card>
  );
};
