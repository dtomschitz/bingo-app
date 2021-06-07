import { gql } from '@apollo/client';

export const GET_GAMES = gql`
  query GetGames {
    games {
      _id
      title
      phase
      hasInstance
    }
  }
`;

export const GET_GAME_INSTANCE = gql`
  query GetGameInstance($id: ID!) {
    instance(_id: $id) {
      _id
      authorId
      title
      fields {
        _id
        text
      }
      hasInstance
    }
  }
`;
