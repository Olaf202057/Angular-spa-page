import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionsMarketSelectionDialogComponent } from './predictions-market-selection-dialog.component';

describe('PredictionsMarketSelectionDialogComponent', () => {
  let component: PredictionsMarketSelectionDialogComponent;
  let fixture: ComponentFixture<PredictionsMarketSelectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictionsMarketSelectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionsMarketSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
