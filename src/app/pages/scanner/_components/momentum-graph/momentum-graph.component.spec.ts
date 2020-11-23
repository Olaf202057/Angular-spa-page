import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentumGraphComponent } from './momentum-graph.component';

describe('MomentumGraphComponent', () => {
  let component: MomentumGraphComponent;
  let fixture: ComponentFixture<MomentumGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentumGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentumGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
