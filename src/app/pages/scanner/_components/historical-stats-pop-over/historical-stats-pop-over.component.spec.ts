import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalStatsPopOverComponent } from './historical-stats-pop-over.component';

describe('HistoricalStatsPopOverComponent', () => {
  let component: HistoricalStatsPopOverComponent;
  let fixture: ComponentFixture<HistoricalStatsPopOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalStatsPopOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalStatsPopOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
