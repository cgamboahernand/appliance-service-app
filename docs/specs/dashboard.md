# Spec: Dashboard Module

## Overview

The dashboard is a single component that aggregates counts from existing services and presents them as summary cards. No new models or services are required.

## Component

### `DashboardComponent` — `src/app/features/dashboard/dashboard.ts`

Injects the three existing services and computes counts for the current user:

- **Purchased Products** — `PurchaseService.getByUserId(userId)().length`
- **Maintenance Requests** — filters `MaintenanceService.getRequests()()` by `userId`
- **Issues Reported** — filters `ComplianceService.getCompliances()()` by `userId`

Each card is clickable and navigates to the corresponding list.

## Routing

| Path | Component          | Description        |
| ---- | ------------------ | ------------------ |
| `/`  | `DashboardComponent` | Home page dashboard |

> The previous default redirect to `/purchase` is replaced by the dashboard route.

## Folder Structure

```
src/app/
  features/
    dashboard/
      dashboard.ts
      dashboard.html
      dashboard.scss
      dashboard.spec.ts
```

## Testing

- **DashboardComponent**: Verify counts reflect data from services; clicking cards navigates to the correct routes.
