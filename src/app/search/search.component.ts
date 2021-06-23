import {Component, Input, OnInit} from '@angular/core';
import {PetitionService} from '../../services/petition.service';
import {Subscription} from 'rxjs';
import { NgForm } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchPetition: any[];

  searchSubscription: Subscription;

  query: string;

  noResult: boolean;

  @Input() queryUrl: string;


  constructor(private petitionService: PetitionService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.noResult = false;
    const queryConst = this.route.snapshot.params.query;
    this.queryUrl = queryConst;
    console.log('QUERY : ' + this.queryUrl);
    if (this.queryUrl != null) {
      this.query = this.queryUrl;
      this.getSearchResult();
    }
  }

  getSearchResult(): void{
    this.searchSubscription = this.petitionService.petitionSearchSubject.subscribe(
      (petition: any[]) => {
        console.log('PETITION ON INIT : ' + petition);
        this.searchPetition = petition;
      }
    );
    this.petitionService.emitSearchPetition();
    this.petitionService.getSearchResult(this.query);
  }

  getNextSearchResult(): void {
    this.petitionService.getNextSearchResult(this.query);
  }

  onScroll(): void {
    console.log('scrolled!!');
    this.getNextSearchResult();
  }

  onSubmit(form: NgForm): void {
    this.query = form.value.query;
    this.getSearchResult();
    if (this.searchPetition == null) {
      this.noResult = true;
    }
  }

}
