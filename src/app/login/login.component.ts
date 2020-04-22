import { Auth0Service } from './../auth0.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public auth0: Auth0Service) { }

  ngOnInit(): void {
    this.auth0.show();
  }

  ngOnDestroy(): void {
    this.auth0.hide();
  }
}
