import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';

interface ChatRequest {
  sessionId: string;
  message: string;
}

interface ChatResponse {
  message: string;
}

const API = 'http://localhost:8080/api/chat';
const CHAT_TIMEOUT_MS = 120_000; // 2 minutes — LLM can be slow on first load

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  readonly sessionId = crypto.randomUUID();

  sendMessage(message: string): Observable<string> {
    return this.http
      .post<ChatResponse>(API, {
        sessionId: this.sessionId,
        message,
      } as ChatRequest)
      .pipe(
        timeout(CHAT_TIMEOUT_MS),
        map((res) => res.message),
      );
  }

  clearSession(): void {
    this.http.delete(`${API}/${this.sessionId}`).subscribe();
  }
}
