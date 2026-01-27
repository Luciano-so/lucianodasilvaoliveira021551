import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';

@Injectable()
class TestHttpBaseService extends HttpBaseService {
  public testGet<T>(endpoint: string, options?: any) {
    return this.get<T>(endpoint, options);
  }

  public testPost<T>(endpoint: string, body: any, options?: any) {
    return this.post<T>(endpoint, body, options);
  }

  public testPut<T>(endpoint: string, body: any, options?: any) {
    return this.put<T>(endpoint, body, options);
  }

  public testDelete<T>(endpoint: string, options?: any) {
    return this.delete<T>(endpoint, options);
  }
}

describe('HttpBaseService', () => {
  let service: TestHttpBaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestHttpBaseService],
    });

    service = TestBed.inject(TestHttpBaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make a GET request without options', () => {
      const testData = { id: 1, name: 'Test' };
      const endpoint = 'test';

      service.testGet(endpoint).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(testData);
    });

    it('should make a GET request with options', () => {
      const testData = { id: 1, name: 'Test' };
      const endpoint = 'test';
      const options = {
        headers: { Authorization: 'Bearer token' },
        params: { page: '1' },
      };

      service.testGet(endpoint, options).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/${endpoint}?page=1`,
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush(testData);
    });
  });

  describe('POST requests', () => {
    it('should make a POST request', () => {
      const testData = { id: 1, name: 'Test' };
      const endpoint = 'test';
      const body = { name: 'New Test' };

      service.testPost(endpoint, body).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(testData);
    });

    it('should make a POST request with options', () => {
      const testData = { id: 1, name: 'Test' };
      const endpoint = 'test';
      const body = { name: 'New Test' };
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };

      service.testPost(endpoint, body, options).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(testData);
    });
  });

  describe('PUT requests', () => {
    it('should make a PUT request', () => {
      const testData = { id: 1, name: 'Updated Test' };
      const endpoint = 'test/1';
      const body = { name: 'Updated Test' };

      service.testPut(endpoint, body).subscribe((data) => {
        expect(data).toEqual(testData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(testData);
    });
  });

  describe('DELETE requests', () => {
    it('should make a DELETE request', () => {
      const endpoint = 'test/1';

      service.testDelete(endpoint).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should make a DELETE request with options', () => {
      const endpoint = 'test/1';
      const options = {
        headers: { Authorization: 'Bearer token' },
      };

      service.testDelete(endpoint, options).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush(null);
    });
  });

  describe('URL construction', () => {
    it('should construct URLs correctly', () => {
      const endpoint = 'api/test';
      const expectedUrl = `${environment.apiUrl}/${endpoint}`;

      service.testGet(endpoint).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.url).toBe(expectedUrl);
      req.flush({});
    });
  });
});
