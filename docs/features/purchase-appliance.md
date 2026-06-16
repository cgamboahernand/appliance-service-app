# Feature: Purchase Appliance

## Summary

Allow users to purchase an appliance from the catalog. Each appliance has a unique serial number, and the purchase creates a relationship between the user and that specific appliance serial.

## User Story

As a **user**, I want to **purchase an appliance**, so that **it is registered to my account and I can later request maintenance or file a compliance for it**.

## Acceptance Criteria

- [ ] User can browse a catalog of available appliances.
- [ ] Each appliance has a unique serial number displayed.
- [ ] User can select an appliance to purchase.
- [ ] On purchase, a record is created linking the user's ID to the appliance serial.
- [ ] The purchase date is recorded automatically.
- [ ] After purchase, the user sees a confirmation message.
- [ ] The purchased appliance appears in the user's list of owned appliances.
- [ ] An appliance that has already been purchased is no longer available to other users.

## Data Models

### Appliance (updated)

Each appliance represents a specific physical unit with a unique serial.

| Field         | Type     | Description                               |
| ------------- | -------- | ----------------------------------------- |
| `id`          | `string` | Unique identifier for the appliance type  |
| `name`        | `string` | Display name of the appliance             |
| `description` | `string` | Brief description of the appliance        |
| `serial`      | `string` | Unique serial number of the physical unit |

### Purchase

The relationship between a user and a purchased appliance.

| Field          | Type     | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `id`           | `string` | Unique identifier for the purchase record    |
| `userId`       | `string` | Reference to the user who purchased          |
| `serialId`     | `string` | Reference to the appliance serial            |
| `purchaseDate` | `Date`   | Timestamp of when the purchase was made      |

## UI Flow

1. User navigates to the **Purchase Appliance** page.
2. User sees a catalog of available (unpurchased) appliances with serial numbers.
3. User clicks **Purchase** on the desired appliance.
4. A confirmation message is displayed.
5. The appliance appears in the user's **My Appliances** list.

## Cross-Feature Impact

- **Maintenance**: The existing `UserAppliance` model is superseded by `Purchase`. The maintenance form should use `Purchase` records to determine which appliances the user owns (looked up by `serialId`).
- **Compliance**: When filing a compliance, the user should reference a specific appliance serial from their purchases rather than the general catalog.

## Notes

- For now, data is managed in-memory (no backend API).
- The appliance catalog is seeded with mock entries, each with a unique serial.
- A purchased appliance should not appear as available for other users.
