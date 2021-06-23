import {Injectable, OnInit} from '@angular/core';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';


@Injectable()
export class AuthenticatorService {

  socialUser: SocialUser;
  user: SocialUser;

  userSubject = new Subject<any>();

  baseUrl = environment.server + '/_ah/api/petitionEndpoint/v1';

  constructor(private httpClient: HttpClient, private authService: SocialAuthService) {
    this.authService.authState.subscribe(user => {
      this.socialUser = user;
    });
    if (localStorage.getItem('auth') === 'undefined' || localStorage.getItem('auth') === null) {
      this.user = null;
    } else {
      this.user = JSON.parse(localStorage.getItem('auth'));
    }
  }

  getToken(): string {
    this.refreshGoogleToken();
    return this.user.idToken;
  }

  signInWithGoogle(): void {
    console.log('Sign In with Google !');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      response => {
        this.saveUser();
        this.newConnection();
      }
    );
  }

  signOut(): void {
    this.authService.signOut();
    this.destroyUser();
  }

  refreshGoogleToken(): Promise<void> {
    return this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID).then(
      response => {
        this.saveUser();
        console.log('TOKEN : ' + this.socialUser.idToken);
      }
    );
  }

  emitUserSubject(): void {

    const userCopy = this.user;
    this.userSubject.next(userCopy);
  }

  saveUser(): void{
    this.user = this.socialUser;
    console.log('saveUser, user : ' + this.user);
    localStorage.setItem('auth', JSON.stringify(this.user));
    this.emitUserSubject();
  }

  destroyUser(): void{
    this.user = null;
    localStorage.removeItem('auth');
  }

  newConnection(): void {
    console.log('Hello from newConnection');
    const url = this.baseUrl + '/newConnection?access_token=' + this.user.idToken;
    console.log(url);
    this.httpClient
      .get<any>(url)
      .subscribe();
  }

}
