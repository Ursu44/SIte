import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPage } from './membership-page';

describe('MembershipPage', () => {
  let component: MembershipPage;
  let fixture: ComponentFixture<MembershipPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
