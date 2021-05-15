import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PreviewPetitionComponent } from './preview-petition/preview-petition.component';
import { PetitionComponent } from './petition/petition.component';

import {RouterModule, Routes} from '@angular/router';
import { LastPetitionComponent } from './last-petition/last-petition.component';
import {PetitionService} from '../services/petition.service';
import { HomeComponent } from './home/home.component';
import { UserConnexionComponent } from './user-connexion/user-connexion.component';

import {
  GoogleLoginProvider,
  FacebookLoginProvider, SocialLoginModule, SocialAuthServiceConfig
} from 'angularx-social-login';
import {AuthenticatorService} from '../services/authenticator.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { NewPetitionComponent } from './new-petition/new-petition.component';
import {ReactiveFormsModule} from '@angular/forms';


const appRoutes: Routes = [
  { path: 'petition/:id',  component: PetitionComponent },
  { path: 'connection',  component: UserConnexionComponent },
  { path: 'new-petition',  component: NewPetitionComponent },
  { path: '',  component: HomeComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PreviewPetitionComponent,
    PetitionComponent,
    LastPetitionComponent,
    HomeComponent,
    UserConnexionComponent,
    NewPetitionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    SocialLoginModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  providers: [
    PetitionService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '872392969523-in5sir0l4md25uv570creil2d1th3ks7.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('515535872793422')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    AuthenticatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
