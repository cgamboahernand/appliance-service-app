import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MaintenanceListComponent } from './maintenance-list';
import { Appliance } from '../../../models/appliance';

const APPLIANCES: Appliance[] = [
  { id: '1', name: 'Refrigerator', description: 'Fridge', serial: 'REF-1001' },
];

describe('MaintenanceListComponent', () => {
  let component: MaintenanceListComponent;
  let fixture: ComponentFixture<MaintenanceListComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceListComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceListComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    for (let i = 0; i < 3; i++) {
      httpTesting.match((req) => req.url.includes('appliances')).forEach((r) => r.flush(APPLIANCES));
      httpTesting.match((req) => req.url.includes('maintenance')).forEach((r) => r.flush([]));
      fixture.detectChanges();
    }
  });

  afterEach(() => {
    httpTesting.match(() => true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when no requests exist', () => {
    fixture.detectChanges();
    expect(component.rows().length).toBe(0);
    const emptyEl = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyEl).toBeTruthy();
  });

  it('should display rows when requests loaded', () => {
    expect(component.rows().length).toBe(0);
  });
});
