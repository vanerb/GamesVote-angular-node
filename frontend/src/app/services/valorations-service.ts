import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Game} from './games-services';
import {AuthService} from './auth-service';
import {Valoration} from '../interfaces/valoration';

@Injectable({
  providedIn: 'root'
})
export class ValorationsService {
  url = 'http://localhost:3000/api/valoration';

  constructor(private http: HttpClient, private readonly authService: AuthService) { }

  getAll(){
    return this.http.get<Valoration[]>(this.url+'/')
  }

  getAllByGameId(id: string){
    return this.http.get<Valoration[]>(this.url+'/getAllValorationsByGameId/'+id)
  }

  getMyValorationsByGameId(gameId: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<Valoration[]>(this.url+'/getMyValorationsByGameId/'+gameId, {headers});
  }

  //getValorationByIdAndByGameId

  getValorationByIdAndByGameId(id: string, gameId: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<Valoration>(this.url+'/getValorationByIdAndByGameId/'+id+"/"+gameId, {headers});
  }


  create(data: FormData){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.post<Valoration>(`${this.url}/`, data, {headers});
  }

  delete(id: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete<Valoration>(`${this.url}/${id}`, {headers});
  }


  update(id: string | null,data: FormData){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
    return this.http.put<Valoration>(`${this.url}/${id}`, data, {headers});
  }
}
