import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'RF-Web-Application';
  isLoggedIn$: Observable<boolean>;
  isAuthPage = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.isAuthPage = e.urlAfterRedirects.startsWith('/auth');
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }
}
