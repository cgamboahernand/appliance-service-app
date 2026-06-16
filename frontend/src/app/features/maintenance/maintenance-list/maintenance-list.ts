import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApplianceService } from '../../../services/appliance.service';
import { MaintenanceService } from '../../../services/maintenance.service';

@Component({
  selector: 'app-maintenance-list',
  imports: [DatePipe],
  templateUrl: './maintenance-list.html',
  styleUrl: './maintenance-list.scss',
})
export class MaintenanceListComponent implements OnInit {
  private readonly applianceService = inject(ApplianceService);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly router = inject(Router);

  readonly requests = this.maintenanceService.getRequests();

  readonly rows = computed(() =>
    this.requests().map((r) => ({
      ...r,
      applianceName:
        this.applianceService.getBySerial(r.serialId)?.name ?? 'Unknown',
    })),
  );

  ngOnInit(): void {
    this.maintenanceService.refresh();
  }

  requestNew(): void {
    this.router.navigate(['/maintenance/new']);
  }

  statusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
