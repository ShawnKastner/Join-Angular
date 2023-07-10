import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  @ViewChild('userEmail', { static: true })
  userEmailElement!: ElementRef<HTMLInputElement>;
  @ViewChild('userPassword', { static: true })
  userPasswordElement!: ElementRef<HTMLInputElement>;

  hide = true;
  rememberMe!: boolean;

  constructor(
    public authService: AuthService,
    private afAuth: AngularFireAuth,
  ) {
    afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  ngOnInit() {
    this.checkRememberedCredentials();
  }

  toggleRememberMe() {
    if (this.rememberMe) {
      const userEmail = this.userEmailElement.nativeElement.value;
      const userPassword = this.userPasswordElement.nativeElement.value;

      if (userEmail) {
        // Überprüfung, ob die E-Mail-Adresse angegeben wurde
        const encodedPassword = btoa(userPassword);

        localStorage.setItem('rememberedEmail', userEmail);
        localStorage.setItem('rememberedPassword', encodedPassword);

        this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      }
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');

      this.afAuth
        .setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(() => {
          return this.afAuth.signOut();
        })
        .catch((error) => {
          console.log('Error removing remembered credentials:', error);
        });
    }
  }

  checkRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const encodedPassword = localStorage.getItem('rememberedPassword');

    if (rememberedEmail && encodedPassword) {
      this.rememberMe = true;
      this.userEmailElement.nativeElement.value = rememberedEmail;

      const decodedPassword = atob(encodedPassword);

      this.userPasswordElement.nativeElement.value = decodedPassword;
    }
  }
}
