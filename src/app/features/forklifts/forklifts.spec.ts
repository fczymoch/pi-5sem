import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forklifts } from './forklifts';

describe('Forklifts', () => {
  let component: Forklifts;
  let fixture: ComponentFixture<Forklifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forklifts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forklifts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
