# Feature: Dashboard

## Summary

Provide a home page dashboard that gives the user an at-a-glance overview of their activity: purchased products, maintenance requests, and compliance issues reported.

## User Story

As a **user**, I want to **see a dashboard when I open the app**, so that **I can quickly understand my current appliance status, open requests, and reported issues**.

## Acceptance Criteria

- [ ] Dashboard is the default home page (`/`).
- [ ] Displays a summary card showing the total number of **purchased products**.
- [ ] Displays a summary card showing the total number of **maintenance requests**.
- [ ] Displays a summary card showing the total number of **compliance issues reported**.
- [ ] Each card is clickable and navigates to the corresponding list view.
- [ ] Data is scoped to the current user.

## UI Flow

1. User opens the app or navigates to `/`.
2. User sees three summary cards: Purchased Products, Maintenance Requests, Issues Reported.
3. User clicks a card to navigate to the relevant list.

## Notes

- The dashboard reads from the existing `PurchaseService`, `MaintenanceService`, and `ComplianceService`.
- No new data models are needed.
