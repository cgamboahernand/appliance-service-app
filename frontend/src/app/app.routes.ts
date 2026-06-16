import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        (m) => m.DashboardComponent,
      ),
    pathMatch: 'full',
  },
  {
    path: 'purchase',
    loadComponent: () =>
      import('./features/purchase/purchase-catalog/purchase-catalog').then(
        (m) => m.PurchaseCatalogComponent,
      ),
  },
  {
    path: 'my-appliances',
    loadComponent: () =>
      import('./features/purchase/purchase-list/purchase-list').then(
        (m) => m.PurchaseListComponent,
      ),
  },
  {
    path: 'compliance',
    loadComponent: () =>
      import('./features/compliance/compliance-list/compliance-list').then(
        (m) => m.ComplianceListComponent,
      ),
  },
  {
    path: 'compliance/new',
    loadComponent: () =>
      import('./features/compliance/compliance-form/compliance-form').then(
        (m) => m.ComplianceFormComponent,
      ),
  },
  {
    path: 'maintenance',
    loadComponent: () =>
      import('./features/maintenance/maintenance-list/maintenance-list').then(
        (m) => m.MaintenanceListComponent,
      ),
  },
  {
    path: 'maintenance/new',
    loadComponent: () =>
      import('./features/maintenance/maintenance-form/maintenance-form').then(
        (m) => m.MaintenanceFormComponent,
      ),
  },
];
