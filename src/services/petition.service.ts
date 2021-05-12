import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Petition} from '../models/petition.model';
import {Injectable} from '@angular/core';
import {SocialUser} from 'angularx-social-login';
import {AuthenticatorService} from './authenticator.service';

@Injectable()
export class PetitionService {
  baseUrl = 'http://' + environment.server + '/_ah/api/petitionEndpoint/v1';

  top100Petition: Petition[];
  currentPetition: Petition;

  test: string;

  petitionTop100Subject = new Subject<Petition[]>();
  currentPetitionSubject = new Subject<Petition>();

  testSubject = new Subject<string>();

  constructor(private httpClient: HttpClient, private authenticatorService: AuthenticatorService) { }

  emitTop100Petition(): void {
    const petitions = this.top100Petition;
    this.petitionTop100Subject.next(petitions);
  }

  getTop100(): void {
    this.httpClient
      .get<any>(this.baseUrl + '/top100')
      .subscribe(
        (response) => {
          this.top100Petition = response.items;
          this.emitTop100Petition();
          console.log('Chargement réussi !');
          console.log(this.top100Petition[0].properties.description);
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
  }

  petitionSigned(): void {
    if (localStorage.getItem('auth') === 'undefined' || localStorage.getItem('auth') === null) {
      console.log('You are not connected');
    }else {
      this.authenticatorService.refreshGoogleToken();
      let user: SocialUser;
      user = JSON.parse(localStorage.getItem('auth'));
      this.httpClient
        .get<any>(this.baseUrl + '/petitionSigned?access_token=' + user.idToken)
        .subscribe(
          (response) => {
            this.test = response;
            this.emitTest();
            console.log('Chargement réussi ! : ' + this.test);
          },
          (error) => {
            console.log('Erreur de chargement : ' + error);
          }
        );
    }
  }

  emitTest(): void {
    let test: string;
    // @ts-ignore
    test = this.test;
    this.testSubject.next(test);
  }


  emitCurrentPetition(): void {
    let currentPetitionCopy: Petition;
    // @ts-ignore
    currentPetitionCopy = this.currentPetition;
    this.currentPetitionSubject.next(currentPetitionCopy);
  }

  getPetitionById(id: string): void {
    this.httpClient
      .get<Petition>(this.baseUrl + '/petition/' + id)
      .subscribe(
        (response) => {
          this.currentPetition = response;
          console.log('Response' + response);
          this.emitCurrentPetition();
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
  }


}
