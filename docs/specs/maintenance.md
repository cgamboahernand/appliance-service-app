# Spec: Maintenance Module

## Overview

This spec defines the models, services, components, and routing needed to implement the Request Maintenance Service feature. It reuses the existing `User` and `Appliance` models and introduces a `UserAppliance` ownership concept and a `MaintenanceRequest` record.

## Models

### `src/app/models/user-appliance.ts`

```typescript
export interface UserAppliance {
  id: string;
  userId: string;
  applianceId: string;
  purchaseDate: Date;
}
```

### `src/app/models/maintenance-request.ts`

```typescript
export type MaintenanceStatus =
  | 'Pending'
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

export interface MaintenanceRequest {
  id: string;
  userId: string;
  applianceId: string;
  description: string;
  preferredDate: Date;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Status Lifecycle

```
Pending → Scheduled → InProgress → Completed
                                  ↘ Cancelled
```

## Services

### `UserApplianceService` — `src/app/services/user-appliance.service.ts`

Manages the relationship between users and their purchased appliances.

| Method                        | Returns                       | Description                                          |
| ----------------------------- | ----------------------------- | ---------------------------------------------------- |
| `getByUserId(userId)`         | `Signal<UserAppliance[]>`     | Returns all appliance purchases for a given user     |
| `getAllUserAppliances()`      | `Signal<UserAppliance[]>`     | Returns all user-appliance records                   |

- Seeded with mock data linking users to appliances.

### `MaintenanceService` — `src/app/services/maintenance.service.ts`

Manages maintenance request records in memory.

| Method                                                              | Returns                          | Description                                                              |
| ------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `getRequests()`                                                     | `Signal<MaintenanceRequest[]>`   | Returns all maintenance requests                                         |
| `createRequest(userId, applianceId, description, preferredDate)`    | `MaintenanceRequest`             | Creates and stores a new request with status `Pending` and timestamps    |
| `updateStatus(id, status)`                                          | `MaintenanceRequest \| undefined` | Advances the request status and updates `updatedAt`                     |

## Components

### `MaintenanceFormComponent` — `src/app/features/maintenance/maintenance-form/`

- Dropdown to select a purchased appliance (populated from `UserApplianceService` + `ApplianceService` to resolve names).
- Textarea for the description of the issue or service needed.
- Date input for the preferred service date.
- Submit button with validation (appliance, description, and preferred date are all required).
- On submit: calls `MaintenanceService.createRequest()`, shows confirmation, optionally navigates to the list.

### `MaintenanceListComponent` — `src/app/features/maintenance/maintenance-list/`

- Displays a table/list of all filed maintenance requests.
- Shows appliance name, description, preferred date, status, created date, and updated date.

## Routing

| Path                  | Component                  | Description                     |
| --------------------- | -------------------------- | ------------------------------- |
| `/maintenance`        | `MaintenanceListComponent` | View all maintenance requests   |
| `/maintenance/new`    | `MaintenanceFormComponent` | File a new maintenance request  |

## Folder Structure

```
src/app/
  models/
    user-appliance.ts          ← NEW
    maintenance-request.ts     ← NEW
  services/
    user-appliance.service.ts  ← NEW
    maintenance.service.ts     ← NEW
  features/
    maintenance/
      maintenance-form/
        maintenance-form.ts
        maintenance-form.html
        maintenance-form.scss
        maintenance-form.spec.ts
      maintenance-list/
        maintenance-list.ts
        maintenance-list.html
        maintenance-list.scss
        maintenance-list.spec.ts
```

## Testing

- **UserApplianceService**: Verify `getByUserId()` returns only appliances for that user; returns empty array for unknown user.
- **MaintenanceService**: Verify `createRequest()` creates a record with status `Pending` and both timestamps set; `updateStatus()` advances status and updates `updatedAt`; `getRequests()` returns all records.
- **MaintenanceFormComponent**: Verify only purchased appliances are shown in dropdown; validation prevents empty submissions; successful submit calls service and shows confirmation.
- **MaintenanceListComponent**: Verify list renders all maintenance requests with correct data including status.
