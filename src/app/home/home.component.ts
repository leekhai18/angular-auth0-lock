import { Component, OnInit } from '@angular/core';
import { Auth0Service } from './../auth0.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public auth0: Auth0Service,
    public router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.auth0.isAuthenticated());
  }

  signin() {
    this.router.navigateByUrl('/signin');
  }

}
