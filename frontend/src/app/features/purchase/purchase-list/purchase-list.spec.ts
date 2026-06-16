import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PurchaseListComponent } from './purchase-list';
import { Appliance } from '../../../models/appliance';
import { Purchase } from '../../../models/purchase';

const APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', description: 'Fridge', serial: 'REF-1001' },
  { id: '2', name: 'Dishwasher', description: 'Dishwasher', serial: 'DW-3001' },
];

const PURCHASES: Purchase[] = [
  { id: 'p-1', userId: 'user-1', serialId: 'REF-1001', purchaseDate: new Date('2024-03-15') },
  { id: 'p-2', userId: 'user-1', serialId: 'DW-3001', purchaseDate: new Date('2024-06-20') },
];

describe('PurchaseListComponent', () => {
  let component: PurchaseListComponent;
  let fixture: ComponentFixture<PurchaseListComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseListComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseListComponent);
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

  it('should display purchased appliances for the current user', () => {
    const rows = component.rows();
    expect(rows.length).toBe(2);
  });

  it('should resolve appliance names from serials', () => {
    const rows = component.rows();
    const ref = rows.find((r) => r.serial === 'REF-1001');
    expect(ref?.name).toBe('Refrigerator');
  });
});
