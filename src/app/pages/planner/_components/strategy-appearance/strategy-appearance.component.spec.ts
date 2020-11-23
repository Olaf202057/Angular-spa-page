import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyAppearanceComponent } from './strategy-appearance.component';

describe('StrategyAppearanceComponent', () => {
  let component: StrategyAppearanceComponent;
  let fixture: ComponentFixture<StrategyAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyAppearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
