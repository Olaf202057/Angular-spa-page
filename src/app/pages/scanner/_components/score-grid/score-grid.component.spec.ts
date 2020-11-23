import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreGridComponent } from './score-grid.component';

describe('ScoreGridComponent', () => {
  let component: ScoreGridComponent;
  let fixture: ComponentFixture<ScoreGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
