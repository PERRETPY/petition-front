import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Petition} from '../models/petition.model';
import {Injectable} from '@angular/core';
import {SocialUser} from 'angularx-social-login';
import {AuthenticatorService} from './authenticator.service';
import {SignaturesModel} from '../models/signatures.model';
import {newArray} from '@angular/compiler/src/util';

@Injectable()
export class PetitionService {
  baseUrl = 'http://' + environment.server + '/_ah/api/petitionEndpoint/v1';

  top100Petition: Petition[];
  nextToken: string;
  petitionTop100Subject = new Subject<Petition[]>();

  currentPetition: Petition;
  currentPetitionSubject = new Subject<Petition>();

  constructor(private httpClient: HttpClient, private authenticatorService: AuthenticatorService) { }

  emitTop100Petition(): void {
    const petitions = this.top100Petition;
    this.petitionTop100Subject.next(petitions);
  }

  getTop100(): void {
    console.log('Hello from getTop100');
    this.httpClient
      .get<any>(this.baseUrl + '/top100')
      .subscribe(
        (response) => {
          this.top100Petition = response.items;
          console.log('response.nextPageToken = ' + response.nextPageToken);
          this.nextToken = response.nextPageToken;
          this.emitTop100Petition();
          console.log('Chargement réussi !');
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );

  }

  getNextTop100(): void {
    console.log('Hello from getNextTop100');
    if (this.nextToken != null){
      this.httpClient
        .get<any>(this.baseUrl + '/top100?next=' + this.nextToken)
        .subscribe(
          (response) => {
            console.log(response.items);
            if (response.items !== undefined) {
              this.top100Petition = this.top100Petition.concat(response.items);
              this.nextToken = response.nextPageToken;
              this.emitTop100Petition();
              console.log('Chargement réussi !');
            } else {
              this.nextToken = null;
              console.log('Fin pétition !');
            }

          },
          (error) => {
            console.log('Erreur de chargement : ' + error);
          }
        );
    }
  }


  emitCurrentPetition(): void {
    const petition = this.currentPetition;
    this.currentPetitionSubject.next(petition);
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

  getPetitionSigned(): Petition[] {
    console.log('Hello from getPetitionSigned ! ');
    let petitionSigned: Petition[] = [];
    if (this.authenticatorService.user === null) {
      console.log('You are not connected');
    }else {
      this.authenticatorService.refreshGoogleToken();
      this.httpClient
        .get<any>(this.baseUrl + '/petitionSigned?access_token=' + this.authenticatorService.user.idToken)
        .subscribe(
          (response) => {
            petitionSigned = response;
            console.log('Chargement réussi ! : ');
          },
          (error) => {
            console.log('Erreur de chargement : ' + error);
          }
        );
    }
    return petitionSigned;
  }

  getUserSignedPetition(): SignaturesModel {
    let signaturesResult: SignaturesModel = null;
    this.httpClient
      .get<any>(this.baseUrl + '/signedPetition/?access_token=' + this.authenticatorService.user.idToken)
      .subscribe(
        (response) => {
          signaturesResult = response;
          console.log('Response : ' + response);
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
    return signaturesResult;
  }

  signPetition(petitionKey: string): void{
    if (this.authenticatorService.user != null) {
      this.authenticatorService.refreshGoogleToken();
      let signaturesBloc: SignaturesModel = this.getUserSignedPetition();
      signaturesBloc.signature.push(petitionKey);
      this.httpClient
        .put<any>(this.baseUrl + '/signPetition/?access_token=' + this.authenticatorService.user.idToken, signaturesBloc)
        ;
    }
  }


}
