import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _router: Router) {
  }
  canActivate() {
    if (localStorage.getItem('token')) {
      return true;
    }
    this._router.navigate(['auth/login']);
    return false;
  }
}