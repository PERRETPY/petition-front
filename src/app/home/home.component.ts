import { Component, OnInit } from '@angular/core';
import {PetitionService} from '../../services/petition.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  test: string;
  testSubscription: Subscription;

  constructor(private petitionService: PetitionService) { }

  ngOnInit(): void {
    this.testSubscription = this.petitionService.testSubject.subscribe(
      (test: any) => {
        console.log(test);
        this.test = test;
      }
    );
    this.petitionService.emitTop100Petition();
    this.petitionService.petitionSigned();
  }

  testFunction(): void {
  }

}
