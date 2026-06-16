# Spec: Chat Widget

## Overview

A floating chat widget rendered globally in the app shell. It manages a list of chat messages and provides a text input for the user. AI responses are mocked for now.

## Model

### `src/app/models/chat-message.ts`

```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## Component

### `ChatWidgetComponent` — `src/app/features/chat/chat-widget/`

- Rendered in `app.html` alongside `<router-outlet>` (not routed).
- Floating button in the bottom-right corner toggles the chat panel.
- Manages an in-memory `messages: Signal<ChatMessage[]>`.
- On send: pushes user message, then appends a mock assistant response after a short delay.
- Auto-scrolls to the latest message.

## Folder Structure

```
src/app/
  models/
    chat-message.ts
  features/
    chat/
      chat-widget/
        chat-widget.ts
        chat-widget.html
        chat-widget.scss
        chat-widget.spec.ts
```

## Testing

- **ChatWidgetComponent**: Verify panel toggles open/closed; sending a message adds a user bubble; a mock response appears; closing resets visibility but keeps messages.
