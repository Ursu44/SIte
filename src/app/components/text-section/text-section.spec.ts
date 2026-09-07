import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSection } from './text-section';

describe('TextSection', () => {
  let component: TextSection;
  let fixture: ComponentFixture<TextSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
