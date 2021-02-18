import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRouteSnapshot, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, map, last, first } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnChanges {

  constructor(
    private router: Router
  ) {
    console.log(2);
    // @ts-ignore
    this.router.events
      .pipe(
        // filter(event => event instanceof NavigationEnd  ),
        // first(),
      )
      .subscribe(event => {
        console.log(event);
      });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(1);
  }

}
