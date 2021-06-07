import { gql } from '@apollo/client';

export const USER_LOGIN = gql`
  mutation UserLogin($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        name
        email
      }
      accessToken
      refreshToken
    }
  }
`;

export const USER_LOGOUT = gql`
  mutation UserLogout($email: String!) {
    logoutUser(email: $email) {
      success
    }
  }
`;

export const REGISTER_USER = gql`
  mutation UserRegister($name: String!, $email: String!, $password: String!) {
    registerUser(props: { name: $name, email: $email, password: $password }) {
      user {
        name
        email
      }
      accessToken
      refreshToken
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($refreshToken: String!) {
    verifyUser(refreshToken: $refreshToken) {
      name
      email
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken)
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($title: String!, $fields: [String!]!) {
    createGame(props: { title: $title, fields: $fields }) {
      _id
      title
      phase
      fields {
        _id
        text
      }
    }
  }
`;

export const CREATE_GAME_INSTANCE = gql`
  mutation CreateGameInstance($id: ID!) {
    createGameInstance(_id: $id) {
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
