import { gql } from '@apollo/client';

export const GET_GAMES = gql`
  query GetGames {
    games {
      _id
      authorId
      title
      fields {
        _id
        text
        checked
      }
      podium {
        name,
        placement
      }
      phase
      hasInstance
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(_id: $id) {
      _id
      title
      phase
      podium {
        name,
        placement
      }
      fields {
        _id
        text
        checked
      }
    }
  }
`;

export const VALIDATE_WIN = gql`
  query ValidateWin($id: ID!, $fieldIds: [String!]!) {
    validateWin(props: {_id: $id, fieldIds: $fieldIds})
  }
`;

export const GET_GAME_INSTANCE = gql`
  query GetGameInstance($id: ID!) {
    instance(_id: $id) {
      _id
      authorId
      title
      phase
      fields {
        _id
        text
        checked
      }
      instanceFields {
        _id
        text
        selected
      }
      hasInstance
      podium {
        name,
        placement
      }
    }
  }
`;
