import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApplianceService } from './appliance.service';
import { Appliance } from '../models/appliance';

const MOCK_APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', description: 'Double-door fridge', serial: 'REF-1001' },
  { id: '2', name: 'Washing Machine', description: 'Front-load washer', serial: 'WM-2001' },
];

describe('ApplianceService', () => {
  let service: ApplianceService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApplianceService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch appliances from API', () => {
    const signal = service.getAppliances();

    const req = httpTesting.expectOne('http://localhost:8080/api/appliances');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_APPLIANCES);

    expect(signal().length).toBe(2);
  });

  it('should find an appliance by id after loading', () => {
    service.getAppliances();
    httpTesting.expectOne('http://localhost:8080/api/appliances').flush(MOCK_APPLIANCES);

    const appliance = service.getById('1');
    expect(appliance).toBeDefined();
    expect(appliance!.name).toBe('Refrigerator');
  });

  it('should return undefined for an unknown id', () => {
    service.getAppliances();
    httpTesting.expectOne('http://localhost:8080/api/appliances').flush(MOCK_APPLIANCES);

    const appliance = service.getById('unknown');
    expect(appliance).toBeUndefined();
  });

  it('should find an appliance by serial', () => {
    service.getAppliances();
    httpTesting.expectOne('http://localhost:8080/api/appliances').flush(MOCK_APPLIANCES);

    const appliance = service.getBySerial('REF-1001');
    expect(appliance).toBeDefined();
    expect(appliance!.name).toBe('Refrigerator');
  });

  it('should return undefined for an unknown serial', () => {
    service.getAppliances();
    httpTesting.expectOne('http://localhost:8080/api/appliances').flush(MOCK_APPLIANCES);

    const appliance = service.getBySerial('UNKNOWN');
    expect(appliance).toBeUndefined();
  });

  it('should only call API once on multiple getAppliances calls', () => {
    service.getAppliances();
    service.getAppliances();

    httpTesting.expectOne('http://localhost:8080/api/appliances').flush(MOCK_APPLIANCES);
  });
});
