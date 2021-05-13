export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type CreateUserProps = Omit<User, '_id'>;

export interface UpdateUserProps extends Partial<Omit<User, '_id'>> {
  accessToken?: string;
  refreshToken?: string;
}

export interface JwtPayload {
  _id: string;
  email: string;
}

export interface JwtSignOptions {
  secret: string | undefined;
  expiration: number;
}

export interface AuthContext {
  user: User;
  login?: (props: LoginProps) => Promise<boolean>;
  register?: (props: RegisterProps) => Promise<boolean>;
  logout?: () => Promise<boolean>;
  verify?: () => Promise<boolean>;
  isPending: boolean;
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResult {
  success: boolean;
}

export interface RefreshAccessTokenResult {
  accessToken: string;
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

export interface RefreshAccessTokenProps {
  email: string;
  refreshToken: string;
}
