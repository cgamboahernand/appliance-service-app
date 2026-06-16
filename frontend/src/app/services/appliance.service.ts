import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appliance } from '../models/appliance';

const API = 'http://localhost:8080/api/appliances';

@Injectable({ providedIn: 'root' })
export class ApplianceService {
  private readonly http = inject(HttpClient);
  private readonly appliances = signal<Appliance[]>([]);
  private loaded = false;

  getAppliances() {
    if (!this.loaded) {
      this.refresh();
    }
    return this.appliances.asReadonly();
  }

  getById(id: string): Appliance | undefined {
    if (!this.loaded) this.refresh();
    return this.appliances().find((a) => a.id === id);
  }

  getBySerial(serial: string): Appliance | undefined {
    if (!this.loaded) this.refresh();
    return this.appliances().find((a) => a.serial === serial);
  }

  refresh(): void {
    this.loaded = true;
    this.http.get<Appliance[]>(API).subscribe((data) => {
      this.appliances.set(data);
    });
  }
}
