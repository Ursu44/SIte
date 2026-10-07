import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsPage } from './savings-page';

describe('SavingsPage', () => {
  let component: SavingsPage;
  let fixture: ComponentFixture<SavingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
