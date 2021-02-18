import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SuperMapGisService {

  constructor(
    private http: HttpClient
  ) { }

  getZhengZhouData(): Observable<any> {
    return this.http.get('../../../assets/json/zhengzhou.json');
  }
}
