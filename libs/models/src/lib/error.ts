export enum ErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNONW_USER = 'UNKNONW_USER',
  MISSING_JWT_TOKEN_SECRET = 'MISSING_JWT_TOKEN_SECRET',
  INCORRECT_REQUEST = 'INCORRECT_REQUEST',
  INVALID_PASSWORD_FORMAT = 'INVALID_PASSWORD_FORMAT',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
}

export const errorMessages: { [key in ErrorType]: string } = {
  UNAUTHORIZED: 'The request requires user authentication!',
  UNKNONW_USER: 'Failed to find a user for the given parameters!',
  MISSING_JWT_TOKEN_SECRET: 'The jwt token secret is missing!',
  INCORRECT_REQUEST: 'Your request has the wrong format!',
  INVALID_PASSWORD_FORMAT:
    'Your password needs a minimum of eight characters, at least one letter, one number and a special character!',
  INVALID_EMAIL_FORMAT: 'The given email has the wrong format!',
};

export const getErrorMessage = (type: ErrorType) => {
  return errorMessages[type];
};
