import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextListSection } from './text-list-section';

describe('TextListSection', () => {
  let component: TextListSection;
  let fixture: ComponentFixture<TextListSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextListSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextListSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
