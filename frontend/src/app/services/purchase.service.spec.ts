import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PurchaseService } from './purchase.service';
import { Purchase } from '../models/purchase';

const API = 'http://localhost:8080/api/purchases';

const MOCK_PURCHASES: Purchase[] = [
  { id: 'p-1', userId: 'user-1', serialId: 'REF-1001', purchaseDate: new Date('2024-03-15') },
  { id: 'p-2', userId: 'user-1', serialId: 'DW-3001', purchaseDate: new Date('2024-06-20') },
  { id: 'p-3', userId: 'user-1', serialId: 'AC-5001', purchaseDate: new Date('2025-01-10') },
  { id: 'p-4', userId: 'user-2', serialId: 'WM-2001', purchaseDate: new Date('2024-09-05') },
];

describe('PurchaseService', () => {
  let service: PurchaseService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PurchaseService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch purchases from API', () => {
    const signal = service.getPurchases();
    httpTesting.expectOne(API).flush(MOCK_PURCHASES);
    expect(signal().length).toBe(4);
  });

  it('should filter purchases by user id', () => {
    const user1 = service.getByUserId('user-1');
    httpTesting.expectOne(API).flush(MOCK_PURCHASES);
    expect(user1().length).toBe(3);
    expect(user1().every((p) => p.userId === 'user-1')).toBe(true);
  });

  it('should return empty for an unknown user', () => {
    const unknown = service.getByUserId('unknown');
    httpTesting.expectOne(API).flush(MOCK_PURCHASES);
    expect(unknown().length).toBe(0);
  });

  it('should post a purchase to API', () => {
    service.purchase('user-3', 'ST-6001');

    const req = httpTesting.expectOne(API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId: 'user-3', serialId: 'ST-6001' });
    req.flush({ id: 'p-new', userId: 'user-3', serialId: 'ST-6001', purchaseDate: '2026-06-12' });
  });

  it('should mark a purchased serial as unavailable after loading', () => {
    service.getPurchases();
    httpTesting.expectOne(API).flush(MOCK_PURCHASES);

    expect(service.isAvailable('REF-1001')).toBe(false);
    expect(service.isAvailable('ST-6001')).toBe(true);
  });
});
