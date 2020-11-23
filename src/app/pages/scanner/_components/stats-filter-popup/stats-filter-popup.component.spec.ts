import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsFilterPopupComponent } from './stats-filter-popup.component';

describe('StatsFilterPopupComponent', () => {
  let component: StatsFilterPopupComponent;
  let fixture: ComponentFixture<StatsFilterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsFilterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
