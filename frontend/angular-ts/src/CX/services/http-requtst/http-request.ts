import { Observable } from 'rxjs';

export abstract class HttpRequest {
  constructor() {}
  abstract get(url: string): Observable<any>;

  abstract post(url: string): Observable<any>;

  abstract put(url: string): Observable<any>;

  abstract delete(url: string): Observable<any>;

  abstract authGet(url: string): Observable<any>;

  abstract authPost(url: string): Observable<any>;

  abstract authPut(url: string): Observable<any>;

  abstract authDelete(url: string): Observable<any>;
}
