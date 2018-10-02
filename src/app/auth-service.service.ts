import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private loginUrl = 'https://django-rest-jwt-zkkmin.c9users.io/api-token-auth/';
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<User>  {
    console.log('called');
    const username = email;
    return this.http.post<User>(this.loginUrl, {username , password}, httpOptions)
      .pipe(
      tap((authResult) => this.setSession(authResult)),
      catchError(this.handleError<User>('login'))
    );  
  }

  private setSession(authResult) {
    const expireAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expireAt.valueOf()));

  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expireAt = JSON.parse(expiration);
    return moment(expireAt);
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(result);
      return of(error as T);
    };
  }

}
