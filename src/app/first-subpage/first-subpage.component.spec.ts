import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstSubpageComponent } from './first-subpage.component';

describe('FirstSubpageComponent', () => {
  let component: FirstSubpageComponent;
  let fixture: ComponentFixture<FirstSubpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstSubpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstSubpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
