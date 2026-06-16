import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComplianceFormComponent } from './compliance-form';
import { Appliance } from '../../../models/appliance';
import { Purchase } from '../../../models/purchase';

const APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', description: 'Fridge', serial: 'REF-1001' },
];

const PURCHASES: Purchase[] = [
  { id: 'p-1', userId: 'user-1', serialId: 'REF-1001', purchaseDate: new Date() },
];

describe('ComplianceFormComponent', () => {
  let component: ComplianceFormComponent;
  let fixture: ComponentFixture<ComplianceFormComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceFormComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Flush all pending API calls — drain multiple rounds for cascading lazy-loads
    for (let i = 0; i < 3; i++) {
      httpTesting.match((req) => req.url.includes('appliances')).forEach((r) => r.flush(APPLIANCES));
      httpTesting.match((req) => req.url.includes('purchases')).forEach((r) => r.flush(PURCHASES));
      fixture.detectChanges();
    }
  });

  afterEach(() => {
    httpTesting.match(() => true); // drain leftovers
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when fields are empty', () => {
    expect(component.isValid).toBe(false);
  });

  it('should be valid when all fields are filled', () => {
    component.serialId = 'REF-1001';
    component.userName = 'John Doe';
    component.reason = 'Malfunction';
    component.description = 'Not cooling properly';
    expect(component.isValid).toBe(true);
  });

  it('should not submit when invalid', () => {
    component.onSubmit();
    expect(component.submitted()).toBe(false);
  });

  it('should submit and show confirmation when valid', () => {
    component.serialId = 'REF-1001';
    component.userName = 'John Doe';
    component.reason = 'Broken';
    component.description = 'Door handle broke off';

    component.onSubmit();
    expect(component.submitted()).toBe(true);

    const req = httpTesting.expectOne('http://localhost:8080/api/compliances');
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 'c-1', serialId: 'REF-1001', userId: 'John Doe',
      reason: 'Broken', description: 'Door handle broke off', status: 'Pending',
      createdAt: '2026-06-12T00:00:00', updatedAt: '2026-06-12T00:00:00',
    });
  });
});
