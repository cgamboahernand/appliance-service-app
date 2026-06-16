# Architecture Overview

## Tech Stack

- **Framework:** Angular (standalone components)
- **Language:** TypeScript
- **Styling:** SCSS
- **Build:** Angular CLI

## High-Level Design

```
AppComponent
 └─ <router-outlet>
      ├─ /compliance        → ComplianceListComponent
      ├─ /compliance/new    → ComplianceFormComponent
      ├─ /maintenance       → MaintenanceListComponent
      ├─ /maintenance/new   → MaintenanceFormComponent
      ├─ /purchase          → PurchaseCatalogComponent
      └─ /my-appliances     → PurchaseListComponent
```

### Services

- **ApplianceService** — provides appliance catalog data with serial numbers (in-memory, mock-seeded).
- **PurchaseService** — manages purchase records linking users to appliance serials (in-memory CRUD).
- **ComplianceService** — manages compliance records (in-memory CRUD).
- **MaintenanceService** — manages maintenance request records (in-memory CRUD).

> **Deprecated**: `UserApplianceService` — replaced by `PurchaseService`.

### Data Flow

1. `PurchaseCatalogComponent` reads appliances from `ApplianceService` and availability from `PurchaseService`.
2. On purchase, it calls `PurchaseService.purchase()`.
3. `PurchaseListComponent` reads the user's purchases from `PurchaseService` and resolves appliance details via `ApplianceService`.
4. `ComplianceFormComponent` reads the user's purchased appliances via `PurchaseService` + `ApplianceService`.
5. On submit, it calls `ComplianceService.fileCompliance()`.
6. `ComplianceListComponent` reads compliances from `ComplianceService` and resolves appliance names via `ApplianceService`.
7. `MaintenanceFormComponent` reads the user's purchased appliances via `PurchaseService` + `ApplianceService`.
8. On submit, it calls `MaintenanceService.createRequest()`.
9. `MaintenanceListComponent` reads requests from `MaintenanceService` and resolves appliance names via `ApplianceService`.

## Key Decisions

| Decision                        | Rationale                                                   |
| ------------------------------- | ----------------------------------------------------------- |
| Standalone components           | Angular 22 default, no NgModules needed                     |
| Signals for state               | Modern Angular reactivity, simpler than RxJS for local state |
| In-memory data (no backend)     | MVP / bootcamp demo focus                                   |
| Feature-based folder structure  | Scales well, keeps related files together                   |
| Vitest for testing              | Fast, modern test runner already configured                 |
