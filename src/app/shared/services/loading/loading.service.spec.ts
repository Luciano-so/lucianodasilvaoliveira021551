import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should start with false state', (done) => {
    service.state$.subscribe((state) => {
      expect(state.show).toBeFalse();
      done();
    });
  });

  it('should show loading after calling show()', (done) => {
    service.show();
    service.state$.subscribe((state) => {
      expect(state.show).toBeTrue();
      done();
    });
  });

  it('should hide loading with close() after show()', (done) => {
    service.show();
    service.close();
    service.state$.subscribe((state) => {
      expect(state.show).toBeFalse();
      done();
    });
  });

  it('should keep loading visible if close() is called before show()', (done) => {
    service.close();
    service.state$.subscribe((state) => {
      expect(state.show).toBeFalse();
      done();
    });
  });

  it('should force hide loading with forceHide()', (done) => {
    service.show();
    service.show();
    service.forceHide();
    service.state$.subscribe((state) => {
      expect(state.show).toBeFalse();
      done();
    });
  });
});
