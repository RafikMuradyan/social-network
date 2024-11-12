export interface ILoginResponse {
  success: boolean;
  accessToken: string;
}

export interface ITokenPayload {
  id: number;
  name: string;
  username: string;
}

export interface IUserData {
  id: number;
  username: string;
  name: string;
}
