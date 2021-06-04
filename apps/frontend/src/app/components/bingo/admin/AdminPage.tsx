import { useQuery } from '@apollo/client'
import { GET_GAME } from '@bingo/gql';
import { BingoGame } from '@bingo/models';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import AdminPlaying from './AdminPlaying';
import AdminRegister from './AdminRegister';

interface pathParams {
  gameId: string;
}

const AdminPage = () => {
  const params: pathParams = useParams();

  const [isRegister, setIsRegister] = useState<boolean>(true);

  const { loading, error, data } = useQuery<{ game: BingoGame }>(GET_GAME, {
    variables: { id: params?.gameId },
  });

  if (loading) {
    return (
      <div>loading</div>
    )
  }

  if (error) {
    return (
      <div>Error in request.</div>
    )
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {isRegister ? <AdminRegister game={data.game} setIsRegister={setIsRegister} /> : <AdminPlaying />}
    </div>
  )
}

export default AdminPage
