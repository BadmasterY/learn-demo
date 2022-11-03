import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'angular-route-cache';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  /**
   * jump to index
   */
  toIndex() {
    this.router.navigate(['/index'], {
      relativeTo: this.activatedRoute,
    });
  }
  /**
   * jump to login
   */
  toLogin() {
    this.router.navigate(['/login'], {
      relativeTo: this.activatedRoute,
    });
  }
}
