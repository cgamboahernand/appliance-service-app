# Spec: Compliance Module

## Overview

This spec defines the components, services, models, and routing needed to implement the File Compliance feature.

## Models

### `src/app/models/user.ts`

```typescript
export interface User {
  id: string;
  name: string;
}
```

### `src/app/models/appliance.ts`

```typescript
export interface Appliance {
  id: string;
  name: string;
  description: string;
}
```

### `src/app/models/compliance.ts`

```typescript
export type ComplianceReason = 'Malfunction' | 'Broken';
export type ComplianceStatus = 'Pending' | 'Reviewed' | 'Assigned' | 'Closed';

export interface Compliance {
  id: string;
  applianceId: string;
  userId: string;
  reason: ComplianceReason;
  description: string;
  status: ComplianceStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Status Lifecycle

```
Pending → Reviewed → Assigned → Closed
```

- **Pending** — Filed by user, awaiting review.
- **Reviewed** — A representative has reviewed the issue.
- **Assigned** — The issue is assigned to someone for resolution.
- **Closed** — The issue has been resolved.

## Services

### `ApplianceService` — `src/app/services/appliance.service.ts`

Provides the list of available appliances.

| Method            | Returns                  | Description                         |
| ----------------- | ------------------------ | ----------------------------------- |
| `getAppliances()` | `Signal<Appliance[]>`    | Returns all available appliances    |
| `getById(id)`     | `Appliance \| undefined` | Returns a single appliance by id    |

- Seeded with mock data for now.

### `ComplianceService` — `src/app/services/compliance.service.ts`

Manages compliance records in memory.

| Method                          | Returns                  | Description                          |
| ------------------------------- | ------------------------ | ------------------------------------ |
| `getCompliances()`              | `Signal<Compliance[]>`   | Returns all filed compliances        |
| `fileCompliance(applianceId, userId, reason, description)` | `Compliance`  | Creates and stores a new compliance with status `Pending` and timestamps set  |
| `updateStatus(id, status)`      | `Compliance \| undefined` | Advances the compliance status and updates `updatedAt` |

## Components

### `ComplianceFormComponent` — `src/app/features/compliance/compliance-form/`

- Dropdown to select an appliance (populated from `ApplianceService`).
- Dropdown or input to select/identify the user filing the compliance.
- Radio buttons or dropdown to select the reason (`Malfunction` or `Broken`).
- Textarea for the issue description.
- Submit button with validation (appliance, user, reason, and description are all required).
- On submit: calls `ComplianceService.fileCompliance()`, shows confirmation, optionally navigates to the list.

### `ComplianceListComponent` — `src/app/features/compliance/compliance-list/`

- Displays a table/list of all filed compliances.
- Shows user name, appliance name, reason, description, status, created date, and updated date.

## Routing

| Path                | Component                | Description               |
| ------------------- | ------------------------ | -------------------------- |
| `/compliance/new`   | `ComplianceFormComponent` | File a new compliance      |
| `/compliance`       | `ComplianceListComponent` | View all filed compliances |
| `` (redirect)       | → `/compliance`           | Default route              |

## Folder Structure

```
src/app/
  models/
    user.ts
    appliance.ts
    compliance.ts
  services/
    appliance.service.ts
    compliance.service.ts
  features/
    compliance/
      compliance-form/
        compliance-form.ts
        compliance-form.html
        compliance-form.scss
        compliance-form.spec.ts
      compliance-list/
        compliance-list.ts
        compliance-list.html
        compliance-list.scss
        compliance-list.spec.ts
```

## Testing

- **ApplianceService**: Verify `getAppliances()` returns seeded data; `getById()` finds correct appliance.
- **ComplianceService**: Verify `fileCompliance()` creates a record with `reason`, `userId`, status `Pending`, and both timestamps set; `updateStatus()` advances status and updates `updatedAt`; `getCompliances()` returns all records.
- **ComplianceFormComponent**: Verify validation prevents empty submissions (appliance, user, reason, and description all required); successful submit calls service and shows confirmation.
- **ComplianceListComponent**: Verify list renders all compliance records with correct data including reason and status.
