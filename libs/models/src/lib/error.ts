export enum ErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNONW_USER = 'UNKNONW_USER',
  MISSING_JWT_TOKEN_SECRET = 'MISSING_JWT_TOKEN_SECRET',
}

export const errorMessages: { [key in ErrorType]: string } = {
  UNAUTHORIZED: 'The request requires user authentication!',
  UNKNONW_USER: 'Failed to find a user for the given parameters!',
  MISSING_JWT_TOKEN_SECRET: 'The jwt token secret is missing!',
};

export const getErrorMessage = (type: ErrorType) => {
  return errorMessages[type];
};
