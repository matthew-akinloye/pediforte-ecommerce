import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    // this.user$ = this.afAuth.authState.pipe(
    //   map(user => user ? this.db.collection('users').doc(user.uid).valueChanges() : null)
    // );
    this.user$ = this.afAuth.authState;
  }

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.db.collection('users').doc(result.user!.uid).set({
        email,
        role: 'user',
        firstName,
        lastName
      });
      this.router.navigate(['/user']);
    } catch (error) {
      console.error('Error signing up: ', error);
    }
  }

  getUserRole(uid: string): Observable<any> {
    return this.db.collection('users').doc(uid).valueChanges();
  }

  async signIn(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/user']);
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/signin']);
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => user && user.role === 'admin')
    );
  }
}
