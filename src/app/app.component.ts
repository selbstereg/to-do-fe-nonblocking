import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly faBars = faBars;
  sideNavOpened = false;

  openSideNav() {
    this.sideNavOpened = true;
  }
}
