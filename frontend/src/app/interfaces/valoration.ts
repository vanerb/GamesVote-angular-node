import {Images} from './images';
import {Games} from './games';

export interface Valoration {
  "id": string,
  "description":string,
  "value": string,
  "gameId": string,
  "createdAt": string,
  "updatedAt":string,
  "userId": number,
  game?: Games,
  "User": {
    "email": string,
    "Images": Images[]
  },
  "Images": Images[]
}

export interface CreateValoration{
  description: string;
  value: number;
  gameId: string | null;
}

export interface UpdateValoration{
  id: string | null;
  description: string;
  value: number;
  gameId: string  | null;
}

export interface DeleteValoration{
  id: string;
}
