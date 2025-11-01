import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkliftDetail } from './forklift-detail';

describe('ForkliftDetail', () => {
  let component: ForkliftDetail;
  let fixture: ComponentFixture<ForkliftDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForkliftDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForkliftDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
