import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  uid!: string;
  photoURL!: string;
  userData$!: Observable<any>;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
      } else {
        this.userData = null;
      }
    });
    this.getPhotoURL();
  }

  getUserData(): User | null {
    return this.userData;
  }

  getCurrentUserUid(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (user && user.uid) {
          resolve(user.uid);
        } else {
          resolve(null);
        }
      }, reject);
    });
  }

  guestLogin() {
    return this.afAuth
      .signInAnonymously()
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.onAuthStateChanged((user) => {
          if (user) {
            this.router.navigateByUrl('/sidenav/(main:summary)');
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigateByUrl('/sidenav/(main:summary)');
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, displayName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          // set display name of user
          result.user.updateProfile({ displayName: displayName }).then(() => {
            this.SetUserData(result.user);
            this.router.navigate(['/']);
          });
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Reset Forgot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
    });
  }

  //get user photoURL from Firestore
  getPhotoURL() {
    this.afAuth.user.subscribe((user) => {
      if (user) {
        const userDoc: AngularFirestoreDocument<any> = this.afs
          .collection('users')
          .doc(user.uid);
        this.userData$ = userDoc.valueChanges();
        this.userData$.subscribe((userData) => {
          if (userData) {
            this.uid = user.uid;
            this.photoURL = userData['photoURL'];
          } else {
            console.log('User data not found in Firestore');
          }
        });
      }
    });
  }
}