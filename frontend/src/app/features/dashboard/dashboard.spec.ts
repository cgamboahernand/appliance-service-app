import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard';
import { Purchase } from '../../models/purchase';

const PURCHASES: Purchase[] = [
  { id: 'p-1', userId: 'user-1', serialId: 'REF-1001', purchaseDate: new Date() },
  { id: 'p-2', userId: 'user-1', serialId: 'DW-3001', purchaseDate: new Date() },
  { id: 'p-3', userId: 'user-1', serialId: 'AC-5001', purchaseDate: new Date() },
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    for (let i = 0; i < 3; i++) {
      httpTesting.match((req) => req.url.includes('purchases')).forEach((r) => r.flush(PURCHASES));
      httpTesting.match((req) => req.url.includes('maintenance')).forEach((r) => r.flush([]));
      httpTesting.match((req) => req.url.includes('compliances')).forEach((r) => r.flush([]));
      fixture.detectChanges();
    }
  });

  afterEach(() => {
    httpTesting.match(() => true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show purchased products count', () => {
    expect(component.purchasedCount()).toBe(3);
  });

  it('should show zero maintenance requests initially', () => {
    expect(component.maintenanceCount()).toBe(0);
  });

  it('should show zero compliance issues initially', () => {
    expect(component.complianceCount()).toBe(0);
  });

  it('should render three cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toBe(3);
  });
});
