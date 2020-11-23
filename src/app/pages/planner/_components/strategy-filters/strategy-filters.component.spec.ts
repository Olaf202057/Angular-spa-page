import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyFiltersComponent } from './strategy-filters.component';

describe('StrategyFiltersComponent', () => {
  let component: StrategyFiltersComponent;
  let fixture: ComponentFixture<StrategyFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
