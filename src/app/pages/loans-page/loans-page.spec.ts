import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansPage } from './loans-page';

describe('LoansPage', () => {
  let component: LoansPage;
  let fixture: ComponentFixture<LoansPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
