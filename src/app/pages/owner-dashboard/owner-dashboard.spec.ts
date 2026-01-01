import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDashboardComponent } from './owner-dashboard';

describe('OwnerDashboard', () => {
  let component: OwnerDashboardComponent;
  let fixture: ComponentFixture<OwnerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
