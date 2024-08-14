import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => this.authService.getUserRole(user!.uid)),
      map(user => user && user.role === 'admin'),
      tap(isAdmin => {
        if (!isAdmin) {
          console.log('access denied');
          this.router.navigate(['/']);
        }
      })
    );
  }
}
