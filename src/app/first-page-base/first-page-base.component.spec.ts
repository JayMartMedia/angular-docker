import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPageBaseComponent } from './first-page-base.component';

describe('FirstPageBaseComponent', () => {
  let component: FirstPageBaseComponent;
  let fixture: ComponentFixture<FirstPageBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPageBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstPageBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
