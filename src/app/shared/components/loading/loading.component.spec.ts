import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { LoadingState } from '../../models/shared.model';
import { LoadingService } from '../../services/loading/loading.service';
import { LoadingComponent } from './loading.component';
describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let loadingState$: BehaviorSubject<LoadingState>;

  beforeEach(async () => {
    loadingState$ = new BehaviorSubject<LoadingState>({ show: false });

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
    loadingState$.next({ show: true });
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.loading'));
    expect(loaderElement).toBeTruthy();
  });

  it('should not display loading when show is false', () => {
    loadingState$.next({ show: false });
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(
      By.css('.page-preloading'),
    );
    expect(loaderElement).toBeFalsy();
  });
});
