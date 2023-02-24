import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        HomePageComponent
      ],
    }).compileComponents();
  });

  it('should create the home page', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const homePage = fixture.componentInstance;
    expect(homePage).toBeTruthy();
  });

  it(`should have as title 'angular-docker'`, () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const homePage = fixture.componentInstance;
    expect(homePage.title).toEqual('angular-docker');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('angular-docker app is running!');
  });
});
