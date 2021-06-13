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
  INVALID_GAME = 'INVALID_GAME',
  GAME_INSTANCE_NOT_FOUND = 'GAME_INSTANCE_NOT_FOUND',
  GAME_INSTANCE_ALREADY_CREATED = 'GAME_INSTANCE_ALREADY_CREATED',
  GAME_CONTAINS_TOO_FEW_FIELDS = 'GAME_CONTAINS_TOO_FEW_FIELDS',
}

export const errorMessages: { [key in ErrorType]: string } = {
  UNAUTHORIZED: 'Keine Berechtigung!',
  UNKNONW_USER: 'Es konnte kein Nutzer gefunden werden!',
  MISSING_JWT_TOKEN_SECRET: 'Es wurde kein JWT Secret hinterlegt!',
  INCORRECT_REQUEST: 'Die Anfrage ist nicht korrekt!',
  INCORRECT_PASSWORD: 'Das Passwort ist nicht korrekt!',
  INVALID_PASSWORD_FORMAT:
    'Your password needs a minimum of eight characters, at least one letter, one number and a special character!',
  INVALID_EMAIL_FORMAT: 'Die angegebene E-Mail ist nicht korrekt!',
  USER_ALREADY_EXISTS: 'Es exsistiert kein Nutzer mit dieser E-Mail!',
  USER_DOES_NOT_EXIST: 'Es exsistiert kein Nutzer mit dieser ID!',
  USER_CREATION_FAILED: 'Der Nutzer konnte nicht erstellt werden!',
  INVALID_SERIALIZED_JWT_TOKEN: 'The serialization of the jwt is invalid',
  GAME_NOT_FOUND: 'Das Spiel konnte nicht gefunden werden!',
  INVALID_GAME: 'Das Spiel erfüllt nicht die nötigen Kriterien!',
  GAME_INSTANCE_NOT_FOUND: 'Es konnte keine Spielinstanz gefunden werden!',
  GAME_INSTANCE_ALREADY_CREATED:
    'Es kann nur eine Spielinstanz pro Spieler geben!',
  GAME_CONTAINS_TOO_FEW_FIELDS: 'Das erstellte Spiel hat zu wenig Felder!',
};

export const getErrorMessage = (type: ErrorType | keyof typeof ErrorType) => {
  return errorMessages[typeof type === 'string' ? ErrorType[type] : type];
};
