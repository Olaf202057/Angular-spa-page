import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string;

  // tslint:disable-next-line: variable-name
  constructor(private readonly _http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  private _formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this._http
      .get(`${this.baseUrl}${path}`, {
        params,
        observe: 'response',
      })
      .pipe(retry(1), catchError(this._formatErrors));
  }
  put(path: string, body): Observable<any> {
    return this._http
      .put(`${this.baseUrl}${path}`, JSON.stringify(body))
      .pipe(catchError(this._formatErrors));
  }

  // tslint:disable-next-line: ban-types
  post(path: string, body: Object = {}): Observable<any> {
    return this._http
      .post(`${this.baseUrl}${path}`, JSON.stringify(body), {
        observe: 'response',
      })
      .pipe(catchError(this._formatErrors));
  }

  delete(path): Observable<any> {
    return this._http
      .delete(`${this.baseUrl}${path}`)
      .pipe(catchError(this._formatErrors));
  }
}
