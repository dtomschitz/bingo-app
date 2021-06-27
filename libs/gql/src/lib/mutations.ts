export const USER_LOGIN = `
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

export const USER_LOGOUT = `
  mutation UserLogout($email: String!) {
    logoutUser(email: $email)
  }
`;

export const REGISTER_USER = `
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

export const VERIFY_USER = `
  mutation VerifyUser($refreshToken: String!) {
    verifyUser(refreshToken: $refreshToken) {
      _id
      name
      email
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = `
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken)
  }
`;

export const CREATE_GAME = `
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

export const CREATE_GAME_INSTANCE = `
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

export const UPDATE_GAME = `
  mutation UpdateGame($update: UpdateGame!) {
    updateGame(props: $update) {
      _id
      authorId
      title
      phase
      fields {
        _id
        text
      }
      hasInstance
    }
  }
`;

export const UPDATE_USER = `
  mutation UpdateUser($update: UpdateUser!) {
    updateUser(props: $update) {
      _id
      name
      email
    }
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(_id: $id)
  }
`;

export const DELETE_GAME = `
  mutation DeleteGame($id: ID!) {
    deleteGame(_id: $id)
  }
`;

export const MUTATE_FIELD = `
  mutation MutateField($id: ID!, $mutation: MutateField!) {
    mutateField(props: { _id: $id, mutation: $mutation })
  }
`;
