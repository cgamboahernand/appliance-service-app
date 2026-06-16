import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MaintenanceRequest,
  MaintenanceStatus,
} from '../models/maintenance-request';

const API = 'http://localhost:8080/api/maintenance';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly http = inject(HttpClient);
  private readonly requests = signal<MaintenanceRequest[]>([]);
  private loaded = false;

  getRequests() {
    if (!this.loaded) {
      this.refresh();
    }
    return this.requests.asReadonly();
  }

  createRequest(
    userId: string,
    serialId: string,
    description: string,
    preferredDate: Date,
  ): void {
    const body = {
      userId,
      serialId,
      description,
      preferredDate: preferredDate.toISOString().split('T')[0],
    };

    this.http
      .post<MaintenanceRequest>(API, body)
      .subscribe((created) => {
        this.requests.update((list) => [...list, created]);
      });
  }

  updateStatus(id: string, status: MaintenanceStatus): void {
    this.http
      .patch<MaintenanceRequest>(`${API}/${id}/status`, { status })
      .subscribe((updated) => {
        this.requests.update((list) =>
          list.map((r) => (r.id === id ? updated : r)),
        );
      });
  }

  refresh(): void {
    this.loaded = true;
    this.http.get<MaintenanceRequest[]>(API).subscribe((data) => {
      this.requests.set(data);
    });
  }
}
