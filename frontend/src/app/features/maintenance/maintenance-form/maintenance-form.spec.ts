import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MaintenanceFormComponent } from './maintenance-form';
import { Appliance } from '../../../models/appliance';
import { Purchase } from '../../../models/purchase';

const APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', description: 'Fridge', serial: 'REF-1001' },
  { id: '2', name: 'Dishwasher', description: 'DW', serial: 'DW-3001' },
  { id: '3', name: 'AC', description: 'AC', serial: 'AC-5001' },
];

const PURCHASES: Purchase[] = [
  { id: 'p-1', userId: 'user-1', serialId: 'REF-1001', purchaseDate: new Date() },
  { id: 'p-2', userId: 'user-1', serialId: 'DW-3001', purchaseDate: new Date() },
  { id: 'p-3', userId: 'user-1', serialId: 'AC-5001', purchaseDate: new Date() },
];

describe('MaintenanceFormComponent', () => {
  let component: MaintenanceFormComponent;
  let fixture: ComponentFixture<MaintenanceFormComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceFormComponent);
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

  it('should load only purchased appliances for the current user', () => {
    const appliances = component.purchasedAppliances();
    expect(appliances.length).toBe(3);
    expect(appliances.every((a) => a.serialId)).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.isValid).toBe(false);
  });

  it('should be valid when all fields are filled', () => {
    component.serialId = 'REF-1001';
    component.description = 'Needs regular maintenance';
    component.preferredDate = '2026-07-20';
    expect(component.isValid).toBe(true);
  });

  it('should not submit when invalid', () => {
    component.onSubmit();
    expect(component.submitted()).toBe(false);
  });

  it('should submit and show confirmation when valid', () => {
    component.serialId = 'REF-1001';
    component.description = 'Compressor is loud';
    component.preferredDate = '2026-07-20';

    component.onSubmit();
    expect(component.submitted()).toBe(true);

    const req = httpTesting.expectOne('http://localhost:8080/api/maintenance');
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 'mr-1', userId: 'user-1', serialId: 'REF-1001',
      description: 'Compressor is loud', preferredDate: '2026-07-20', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    });
  });
});
