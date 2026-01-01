import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerLayoutComponent } from './owner-layout';

describe('OwnerLayout', () => {
  let component: OwnerLayoutComponent;
  let fixture: ComponentFixture<OwnerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
