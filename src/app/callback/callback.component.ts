import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth0Service } from '../auth0.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit, OnDestroy {

  constructor(private auth0: Auth0Service) { }

  ngOnInit(): void {
    console.log('On callback page');
    this.auth0.resume(window.location.hash);
  }

  ngOnDestroy(): void {
    this.auth0.hide();
  }

}
