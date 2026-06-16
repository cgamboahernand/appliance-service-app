import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MaintenanceService } from './maintenance.service';

const API = 'http://localhost:8080/api/maintenance';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MaintenanceService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch requests from API', () => {
    const signal = service.getRequests();
    httpTesting.expectOne(API).flush([]);
    expect(signal()).toEqual([]);
  });

  it('should post a maintenance request to API', () => {
    const preferred = new Date('2026-07-15');
    service.createRequest('user-1', 'REF-1001', 'Needs cleaning', preferred);

    const req = httpTesting.expectOne(API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      userId: 'user-1',
      serialId: 'REF-1001',
      description: 'Needs cleaning',
      preferredDate: '2026-07-15',
    });
    req.flush({
      id: 'mr-1', userId: 'user-1', serialId: 'REF-1001',
      description: 'Needs cleaning', preferredDate: '2026-07-15', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    });
  });

  it('should add created request to the signal', () => {
    service.getRequests();
    httpTesting.expectOne(API).flush([]);

    service.createRequest('user-1', 'REF-1001', 'Loud noise', new Date('2026-08-01'));
    httpTesting.expectOne(API).flush({
      id: 'mr-2', userId: 'user-1', serialId: 'REF-1001',
      description: 'Loud noise', preferredDate: '2026-08-01', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    });

    expect(service.getRequests()().length).toBe(1);
  });

  it('should patch status via API', () => {
    service.getRequests();
    httpTesting.expectOne(API).flush([{
      id: 'mr-1', userId: 'user-1', serialId: 'REF-1001',
      description: 'Test', preferredDate: '2026-07-15', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    }]);

    service.updateStatus('mr-1', 'Scheduled');

    const req = httpTesting.expectOne(`${API}/mr-1/status`);
    expect(req.request.method).toBe('PATCH');
    req.flush({
      id: 'mr-1', userId: 'user-1', serialId: 'REF-1001',
      description: 'Test', preferredDate: '2026-07-15', status: 'Scheduled',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T01:00:00',
    });

    expect(service.getRequests()()[0].status).toBe('Scheduled');
  });
});
