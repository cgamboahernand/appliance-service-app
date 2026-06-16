import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PurchaseCatalogComponent } from './purchase-catalog';
import { Appliance } from '../../../models/appliance';
import { Purchase } from '../../../models/purchase';

const APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', description: 'Fridge', serial: 'REF-1001' },
  { id: '2', name: 'Washer', description: 'Washer', serial: 'WM-2001' },
  { id: '3', name: 'Stove', description: 'Stove', serial: 'ST-6001' },
];

const PURCHASES: Purchase[] = [
  { id: 'p-1', userId: 'user-1', serialId: 'REF-1001', purchaseDate: new Date() },
];

describe('PurchaseCatalogComponent', () => {
  let component: PurchaseCatalogComponent;
  let fixture: ComponentFixture<PurchaseCatalogComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseCatalogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseCatalogComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    for (let i = 0; i < 3; i++) {
      httpTesting.match((req) => req.url.includes('appliances')).forEach((r) => r.flush(APPLIANCES));
      httpTesting.match((req) => req.url.includes('purchases')).forEach((r) => r.flush(PURCHASES));
      fixture.detectChanges();
    }
  });

  afterEach(() => {
    httpTesting.match(() => true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all appliances in the catalog', () => {
    expect(component.catalog().length).toBe(3);
  });

  it('should mark purchased appliances as unavailable', () => {
    const ref = component.catalog().find((a) => a.serial === 'REF-1001');
    expect(ref?.available).toBe(false);
  });

  it('should mark unpurchased appliances as available', () => {
    const stove = component.catalog().find((a) => a.serial === 'ST-6001');
    expect(stove?.available).toBe(true);
  });

  it('should call API on purchase', () => {
    component.onPurchase('ST-6001');
    const req = httpTesting.expectOne('http://localhost:8080/api/purchases');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'p-new', userId: 'user-1', serialId: 'ST-6001', purchaseDate: '2026-06-12' });
  });
});
