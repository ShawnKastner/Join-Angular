import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
})
export class LogoutDialogComponent implements OnInit {
  uid!: string;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
    private router: Router,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    if (this.authService.userData) {
      this.uid = this.authService.userData.uid;
    }
  }

  logout() {
    this.dialogRef.close();
    this.authService.SignOut();
  }

  openHelp() {
    this.dialogRef.close();
    this.router.navigateByUrl('/sidenav/(main:help)');
  }

  openLegalNotice() {
    this.dialogRef.close();
    this.router.navigateByUrl('/sidenav/(main:legalNotice)');
  }

  uploadProfileImg(event: Event, uid: string) {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;

    if (file) {
      const filePath = `profileImages/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // get notified when the download URL is available
      task
        .snapshotChanges()
        .pipe(
          finalize(() =>
            fileRef.getDownloadURL().subscribe((url) => {
              // Update the user's photoURL in Firestore
              this.firestore
                .collection('users')
                .doc(uid)
                .update({
                  photoURL: url,
                })
                .then(() => {
                  console.log(`URL ${url} saved to Firestore for user ${uid}`);
                })
                .catch((error: any) => {
                  console.error(`Error saving URL to Firestore: ${error}`);
                });
            })
          )
        )
        .subscribe();
    }
  }
}
