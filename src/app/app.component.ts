import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NamedEntity } from './to-do-list/model/named-entity.model';
import { HttpClient } from '@angular/common/http';
import { TO_DO_LISTS_ENDPOINT_URL } from './common/constants';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly faBars = faBars;
  private sideNavOpened = false;
  private selectedToDoList: NamedEntity = null;
  
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient.get(TO_DO_LISTS_ENDPOINT_URL).pipe(
      take(1)
    ).subscribe((body: NamedEntity[]) => this.selectedToDoList = body[0]);
  }

  openSideNav() {
    this.sideNavOpened = true;
  }

  closeSideNav() {
    this.sideNavOpened = false;
  }

  onSelectToDoList(toDoList: NamedEntity) {
    this.closeSideNav();
    this.selectedToDoList = toDoList;
  }
}
