import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  displayName!: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
   this.displayName = this.authService.getUserData()?.displayName;
  }
}
