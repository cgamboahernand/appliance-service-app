# Spec: Purchase Module

## Overview

This spec defines the models, services, components, and routing needed to implement the Purchase Appliance feature. It updates the existing `Appliance` model to include a serial number and introduces a `Purchase` model that replaces the previous `UserAppliance` concept.

## Model Changes

### `src/app/models/appliance.ts` (updated)

```typescript
export interface Appliance {
  id: string;
  name: string;
  description: string;
  serial: string;
}
```

> **Breaking change**: adds `serial` field. All mock data and consumers must be updated.

### `src/app/models/purchase.ts` (new)

```typescript
export interface Purchase {
  id: string;
  userId: string;
  serialId: string;
  purchaseDate: Date;
}
```

### `src/app/models/user-appliance.ts` (deprecated)

The `UserAppliance` model is superseded by `Purchase`. The maintenance feature should be refactored to use `Purchase` and `serialId` instead of `UserAppliance` and `applianceId`.

## Services

### `ApplianceService` — `src/app/services/appliance.service.ts` (updated)

| Method              | Returns                  | Description                                         |
| ------------------- | ------------------------ | --------------------------------------------------- |
| `getAppliances()`   | `Signal<Appliance[]>`    | Returns all appliances in the catalog               |
| `getById(id)`       | `Appliance \| undefined` | Returns a single appliance by id                   |
| `getBySerial(serial)` | `Appliance \| undefined` | Returns a single appliance by serial number       |

- Mock data updated to include unique serial numbers.

### `PurchaseService` — `src/app/services/purchase.service.ts` (new)

Manages purchase records in memory.

| Method                              | Returns                  | Description                                                  |
| ----------------------------------- | ------------------------ | ------------------------------------------------------------ |
| `getPurchases()`                    | `Signal<Purchase[]>`     | Returns all purchase records                                 |
| `getByUserId(userId)`               | `Signal<Purchase[]>`     | Returns all purchases for a given user                       |
| `purchase(userId, serialId)`        | `Purchase`               | Creates a purchase record with auto-set `purchaseDate`       |
| `isAvailable(serialId)`             | `boolean`                | Returns `true` if the appliance has not been purchased yet   |

### `UserApplianceService` (deprecated)

To be replaced by `PurchaseService`. Maintenance feature code should be updated to use `PurchaseService.getByUserId()` instead of `UserApplianceService.getByUserId()`.

## Components

### `PurchaseCatalogComponent` — `src/app/features/purchase/purchase-catalog/`

- Displays all appliances from the catalog with serial numbers.
- Appliances already purchased are marked as unavailable.
- Each available appliance has a **Purchase** button.
- On purchase: calls `PurchaseService.purchase()`, shows confirmation.

### `PurchaseListComponent` — `src/app/features/purchase/purchase-list/`

- Displays the current user's purchased appliances.
- Shows appliance name, serial, description, and purchase date.

## Routing

| Path              | Component                | Description                       |
| ----------------- | ------------------------ | --------------------------------- |
| `/purchase`       | `PurchaseCatalogComponent` | Browse and purchase appliances  |
| `/my-appliances`  | `PurchaseListComponent`  | View user's purchased appliances  |

## Folder Structure

```
src/app/
  models/
    appliance.ts             ← UPDATED (+ serial)
    purchase.ts              ← NEW
    user-appliance.ts        ← DEPRECATED (replaced by purchase.ts)
  services/
    appliance.service.ts     ← UPDATED (+ getBySerial)
    purchase.service.ts      ← NEW
    user-appliance.service.ts ← DEPRECATED (replaced by purchase.service.ts)
  features/
    purchase/
      purchase-catalog/
        purchase-catalog.ts
        purchase-catalog.html
        purchase-catalog.scss
        purchase-catalog.spec.ts
      purchase-list/
        purchase-list.ts
        purchase-list.html
        purchase-list.scss
        purchase-list.spec.ts
```

## Refactoring Required

When this feature is implemented, the following must be updated:

1. **Appliance model & mock data** — add `serial` to every entry.
2. **ApplianceService** — add `getBySerial()` method.
3. **Maintenance feature** — replace `UserApplianceService` / `UserAppliance` references with `PurchaseService` / `Purchase`, and use `serialId` instead of `applianceId`.
4. **Compliance feature** — update to reference the appliance by `serialId` from the user's purchases.
5. **Remove** `user-appliance.ts` and `user-appliance.service.ts` once migration is complete.

## Testing

- **PurchaseService**: Verify `purchase()` creates a record with correct `userId`, `serialId`, and auto-set `purchaseDate`; `getByUserId()` returns only that user's purchases; `isAvailable()` returns `false` after purchase.
- **ApplianceService**: Verify `getBySerial()` finds the correct appliance.
- **PurchaseCatalogComponent**: Verify catalog displays all appliances with serials; purchased items are marked unavailable; clicking Purchase calls the service and shows confirmation.
- **PurchaseListComponent**: Verify list displays the user's purchased appliances with correct data.
