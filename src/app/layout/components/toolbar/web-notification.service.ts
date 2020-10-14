import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BF5CV16Dz5rWlt1ihENsBhahDSpl-xz-wdNRbXkiC9-ASq7_iuodaAMCJBaXaJN0ttruRpODQQwn2LX10caojjU';
  constructor(private http: HttpClient,
              private swPush: SwPush) {}
  subscribeToNotification() {
    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => this.sendToServer(sub))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }
  sendToServer(params: any) {
    let Userid = localStorage.getItem('id'); 
    let baseUrl = `${environment.api_url}subscription/${Userid}`;
    this.http.post(baseUrl,params).subscribe();
  }
  
}