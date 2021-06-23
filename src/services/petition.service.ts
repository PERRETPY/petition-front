import {environment} from '../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {Petition} from '../models/petition.model';
import {Injectable} from '@angular/core';
import {SocialUser} from 'angularx-social-login';
import {AuthenticatorService} from './authenticator.service';
import {SignaturesModel} from '../models/signatures.model';
import {newArray} from '@angular/compiler/src/util';
import {PetitionPost} from '../models/petitionPost.model';
import {Router} from '@angular/router';

@Injectable()
export class PetitionService {
  baseUrl = environment.server + '/_ah/api/petitionEndpoint/v1';

  top100Petition: Petition[];
  nextTokenTop100: string;
  petitionTop100Subject = new Subject<Petition[]>();

  searchPetition: Petition[];
  nextTokenSearch: string;
  petitionSearchSubject = new Subject<Petition[]>();

  currentPetition: Petition;
  currentPetitionSubject = new Subject<Petition>();

  signedPetition: Petition[];
  signedPetitionSubject = new Subject<Petition[]>();

  myPetition: Petition[];
  myPetitionSubject = new Subject<Petition[]>();

  constructor(private httpClient: HttpClient,
              private authenticatorService: AuthenticatorService,
              private router: Router) { }

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
          this.nextTokenTop100 = response.nextPageToken;
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
    if (this.nextTokenTop100 != null){
      this.httpClient
        .get<any>(this.baseUrl + '/top100?next=' + this.nextTokenTop100)
        .subscribe(
          (response) => {
            console.log(response.items);
            if (response.items !== undefined) {
              this.top100Petition = this.top100Petition.concat(response.items);
              this.nextTokenTop100 = response.nextPageToken;
              this.emitTop100Petition();
              console.log('Chargement réussi !');
            } else {
              this.nextTokenTop100 = null;
              console.log('Fin pétition !');
            }

          },
          (error) => {
            console.log('Erreur de chargement : ' + error);
          }
        );
    }
  }

  emitSearchPetition(): void {
    const petitions = this.searchPetition;
    this.petitionSearchSubject.next(petitions);
  }

  getSearchResult(query: string): void {
    console.log('Hello from getSearchResult');
    const parametres = new HttpParams().set('query', query);
    console.log(this.baseUrl + '/search?query=' + encodeURI(query));
    this.httpClient
      .get<any>(this.baseUrl + '/search', { params: parametres })

      .subscribe(
        (response) => {
          this.searchPetition = response.items;
          console.log('response.nextPageToken = ' + response.nextPageToken);
          this.nextTokenSearch = response.nextPageToken;
          this.emitSearchPetition();
          console.log('Chargement réussi !');
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
  }

  getNextSearchResult(query: string): void {
    console.log('Hello from getNextSearchResult');
    if (this.nextTokenSearch != null){
      this.httpClient
        .get<any>(this.baseUrl + '/search?query=' + query + '&next=' + this.nextTokenSearch)
        .subscribe(
          (response) => {
            console.log(response.items);
            if (response.items !== undefined) {
              this.searchPetition = this.searchPetition.concat(response.items);
              this.nextTokenSearch = response.nextPageToken;
              this.emitSearchPetition();
              console.log('Chargement réussi !');
            } else {
              this.nextTokenSearch = null;
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

  emitSignedPetition(): void {
    const petition = this.signedPetition;
    this.signedPetitionSubject.next(petition);
  }

  getPetitionSigned(): void {
    this.httpClient
      .get<any>(this.baseUrl + '/petitionSigned?access_token=' + this.authenticatorService.user.idToken)
      .subscribe(
        (response) => {
          this.signedPetition = response.items;
          this.emitSignedPetition();
          console.log(response);
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
  }

  emitMyPetition(): void {
    const petition = this.myPetition;
    this.myPetitionSubject.next(petition);
  }

  getMyPetition(): void {
    console.log('Hello from getMyPetition');
    this.httpClient
      .get<any>(this.baseUrl + '/myPetitions?access_token=' + this.authenticatorService.user.idToken)
      .subscribe(
        (response) => {
          this.myPetition = response.items;
          this.emitMyPetition();
          console.log('MyPetitionResponse' + response);
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
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
      this.httpClient
        .put<Petition>(this.baseUrl + '/signPetition/' + petitionKey + '?access_token=' + this.authenticatorService.getToken(), null)
        .subscribe();
      this.router.navigate(['/petition/' + petitionKey]);
    }else {
      this.router.navigate(['/connection']);
    }
  }

  postPetition(petition: PetitionPost): void {
    let newPetition: Petition = null;
    this.httpClient
      .post<Petition>(this.baseUrl + '/petition?access_token=' + this.authenticatorService.getToken(), JSON.stringify(petition))
      .subscribe(
        (response) => {
          newPetition = response;
          console.log('Response : ' + response);
          return newPetition;
        },
        (error) => {
          console.log('Erreur de chargement : ' + error);
        }
      );
    console.log('Petition from service : ' + JSON.stringify(petition));
  }


}
