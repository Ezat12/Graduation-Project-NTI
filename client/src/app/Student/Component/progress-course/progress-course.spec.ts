import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCourse } from './progress-course';

describe('ProgressCourse', () => {
  let component: ProgressCourse;
  let fixture: ComponentFixture<ProgressCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
