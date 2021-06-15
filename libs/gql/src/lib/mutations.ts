import { gql } from '@apollo/client';

export const USER_LOGIN = gql`
  mutation UserLogin($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        _id
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
        _id
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
      _id
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
        checked
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
        checked
      }
      instanceFields {
        _id
        text
        selected
      }
      hasInstance
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($update: UpdateGame!) {
    updateGame(props: $update) {
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



export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(_id: $id)
  }
`;

export const MUTATE_FIELD = gql`
  mutation MutateField($id: ID!, $mutation: MutateField!) {
    mutateField(props: { _id: $id, mutation: $mutation })
  }
`;

export const UPDATE_TITLE = gql`
  mutation Title($id: ID!, $title: String!) {
    title(_id: $id, title: $title) {
      title
    }
  }
`;
