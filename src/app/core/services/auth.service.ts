import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ERROR_MESSAGE } from 'src/app/enums/error-message.enum';
import { ISign } from 'src/app/interface/credenciais.interface';
import { IToken } from 'src/app/interface/token.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = environment.url;

  constructor(private http: HttpClient, private router: Router) {}

  public sign(payload: ISign ): Observable<any> {
    return this.http.post<IToken>(`${this.url}/sign`, payload).pipe(
      map((res) => {
        
        localStorage.setItem('acess_token', res.token);
        return this.router.navigate(['admin']);
      }),
      catchError((e) => {
        if (e.error.message) return throwError(() => e.error.message);
        return throwError(() => ERROR_MESSAGE.ERROR_SIGN);
      })
    );
  }

  public logout() {
    localStorage.removeItem('acess_token');
    return this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('acess_token');

    if (!token) {
      return false;
    }

    const jwtHelper = new JwtHelperService();
    return !jwtHelper.isTokenExpired(token);
  }
}
