import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  constructor(public authService: AuthService, public dialog: MatDialog) {}

  openLogoutDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['position-dialog'];

    if (window.innerWidth <= 1000) {
      dialogConfig.position = { top: '79px', right: '0px' };
    } else {
      dialogConfig.position = { top: '89px', right: '0px' };
    }
    this.dialog.open(LogoutDialogComponent, {
      width: '150px',
      ...dialogConfig,
      position: dialogConfig.position,
    });
  }
}
