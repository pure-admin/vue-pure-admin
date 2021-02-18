import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { NgForage } from 'ngforage';
import { HttpRequest } from './http-request';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService extends HttpRequest{

  constructor(
    private http: HttpClient,
    private ngforage: NgForage
  ) {
    super();
  }

  get(url: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
  post(url: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
  put(url: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
  delete(url: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  authDelete(url: string): Observable<any> {
    return undefined;
  }

  authGet(url: string): Observable<any> {
    return undefined;
  }

  authPost(url: string): Observable<any> {
    return undefined;
  }

  authPut(url: string): Observable<any> {
    return undefined;
  }
}
