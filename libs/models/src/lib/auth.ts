export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type Player = Pick<User, '_id' | 'name'>;

export interface JwtPayload {
  _id: string;
  email: string;
}

export interface JwtSignOptions {
  secret: string;
  expiration: number;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshAccessTokenResult {
  accessToken: string;
}

export type CreateUserProps = Omit<User, '_id'>;

export interface UpdateUserProps extends Partial<Omit<User, '_id'>> {
  accessToken?: string;
  refreshToken?: string;
}


export interface LoginProps {
  email: string;
  password: string;
}

export interface LogoutProps {
  email: string;
}

export interface RegisterProps extends LoginProps {
  name: string;
}



export interface EditUserProps extends LoginProps{
  newName: string;
  newEmail: string;
  newPassword: string;
}


export interface RefreshAccessTokenProps {
  refreshToken: string;
}
