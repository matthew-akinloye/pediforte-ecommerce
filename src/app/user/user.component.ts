import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user$!: Observable<any>;

  constructor(private authService: AuthService, private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.collection('users').doc(user.uid).valueChanges();
        } else {
          return [];
        }
      })
    );
  }

  signOut() {
    this.authService.signOut();
  }
}
