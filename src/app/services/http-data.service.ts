import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Movie } from '../models/movie.model';

import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpDataService {
  base_Url = 'http://localhost:3000/movies';
  
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    )
  };

  handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.log(`ERROR OCURRED ${error.status}, BODY WAS: ${error.error}`);
    }
    else {//Alt + 96 → ` `
      console.log(`BACKEND RETURNED COD ${error.status}, BODY WAS: ${error.error}`);
    }
    return throwError (
      'SOMETHING HAPPEND WITH REQUEST, TRY AGAIN.'
    );
  }

  getList(): Observable<Movie> {
    return this.http
      .get<Movie>(this.base_Url)
      .pipe(retry(2), catchError(this.handleError));
  }

  getItem(id: string): Observable<Movie> {
    return this.http
      .get<Movie>(this.base_Url + '/' + id)
      .pipe(retry(2), catchError(this.handleError));
  }
  
  updateItem(id: string, item: Movie): Observable<Movie> {
    return this.http
      .put<Movie>(this.base_Url + '/' + id, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  createItem(item: any): Observable<Movie> {
    return this.http
      .post<Movie>(this.base_Url, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteItem(id: string): Observable<Movie> {
    return this.http
      .delete<Movie>(this.base_Url + '/' + id, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));  
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http
      .post<Movie>(this.base_Url, JSON.stringify(movie), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // private url = '../src/assets/db.json';
  // agregarPelicula(pelicula: Movie) {
  //   return this.http.post(this.url, pelicula);
  // }
}
