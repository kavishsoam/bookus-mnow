import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public cachedRequests: Array<HttpRequest<any>> = [];
  public token: any = localStorage.getItem('token');
  constructor(public http: HttpClient) {
  }
  public getToken(): string {
    
    //if(this.token)
    //return this.token;
    //else
    return localStorage.getItem('token');
  }
}
