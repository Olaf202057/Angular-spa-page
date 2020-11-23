import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFormComponent } from './current-form.component';

describe('CurrentFormComponent', () => {
  let component: CurrentFormComponent;
  let fixture: ComponentFixture<CurrentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
