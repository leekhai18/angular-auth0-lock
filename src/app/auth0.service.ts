import { Injectable } from '@angular/core';
import Auth0Lock from 'auth0-lock';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {

  option = {
    auth: {
      params: {
        scope: 'openid profile email'
      },
      autoParseHash: false, // currently have an issue on listen onauthenticated event, set false and call resumeAuth instead
      redirect: true,
      redirectUrl: 'http://localhost:4200/callback',
      responseType: 'token id_token',
      sso: true,
    },
    // rememberLastLogin: true,
    closable: false,
    autoclose: true,
    allowSignUp: false, // just only affect on client-side, should use Disable Sign Ups option in the dashboard, in the connection settings.
    allowShowPassword: true,
    allowAutocomplete: true,
    allowPasswordAutocomplete: true,
    allowedConnections: ['Username-Password-Authentication'],
    // defaultDatabaseConnection: '', // specifies the database connection that will be used when there is more than one available.
    languageDictionary: {
      title: 'SIGN IN',
      emailInputPlaceholder: 'Email',
      passwordInputPlaceholder: 'Password',
      blankErrorHint: 'Please enter...',
      forgotPasswordAction: 'Forgot your password?',
      loginSubmitLabel: 'SIGN IN',
      too_many_attempts: 'After 5 failed sign in, your account will be blocked for 10 minutes.'
    },
    theme: {
      logo: 'assets/logo.png',
      primaryColor: '#374761',
      // labeledSubmitButton: false,
    },
    avatar: null
    // avatar: {
    //   url: (email, cb) => {
    //     // Obtain the avatar url for the email input by the user, Lock
    //     // will preload the image before displaying it.
    //     // Note that in case of an error you call cb with the error in
    //     // the first arg instead of `null`.
    //     // var url = obtainAvatarUrl(email);
    //     console.log(email);
    //     console.log(cb);
    //     const url = 'https://cdn.auth0.com/blog/mazda-logo-32.png';
    //     cb(null, url);
    //   },
    //   displayName: (email, cb) => {
    //     // Obtain the display name for the email input by the user.
    //     // Note that in case of an error you call cb with the error in
    //     // the first arg instead of `null`.
    //     // var displayName = obtainDisplayName(email);
    //     const displayName = 'Lee K';
    //     cb(null, displayName);
    //   }
    // }
  };

  lock = new Auth0Lock(
    'vWAfBLxvjM4igifllFtj5nzRWYW0D267',
    'rs-pcs.au.auth0.com',
    this.option
  );

  constructor(
    private router: Router,
    public jwtHelper: JwtHelperService
  ) {
    this.lock.on('authenticated', (authResult: any) => {
      console.log('On authenticated');
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }
        localStorage.setItem('token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.router.navigate(['/']);
      });
    });
  }

  resume(hash: string) {
    this.lock.resumeAuth(hash, (error, authResult) => {
      if (error) {
        alert('Could not parse hash');
      }
    });
  }

  show() {
    this.lock.show();
  }

  hide() {
    this.lock.hide();
  }

  signUp() {
    this.lock.show({
      allowSignUp: true,
      allowLogin: false
    });
  }

  signOut() {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    this.lock.logout({ returnTo: 'http://localhost:4200' });
  }

  isAuthenticated() {
    // TODO: handle when token expired
    // Need a loggedIn flag to manage logged state
    // When loggedIn is false we have to remove token from storage, and must log in again
    // when token is expired we should call checkSession to renewToken
    return this.jwtHelper.isTokenExpired();
  }


  // Inactivity timeout (3d) | Require log in after (30d)
  // Should use for guard
  checkSession() {
    console.log('On checkSession');
    this.lock.checkSession({}, (error, authResult) => {
      if (error || !authResult) {
        this.router.navigateByUrl('/signin');
      } else {
        this.lock.getUserInfo(authResult.accessToken, (err, profile) => {
          localStorage.setItem('token', authResult.idToken);
          localStorage.setItem('profile', JSON.stringify(profile));
        });
      }
    });
  }
}
