# Issues Log

Tracked issues encountered during development and demo testing of the Appliance Service App.

---

## Issue #1: AI Chat Response Too Slow

**Date:** 2026-06-12  
**Severity:** High  
**Status:** ✅ Resolved

### Description

The AI chatbox was unresponsive — messages sent by the user would hang indefinitely with the typing indicator spinning. The backend `/api/chat` endpoint was taking too long to respond.

### Root Cause

The originally configured model (`mistral-small3.2`, 24B parameters / 15GB) was too heavy for local inference. The first request also required loading the full model into GPU memory, compounding the delay (30–60+ seconds per response).

### Resolution

- Switched to a lighter model: `qwen2.5:7b` (~4.7GB) — responds in 2–5 seconds.
- Added a 2-minute timeout on the frontend HTTP call to prevent silent failures.
- Reduced `num-predict` from 1024 to 512 tokens.

---

## Issue #2: AI-Filed Compliance Report Not Visible in UI

**Date:** 2026-06-12  
**Severity:** Medium  
**Status:** ✅ Resolved

### Description

After filing a compliance report via the AI chatbox, navigating to `/compliance` showed an empty list — even though the data was confirmed persisted in the H2 database.

### Root Cause

The Angular services (`ComplianceService`, `MaintenanceService`, `PurchaseService`) used a `loaded` flag that prevented re-fetching after the initial load. Once the service fetched an empty list on first navigation, it never refreshed — so records created externally (via AI tools) were invisible.

### Resolution

- Restored the `if (!this.loaded)` guard in service getters to prevent infinite re-fetching from computed signals.
- Added `ngOnInit()` lifecycle hooks in list components (`ComplianceListComponent`, `MaintenanceListComponent`, `PurchaseListComponent`, `DashboardComponent`) that explicitly call `service.refresh()`.
- This ensures fresh data from the backend on every page navigation without triggering infinite loops.

---

## Issue #3: Serial Number Not Displayed in Compliance List

**Date:** 2026-06-12  
**Severity:** Low  
**Status:** ✅ Resolved

### Description

The compliance report list table at `/compliance` did not display the serial number of the appliance. This made it difficult to identify which specific appliance a report was filed for, especially when multiple appliances share the same name.

### Root Cause

The original table columns only showed: Appliance Name, Reason, Description, Filed By, Status, Created, Updated — no serial number column.

### Resolution

- Added a **Serial** column to the compliance list table displaying the `serialId` in a code-styled badge.
- Removed the less-useful "Filed By" and "Updated" columns to keep the table clean.

---

## Issue #4: Duplicate Compliance Reports Allowed

**Date:** 2026-06-12  
**Severity:** High  
**Status:** ✅ Resolved

### Description

Users (and the AI) could file multiple compliance reports for the same appliance, even when a pending report already existed. This led to duplicate entries cluttering the system.

### Root Cause

No uniqueness validation existed in the `ComplianceService.create()` method — it would unconditionally persist any new report.

### Resolution

- Added `existsBySerialIdAndStatus(String serialId, String status)` to `ComplianceRepository`.
- `ComplianceService.create()` now checks for an existing report with status `Pending` on the same serial; throws `IllegalStateException` if one exists.
- `ComplianceController` returns **409 Conflict** with error message when a duplicate is attempted.
- The AI tool's `catch` block relays the error message to the user naturally.

---

## Issue #5: AI Filed Compliance for Non-Owned Appliance

**Date:** 2026-06-12  
**Severity:** Critical  
**Status:** ✅ Resolved

### Description

The AI model filed a compliance report against an appliance the user had never purchased (or one with an entirely fabricated serial number). There was no validation ensuring the target appliance belonged to the user.

### Root Cause

The `fileCompliance` and `scheduleMaintenance` AI tools did not validate:
1. Whether the appliance serial actually exists in the database.
2. Whether the user owns (has purchased) the appliance.

The model would sometimes hallucinate serial numbers or pick appliances from the full catalog rather than the user's purchases.

### Resolution

Both `fileCompliance` and `scheduleMaintenance` tools now enforce two validations before persisting:

1. **Appliance must exist** — `applianceService.findBySerial()` must return a result.
2. **User must own it** — The serial must appear in the user's purchase records.

If either check fails, a clear error is returned to the AI model, which then informs the user they can only act on their purchased appliances.

---

## Issue #6: Infinite HTTP Requests on Dashboard

**Date:** 2026-06-12  
**Severity:** Critical  
**Status:** ✅ Resolved

### Description

Opening the Dashboard page triggered thousands of HTTP requests to the backend in rapid succession, freezing the browser and flooding the server.

### Root Cause

The initial fix for Issue #2 removed the `loaded` guard from service getters (`getCompliances()`, `getRequests()`, etc.), making them always call `refresh()`. However, these getters are invoked inside Angular `computed()` signals in the Dashboard. The cycle was:

1. `computed()` evaluates → calls `getCompliances()` → calls `refresh()`
2. `refresh()` updates the signal with new data
3. Signal change triggers `computed()` to re-evaluate → back to step 1
4. Infinite loop of HTTP requests

### Resolution

- **Restored** the `if (!this.loaded)` guard in all service getters — safe for computed signals.
- **Added `ngOnInit()`** in each list/dashboard component that explicitly calls `service.refresh()`.
- This approach ensures: (a) no infinite loops from computed signals, (b) fresh data every time a component mounts (page navigation).

---

## Summary

| # | Issue | Severity | Category |
|---|-------|----------|----------|
| 1 | AI Chat too slow | High | Performance |
| 2 | AI-filed data not visible in UI | Medium | Caching / State |
| 3 | Serial number missing from list | Low | UI / UX |
| 4 | Duplicate compliance reports | High | Validation |
| 5 | AI filed report for non-owned appliance | Critical | Authorization / AI Safety |
| 6 | Infinite HTTP requests on Dashboard | Critical | State / Reactivity |

All issues were identified during hands-on testing on **June 12, 2026** and resolved in the same session.
