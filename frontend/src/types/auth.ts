export type LoginCredentials = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AccessTokenPayload = {
  sub: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  exp: number;
};
