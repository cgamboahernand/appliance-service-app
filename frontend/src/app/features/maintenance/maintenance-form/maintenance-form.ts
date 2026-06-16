import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplianceService } from '../../../services/appliance.service';
import { PurchaseService } from '../../../services/purchase.service';
import { MaintenanceService } from '../../../services/maintenance.service';

@Component({
  selector: 'app-maintenance-form',
  imports: [FormsModule],
  templateUrl: './maintenance-form.html',
  styleUrl: './maintenance-form.scss',
})
export class MaintenanceFormComponent {
  private readonly applianceService = inject(ApplianceService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly router = inject(Router);

  readonly submitted = signal(false);

  // For now, simulate a logged-in user
  readonly currentUserId = 'user-1';

  readonly purchasedAppliances = computed(() => {
    const purchases = this.purchaseService.getByUserId(this.currentUserId)();
    return purchases.map((p) => {
      const appliance = this.applianceService.getBySerial(p.serialId);
      return {
        serialId: p.serialId,
        name: appliance?.name ?? 'Unknown',
        description: appliance?.description ?? '',
        serial: p.serialId,
        purchaseDate: p.purchaseDate,
      };
    });
  });

  serialId = '';
  description = '';
  preferredDate = '';

  get isValid(): boolean {
    return !!(
      this.serialId &&
      this.description.trim() &&
      this.preferredDate
    );
  }

  onSubmit(): void {
    if (!this.isValid) return;

    this.maintenanceService.createRequest(
      this.currentUserId,
      this.serialId,
      this.description.trim(),
      new Date(this.preferredDate),
    );

    this.submitted.set(true);
  }

  goToList(): void {
    this.router.navigate(['/maintenance']);
  }
}
