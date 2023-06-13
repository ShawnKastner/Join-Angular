import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-join';

  constructor(public router: Router) {}

  isHidden(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/' || currentUrl === '/register' || currentUrl === '/forgotPassword';
  }
}
