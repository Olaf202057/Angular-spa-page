import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyPopupComponent } from './strategy-popup.component';

describe('StrategyPopupComponent', () => {
  let component: StrategyPopupComponent;
  let fixture: ComponentFixture<StrategyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
