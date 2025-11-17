import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Game {
  id: number;
  name: string;
  genres: any[];
  involved_companies: any[];
  platforms: any[];
  screenshots: any[];
  videos: any[];
  summary?: string;
  storyline?: string;
  rating?: number;
  first_release_date?: number;
  cover?: { url: string };
}

@Injectable({
  providedIn: 'root'
})
export class GamesServices {
  private apiUrl = 'http://localhost:3000/api/igdb';

  constructor(private http: HttpClient) {
  }



  searchGames(search: string, filters: {
    genres?: number[];
    platforms?: number[];
    minRating?: number;
    maxRating?: number;
    sortBy?: string,
    sortOrder?: string,
    year?: number;
  }, page: number = 1, limit: number = 10): Observable<Game[]> {
    let params = new HttpParams()
      .set('search', search)
      .set('limit', limit.toString())
      .set('page', page)
      .set('filters', JSON.stringify(filters));
    return this.http.get<Game[]>(`${this.apiUrl}/getAllGames`, {params});
  }

  getGameById(id: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/getGameById/${id}`);
  }
}
