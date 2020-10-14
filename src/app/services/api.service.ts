import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class ApiService {

    private profileData = new BehaviorSubject('');
    sendProfileData = this.profileData.asObservable();
    
    selectedIndex : any = 0;
  url:string='rating/staff_review/';
  imageUrl = "http://18.216.120.11:8080"; //image url
    httpClient: any;
    constructor(
        private http: HttpClient
    ) { }
    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${environment.api_url}${path}`, { params: params })
            .pipe(catchError(this.formatErrors));
    }
    put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(
            `${environment.api_url}${path}`,
            JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
    }
    patch(path: string, body: Object = {}): Observable<any> {
        return this.http.patch(
            `${environment.api_url}${path}`,
            JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
    }
    post(path: string, body: Object = {}): Observable<any> {
        return this.http.post(
            `${environment.api_url}${path}`,
            JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
    }
    delete(path): Observable<any> {
        return this.http.delete(
            `${environment.api_url}${path}`
        ).pipe(catchError(this.formatErrors));
    }
    private formatErrors(error: any) {
        return throwError(error.error);
    }


    getdata(_id) {
        return this.http.get(`${environment.api_url}${this.url}${_id}`)
            .pipe(catchError(this.formatErrors));

    }

    postImage(path: string, body: any): Observable<any> {
        return this.http.post(
            `${environment.api_url}${path}`,
            body
        ).pipe(catchError(this.formatErrors));
    }

    setProfile(data: string) {
        this.profileData.next(data)
      }

}

