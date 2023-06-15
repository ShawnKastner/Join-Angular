import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
})
export class LogoutDialogComponent {
  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LogoutDialogComponent>
  ) {}

  logout() {
    this.dialogRef.close();
    this.authService.SignOut();
  }
}
