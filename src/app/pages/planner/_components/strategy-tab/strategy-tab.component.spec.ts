import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyTabComponent } from './strategy-tab.component';

describe('StrategyTabComponent', () => {
  let component: StrategyTabComponent;
  let fixture: ComponentFixture<StrategyTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
