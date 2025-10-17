import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCourse } from './details-course';

describe('DetailsCourse', () => {
  let component: DetailsCourse;
  let fixture: ComponentFixture<DetailsCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
