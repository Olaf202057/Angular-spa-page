import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyColumnVisibilityComponent } from './strategy-column-visibility.component';

describe('StrategyColumnVisibilityComponent', () => {
  let component: StrategyColumnVisibilityComponent;
  let fixture: ComponentFixture<StrategyColumnVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyColumnVisibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyColumnVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
