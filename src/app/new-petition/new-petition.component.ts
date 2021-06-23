import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PetitionPost} from '../../models/petitionPost.model';
import {PetitionService} from '../../services/petition.service';
import {Petition} from '../../models/petition.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-new-petition',
  templateUrl: './new-petition.component.html',
  styleUrls: ['./new-petition.component.scss']
})
export class NewPetitionComponent implements OnInit {

  petitionForm: FormGroup;

  tags: string[] = [];

  maxLengthDescription = 1000;

  myOptions: { viewValue: string; disabled: boolean; value: string }[] = [
    {
      viewValue: "Audi",
      value: "Audi",
      disabled: false
    },
    {
      viewValue: "citro",
      value: "citro",
      disabled: false
    },
    {
      viewValue: "reno",
      value: "reno",
      disabled: false
    }
  ];

  constructor(private formBuilder: FormBuilder,
              private petitionService: PetitionService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.tags = ['#Animaux', '#Environnement', '#JusticeEconomique', '#Politique', '#Sante', '#PresDeVous', '#DroitsDesFemmes',
      '#DroitsDesMigrants', '#JusticePenale', '#Education', '#Handicap', '#DroitsHumains', '#Famille', '#Patrimoine', '#Autre'];
  }

  initForm(): void {
    this.petitionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(this.maxLengthDescription)]],
      tags: ['', Validators.required]
    });

  }

  onSubmitForm(): void{
    const formValue = this.petitionForm.value;
    const newPetition = new PetitionPost(
      formValue.title,
      formValue.description,
      formValue.tags
    );
    console.log('Tag : ' + formValue.myControlName);
    this.petitionService.postPetition(newPetition);
    this.router.navigate(['/account/']);
  }

  getTags(): FormArray {
    return this.petitionForm.get('tags') as FormArray;
  }

}
