export enum ErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNONW_USER = 'UNKNONW_USER',
  MISSING_JWT_TOKEN_SECRET = 'MISSING_JWT_TOKEN_SECRET',
  INCORRECT_REQUEST = 'INCORRECT_REQUEST',
  INVALID_PASSWORD_FORMAT = 'INVALID_PASSWORD_FORMAT',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST',
  USER_CREATION_FAILED = 'USER_CREATION_FAILED',
  INVALID_SERIALIZED_JWT_TOKEN = 'INVALID_SERIALIZED_JWT_TOKEN',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  GAME_INSTANCE_NOT_FOUND = 'GAME_INSTANCE_NOT_FOUND',
  GAME_INSTANCE_ALREADY_CREATED = 'GAME_INSTANCE_ALREADY_CREATED',
  GAME_CONTAINS_TOO_FEW_FIELDS = 'GAME_CONTAINS_TOO_FEW_FIELDS',
}

export const errorMessages: { [key in ErrorType]: string } = {
  UNAUTHORIZED: 'The request requires user authentication!',
  UNKNONW_USER: 'Failed to find a user for the given parameters!',
  MISSING_JWT_TOKEN_SECRET: 'The jwt token secret is missing!',
  INCORRECT_REQUEST: 'Your request has the wrong format!',
  INCORRECT_PASSWORD: 'The given password is not correct!',
  INVALID_PASSWORD_FORMAT:
    'Your password needs a minimum of eight characters, at least one letter, one number and a special character!',
  INVALID_EMAIL_FORMAT: 'The given email has the wrong format!',
  USER_ALREADY_EXISTS: 'There is already a user registered with this email!',
  USER_DOES_NOT_EXIST: 'The given user is not registered!',
  USER_CREATION_FAILED: 'Failed to create the new user!',
  INVALID_SERIALIZED_JWT_TOKEN: 'The serialization of the jwt is invalid',
  GAME_NOT_FOUND: 'There is no active game with this id',
  GAME_INSTANCE_NOT_FOUND:
    'There is no Instance with the specified id for this user',
  GAME_INSTANCE_ALREADY_CREATED: 'There is only one instance allowed per user',
  GAME_CONTAINS_TOO_FEW_FIELDS:
    'Your request contains either too many or to few bingo fields',
};

export const getErrorMessage = (type: ErrorType | keyof typeof ErrorType) => {
  return errorMessages[typeof type === 'string' ? ErrorType[type] : type];
};
