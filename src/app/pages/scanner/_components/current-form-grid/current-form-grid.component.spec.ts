import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFormGridComponent } from './current-form-grid.component';

describe('CurrentFormGridComponent', () => {
  let component: CurrentFormGridComponent;
  let fixture: ComponentFixture<CurrentFormGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentFormGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFormGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
