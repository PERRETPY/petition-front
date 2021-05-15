import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PetitionPost} from '../../models/petitionPost.model';

@Component({
  selector: 'app-new-petition',
  templateUrl: './new-petition.component.html',
  styleUrls: ['./new-petition.component.scss']
})
export class NewPetitionComponent implements OnInit {

  petitionForm: FormGroup;

  tags: string[] = [
    'Économie',
    'Société',
    'Politique',
    'Animaux',
    'Enfant',
    'Éducation'
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.petitionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: this.formBuilder.array([])
    });
  }

  onSubmitForm(): void{
    const formValue = this.petitionForm.value;
    const newPetition = new PetitionPost(
      formValue.title,
      formValue.description,
      formValue.tags ? formValue.tags : []
    );
    console.log(newPetition);
  }

  getTags(): FormArray {
    return this.petitionForm.get('tags') as FormArray;
  }

  onAddTag(): void {
    const newTagsControl = this.formBuilder.control('', Validators.required);
    this.getTags().push(newTagsControl);
  }

  onDeleteTag(i: number): void {
    this.getTags().removeAt(i);
  }

}
