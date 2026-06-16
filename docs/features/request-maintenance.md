# Feature: Request Maintenance Service

## Summary

Allow users to request a maintenance service for one of their previously purchased appliances. Each request covers exactly one appliance and is tracked through a status lifecycle until completed.

## User Story

As a **user**, I want to **request a maintenance service for one of my purchased appliances**, so that **a technician can be scheduled to inspect and service it**.

## Acceptance Criteria

- [ ] User has a list of their previously purchased appliances.
- [ ] User can select exactly one purchased appliance per maintenance request.
- [ ] User can enter a description of the issue or service needed.
- [ ] User can select a preferred service date.
- [ ] User can submit the maintenance request.
- [ ] Form validates that an appliance, description, and preferred date are provided before submission.
- [ ] Only the user's purchased appliances are shown — not the full catalog.
- [ ] On submission, the request is created with status `Pending` and timestamps set automatically.
- [ ] After successful submission, the user sees a confirmation message.
- [ ] The filed maintenance request is visible in a maintenance request list.

## Data Models

### Purchase

Represents an appliance purchased by a specific user.

| Field          | Type     | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| `id`           | `string` | Unique identifier for this purchase record       |
| `userId`       | `string` | Reference to the owning user                     |
| `serialId`     | `string` | Serial number of the purchased appliance         |
| `purchaseDate` | `Date`   | When the appliance was purchased                 |

### MaintenanceRequest

| Field            | Type     | Description                                              |
| ---------------- | -------- | -------------------------------------------------------- |
| `id`             | `string` | Unique identifier for the maintenance request            |
| `userId`         | `string` | Reference to the user requesting service                 |
| `serialId`       | `string` | Serial number of the purchased appliance                 |
| `description`    | `string` | User-provided description of the issue or service needed |
| `preferredDate`  | `Date`   | User's preferred date for the service visit              |
| `status`         | `string` | Current status (see Status Lifecycle below)              |
| `createdAt`      | `Date`   | Timestamp of when the request was created                |
| `updatedAt`      | `Date`   | Timestamp of the last update                             |

### Status Lifecycle

| Status       | Meaning                                                  |
| ------------ | -------------------------------------------------------- |
| `Pending`    | Request has been submitted, awaiting scheduling          |
| `Scheduled`  | A technician has been assigned and a date confirmed      |
| `InProgress` | The technician is actively working on the appliance      |
| `Completed`  | The service has been finished                            |
| `Cancelled`  | The request was cancelled by the user or representative  |

```
Pending → Scheduled → InProgress → Completed
                                  ↘ Cancelled
```

## UI Flow

1. User navigates to the **Request Maintenance** page.
2. User sees a dropdown populated with **only their purchased appliances**.
3. User selects one appliance.
4. User enters a description of the issue or desired service.
5. User picks a preferred service date.
6. User clicks **Submit**.
7. A confirmation message is displayed.
8. The request appears in the **Maintenance List** view with status `Pending`.

## Notes

- Each request covers exactly **one appliance**.
- User-appliance ownership is managed via `Purchase` records (mock-seeded for now).
- The existing `Appliance` catalog and `User` models are reused from the compliance feature.
