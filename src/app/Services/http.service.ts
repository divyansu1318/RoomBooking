import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = 'http://localhost:3000/'

  constructor(private http: HttpClient) { }

  get(url:string) {
    return this.http.get(this.url + url);
  }

  post(url:string,payload:any) {
    return this.http.post(this.url + url,payload);
  }
  
}
