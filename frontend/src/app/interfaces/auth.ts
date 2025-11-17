export interface Auth {
}

export interface LoginForm{
  email: string,
  password: string,
}
export interface Token{
  access_token:string,
  type: string
}

export interface ChangePassword{
  password: string;
  repeatPassword: string;
}
