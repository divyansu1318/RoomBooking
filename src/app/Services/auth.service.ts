import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(private http: HttpClient) {
  
  }

  //generate random token 
  getToken() {
    return localStorage.getItem('token');
  }
}
