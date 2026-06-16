import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { ChatMessage } from '../../../models/chat-message';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss',
})
export class ChatWidgetComponent {
  private readonly chatService = inject(ChatService);

  readonly isOpen = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly isTyping = signal(false);

  private readonly messagesContainer =
    viewChild<ElementRef<HTMLElement>>('messagesContainer');

  inputText = '';

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.isTyping()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.inputText = '';
    this.scrollToBottom();

    this.isTyping.set(true);
    this.chatService.sendMessage(text).subscribe({
      next: (content) => {
        const response: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          timestamp: new Date(),
        };
        this.messages.update((msgs) => [...msgs, response]);
        this.isTyping.set(false);
        this.scrollToBottom();
      },
      error: () => {
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        this.messages.update((msgs) => [...msgs, errorMsg]);
        this.isTyping.set(false);
        this.scrollToBottom();
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer()?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  renderMarkdown(content: string): string {
    return marked.parse(content, { async: false }) as string;
  }
}
