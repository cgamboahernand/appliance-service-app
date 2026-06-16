import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseService } from '../../services/purchase.service';
import { MaintenanceService } from '../../services/maintenance.service';
import { ComplianceService } from '../../services/compliance.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly complianceService = inject(ComplianceService);
  private readonly router = inject(Router);

  readonly currentUserId = 'user-1';

  readonly purchasedCount = computed(
    () => this.purchaseService.getByUserId(this.currentUserId)().length,
  );

  readonly maintenanceCount = computed(
    () =>
      this.maintenanceService
        .getRequests()()
        .filter((r) => r.userId === this.currentUserId).length,
  );

  readonly complianceCount = computed(
    () =>
      this.complianceService
        .getCompliances()()
        .filter((c) => c.userId === this.currentUserId).length,
  );

  ngOnInit(): void {
    this.purchaseService.refresh();
    this.maintenanceService.refresh();
    this.complianceService.refresh();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
