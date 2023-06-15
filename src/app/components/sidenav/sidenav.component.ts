import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  constructor(
    public authService: AuthService,
    public dialog: MatDialog
  ) {}

  openLogoutDialog(): void {
		this.dialog.open(LogoutDialogComponent, {
			width: '130px',
			position: { top: '89px', right: '0px' },
		});
	}
}
