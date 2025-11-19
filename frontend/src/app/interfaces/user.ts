import {Images} from './images';

export interface User {
  id: number,
  name: string,
  cognames: string,
  tlf: string,
  email: string,
  password: string,
  typ: string,
  token: string,
  createdAt:string,
  updatedAt: string,
  Images: Images[]
}
