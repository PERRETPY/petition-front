import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPetitionsComponent } from './last-petitions.component';

describe('LastPetitionsComponent', () => {
  let component: LastPetitionsComponent;
  let fixture: ComponentFixture<LastPetitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastPetitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
