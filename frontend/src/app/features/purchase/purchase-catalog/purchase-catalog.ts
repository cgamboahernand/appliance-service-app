import { Component, computed, inject, signal } from '@angular/core';
import { ApplianceService } from '../../../services/appliance.service';
import { PurchaseService } from '../../../services/purchase.service';

@Component({
  selector: 'app-purchase-catalog',
  imports: [],
  templateUrl: './purchase-catalog.html',
  styleUrl: './purchase-catalog.scss',
})
export class PurchaseCatalogComponent {
  private readonly applianceService = inject(ApplianceService);
  private readonly purchaseService = inject(PurchaseService);

  readonly currentUserId = 'user-1';
  readonly lastPurchased = signal<string | null>(null);

  readonly catalog = computed(() =>
    this.applianceService.getAppliances()().map((a) => ({
      ...a,
      available: this.purchaseService.isAvailable(a.serial),
    })),
  );

  onPurchase(serial: string): void {
    this.purchaseService.purchase(this.currentUserId, serial);
    this.lastPurchased.set(serial);
  }
}
