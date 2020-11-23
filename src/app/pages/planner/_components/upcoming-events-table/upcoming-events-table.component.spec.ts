import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingEventsTableComponent } from './upcoming-events-table.component';

describe('UpcomingEventsTableComponent', () => {
  let component: UpcomingEventsTableComponent;
  let fixture: ComponentFixture<UpcomingEventsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingEventsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingEventsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
