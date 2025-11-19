import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Games} from '../interfaces/games';
import {Filters} from '../interfaces/filters';



@Injectable({
  providedIn: 'root'
})
export class GamesServices {
  private apiUrl = 'http://localhost:3000/api/igdb';

  constructor(private http: HttpClient) {
  }



  searchGames(search: string, filters: Filters, page: number = 1, limit: number = 10): Observable<Games[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('limit', limit.toString())
      .set('page', page)
      .set('filters', JSON.stringify(filters));
    return this.http.get<Games[]>(`${this.apiUrl}/getAllGames`, {params});
  }

  getGameById(id: number): Observable<Games[]> {
    return this.http.get<Games[]>(`${this.apiUrl}/getGameById/${id}`);
  }
}
