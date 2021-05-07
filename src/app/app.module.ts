import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LastPetitionsComponent } from './last-petitions/last-petitions.component';
import { PreviewPetitionComponent } from './preview-petition/preview-petition.component';
import { PetitionComponent } from './petition/petition.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LastPetitionsComponent,
    PreviewPetitionComponent,
    PetitionComponent,
    UserComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
