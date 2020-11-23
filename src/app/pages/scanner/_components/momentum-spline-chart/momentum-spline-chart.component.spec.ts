import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentumSplineChartComponent } from './momentum-spline-chart.component';

describe('MomentumSplineChartComponent', () => {
  let component: MomentumSplineChartComponent;
  let fixture: ComponentFixture<MomentumSplineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentumSplineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentumSplineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentumSplineChartComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
