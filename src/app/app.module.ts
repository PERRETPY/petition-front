import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PreviewPetitionComponent } from './preview-petition/preview-petition.component';
import { PetitionComponent } from './petition/petition.component';
import { UserComponent } from './user/user.component';

import {RouterModule, Routes} from '@angular/router';
import { LastPetitionComponent } from './last-petition/last-petition.component';
import {PetitionService} from '../services/petition.service';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'petition/:id',  component: PetitionComponent },
  { path: 'user',  component: UserComponent },
  { path: '',  component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PreviewPetitionComponent,
    PetitionComponent,
    UserComponent,
    LastPetitionComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    PetitionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
