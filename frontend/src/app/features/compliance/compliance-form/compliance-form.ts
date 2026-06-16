import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplianceService } from '../../../services/appliance.service';
import { PurchaseService } from '../../../services/purchase.service';
import { ComplianceService } from '../../../services/compliance.service';
import { ComplianceReason } from '../../../models/compliance';

@Component({
  selector: 'app-compliance-form',
  imports: [FormsModule],
  templateUrl: './compliance-form.html',
  styleUrl: './compliance-form.scss',
})
export class ComplianceFormComponent {
  private readonly applianceService = inject(ApplianceService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly complianceService = inject(ComplianceService);
  private readonly router = inject(Router);

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
      };
    });
  });

  readonly submitted = signal(false);

  serialId = '';
  userName = '';
  reason: ComplianceReason | '' = '';
  description = '';

  get isValid(): boolean {
    return !!(
      this.serialId &&
      this.userName.trim() &&
      this.reason &&
      this.description.trim()
    );
  }

  onSubmit(): void {
    if (!this.isValid) return;

    this.complianceService.fileCompliance(
      this.serialId,
      this.userName.trim(),
      this.reason as ComplianceReason,
      this.description.trim(),
    );

    this.submitted.set(true);
  }

  goToList(): void {
    this.router.navigate(['/compliance']);
  }
}
