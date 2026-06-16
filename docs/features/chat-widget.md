# Feature: AI Chat Widget

## Summary

Provide a floating chat widget in the bottom-right corner of the app where users can describe their appliance issues to an AI assistant. The UI is built now; the AI model integration will come later.

## User Story

As a **user**, I want to **chat with an AI assistant about my appliance issues**, so that **I can get quick guidance or describe problems before filing a formal report**.

## Acceptance Criteria

- [ ] A floating chat button is visible in the bottom-right corner on all pages.
- [ ] Clicking the button opens a chat panel.
- [ ] User can type a message and send it by pressing Enter or clicking Send.
- [ ] Sent messages appear on the right side of the chat (user bubble).
- [ ] A mock AI response appears on the left side (assistant bubble).
- [ ] The chat panel can be closed by clicking the close button.
- [ ] Chat history persists while the panel is open during the session.
- [ ] The chat panel does not block navigation to other pages.

## UI Flow

1. User sees a floating chat icon (💬) in the bottom-right corner.
2. User clicks the icon — a chat panel slides up.
3. User types a message and presses Enter or clicks Send.
4. The message appears as a user bubble.
5. A mock AI response appears after a brief delay.
6. User can close the panel by clicking the ✕ button.

## Notes

- No AI model integration yet — responses are stubbed/mocked.
- The widget is a global component rendered in the app shell, not tied to any route.
- Chat state is in-memory only (resets on page reload).
