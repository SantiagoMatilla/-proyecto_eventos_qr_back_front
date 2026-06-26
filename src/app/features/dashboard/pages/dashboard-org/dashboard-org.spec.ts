import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrg } from './dashboard-org';

describe('DashboardOrg', () => {
  let component: DashboardOrg;
  let fixture: ComponentFixture<DashboardOrg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOrg],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOrg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
