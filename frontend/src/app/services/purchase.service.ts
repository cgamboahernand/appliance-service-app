import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../models/purchase';

const API = 'http://localhost:8080/api/purchases';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private readonly http = inject(HttpClient);
  private readonly purchases = signal<Purchase[]>([]);
  private loaded = false;

  getPurchases() {
    if (!this.loaded) {
      this.refresh();
    }
    return this.purchases.asReadonly();
  }

  getByUserId(userId: string) {
    if (!this.loaded) {
      this.refresh();
    }
    return computed(() =>
      this.purchases().filter((p) => p.userId === userId),
    );
  }

  purchase(userId: string, serialId: string): void {
    this.http
      .post<Purchase>(API, { userId, serialId })
      .subscribe((created) => {
        this.purchases.update((list) => [...list, created]);
      });
  }

  isAvailable(serialId: string): boolean {
    if (!this.loaded) this.refresh();
    return !this.purchases().some((p) => p.serialId === serialId);
  }

  refresh(): void {
    this.loaded = true;
    this.http.get<Purchase[]>(API).subscribe((data) => {
      this.purchases.set(data);
    });
  }
}
