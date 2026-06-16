import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Compliance,
  ComplianceReason,
  ComplianceStatus,
} from '../models/compliance';

const API = 'http://localhost:8080/api/compliances';

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  private readonly http = inject(HttpClient);
  private readonly compliances = signal<Compliance[]>([]);
  private loaded = false;

  getCompliances() {
    if (!this.loaded) {
      this.refresh();
    }
    return this.compliances.asReadonly();
  }

  fileCompliance(
    serialId: string,
    userId: string,
    reason: ComplianceReason,
    description: string,
  ): void {
    this.http
      .post<Compliance>(API, { serialId, userId, reason, description })
      .subscribe((created) => {
        this.compliances.update((list) => [...list, created]);
      });
  }

  updateStatus(id: string, status: ComplianceStatus): void {
    this.http
      .patch<Compliance>(`${API}/${id}/status`, { status })
      .subscribe((updated) => {
        this.compliances.update((list) =>
          list.map((c) => (c.id === id ? updated : c)),
        );
      });
  }

  refresh(): void {
    this.loaded = true;
    this.http.get<Compliance[]>(API).subscribe((data) => {
      this.compliances.set(data);
    });
  }
}
