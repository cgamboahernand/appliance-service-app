import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComplianceService } from './compliance.service';

const API = 'http://localhost:8080/api/compliances';

describe('ComplianceService', () => {
  let service: ComplianceService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ComplianceService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch compliances from API', () => {
    const signal = service.getCompliances();
    httpTesting.expectOne(API).flush([]);
    expect(signal()).toEqual([]);
  });

  it('should post a compliance to API', () => {
    service.fileCompliance('REF-1001', 'user-1', 'Malfunction', 'Not cooling');

    const req = httpTesting.expectOne(API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      serialId: 'REF-1001',
      userId: 'user-1',
      reason: 'Malfunction',
      description: 'Not cooling',
    });
    req.flush({
      id: 'c-1', serialId: 'REF-1001', userId: 'user-1',
      reason: 'Malfunction', description: 'Not cooling', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    });
  });

  it('should add created compliance to the signal', () => {
    service.getCompliances();
    httpTesting.expectOne(API).flush([]);

    service.fileCompliance('REF-1001', 'user-1', 'Broken', 'Door broke');
    const req = httpTesting.expectOne(API);
    req.flush({
      id: 'c-2', serialId: 'REF-1001', userId: 'user-1',
      reason: 'Broken', description: 'Door broke', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    });

    expect(service.getCompliances()().length).toBe(1);
  });

  it('should patch status via API', () => {
    service.getCompliances();
    httpTesting.expectOne(API).flush([{
      id: 'c-1', serialId: 'REF-1001', userId: 'user-1',
      reason: 'Malfunction', description: 'Not cooling', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    }]);

    service.updateStatus('c-1', 'Reviewed');

    const req = httpTesting.expectOne(`${API}/c-1/status`);
    expect(req.request.method).toBe('PATCH');
    req.flush({
      id: 'c-1', serialId: 'REF-1001', userId: 'user-1',
      reason: 'Malfunction', description: 'Not cooling', status: 'Reviewed',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T01:00:00',
    });

    expect(service.getCompliances()()[0].status).toBe('Reviewed');
  });
});
