import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickFilterPopupComponent } from './quick-filter-popup.component';

describe('QuickFilterPopupComponent', () => {
  let component: QuickFilterPopupComponent;
  let fixture: ComponentFixture<QuickFilterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickFilterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
