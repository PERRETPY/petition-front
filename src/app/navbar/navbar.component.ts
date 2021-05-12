import { Component, OnInit } from '@angular/core';
import {SocialAuthService, SocialUser} from 'angularx-social-login';
import {Subscription} from 'rxjs';
import {AuthenticatorService} from '../../services/authenticator.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  user: SocialUser;
  userSubscription: Subscription;


  constructor(private authenticatorService: AuthenticatorService) { }

  ngOnInit(): void {
    this.userSubscription = this.authenticatorService.userSubject.subscribe(
      (user: any) => {
        this.user = user;
      }
    );
    this.authenticatorService.emitUserSubject();
  }


  printUser(): void {
    if (this.user != null) {
      console.log(this.user);
    }else {
      console.log('Not connected');
    }
  }

}
