import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from '../service/loading.service';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let loadingState$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingState$ = new BehaviorSubject<boolean>(false);

    mockLoadingService = jasmine.createSpyObj(
      'LoadingService',
      ['show', 'hide', 'close', 'forceHide'],
      {
        state$: loadingState$.asObservable(),
      },
    );

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [{ provide: LoadingService, useValue: mockLoadingService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading when show is true', () => {
    loadingState$.next(true);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(
      By.css('.page-preloading'),
    );
    expect(loaderElement).toBeTruthy();
  });

  it('should not display loading when show is false', () => {
    loadingState$.next(false);
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(
      By.css('.page-preloading'),
    );
    expect(loaderElement).toBeFalsy();
  });
});
