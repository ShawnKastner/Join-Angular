import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
})
export class LogoutDialogComponent {
  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
    private router: Router
  ) {}

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
}
