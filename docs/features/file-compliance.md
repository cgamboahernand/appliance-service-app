# Feature: File Appliance Compliance

## Summary

Allow users to file a compliance report when an appliance malfunctions. The user selects an appliance and describes the issue to submit a compliance record.

## User Story

As a **user**, I want to **file a compliance report for a malfunctioning appliance**, so that **the issue is formally recorded and can be tracked for resolution**.

## Acceptance Criteria

- [ ] User can see a list of available appliances (id, name, description).
- [ ] User can select an appliance to file a compliance against.
- [ ] User can identify themselves (select or enter user info).
- [ ] User can select a reason for the compliance (`Malfunction` or `Broken`).
- [ ] User can enter a description of the issue.
- [ ] User can submit the compliance form.
- [ ] Form validates that an appliance, user, reason, and description are provided before submission.
- [ ] On submission, the compliance is created with status `Pending` and timestamps (`createdAt`, `updatedAt`) set automatically.
- [ ] After successful submission, the user sees a confirmation message.
- [ ] The filed compliance is stored and visible in a compliance list.

## Data Models

### User

| Field  | Type     | Description                    |
| ------ | -------- | ------------------------------ |
| `id`   | `string` | Unique identifier for the user |
| `name` | `string` | Display name of the user       |

### Appliance

| Field         | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| `id`          | `string` | Unique identifier for the appliance |
| `name`        | `string` | Display name of the appliance       |
| `description` | `string` | Brief description of the appliance  |

### Compliance

| Field          | Type        | Description                                              |
| -------------- | ----------- | -------------------------------------------------------- |
| `id`           | `string`    | Unique identifier for the compliance record              |
| `applianceId`  | `string`    | Reference to the appliance                               |
| `userId`       | `string`    | Reference to the user who filed it                       |
| `reason`       | `string`    | Why the compliance was filed (`Malfunction` or `Broken`) |
| `description`  | `string`    | User-provided description of the issue                   |
| `status`       | `string`    | Current status (see Status Lifecycle below)               |
| `createdAt`    | `Date`      | Timestamp of when the compliance was created             |
| `updatedAt`    | `Date`      | Timestamp of the last update                             |

### Status Lifecycle

| Status     | Meaning                                                    |
| ---------- | ---------------------------------------------------------- |
| `Pending`  | Compliance has been filed but not yet reviewed              |
| `Reviewed` | A representative has reviewed the issue                    |
| `Assigned` | The issue has been assigned to someone for resolution      |
| `Closed`   | The issue has been attended to and resolved                |

```
Pending → Reviewed → Assigned → Closed
```

## UI Flow

1. User navigates to the **File Compliance** page.
2. User selects an appliance from a dropdown or list.
3. User selects a reason (`Malfunction` or `Broken`).
4. User enters a description of the issue.
5. User clicks **Submit**.
6. A confirmation message is displayed.
7. The compliance appears in the **Compliance List** view with status `Pending`.

## Notes

- For now, data will be managed in-memory (no backend API).
- Appliance data can be seeded with mock/static entries.
