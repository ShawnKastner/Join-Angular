import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  displayName!: string;

  constructor() {}

  ngOnInit(): void {
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {
    let user = localStorage.getItem('user');
    if (user) {
      let userObj = JSON.parse(user);
      this.displayName = userObj.displayName;
    } 
  }
}
