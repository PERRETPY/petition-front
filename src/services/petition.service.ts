import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Petition} from '../models/petition.model';
import {Injectable} from '@angular/core';

@Injectable()
export class PetitionService {
  baseUrl = 'http://' + environment.server + '/_ah/api/petitionEndpoint/v1';

  top100Petition: Petition[];

  currentPetition: Petition;

  petitionTop100Subject = new Subject<Petition[]>();
  currentPetitionSubject = new Subject<Petition>();

  constructor(private httpClient: HttpClient) { }

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
