import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApplianceService } from '../../../services/appliance.service';
import { PurchaseService } from '../../../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  imports: [DatePipe],
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.scss',
})
export class PurchaseListComponent implements OnInit {
  private readonly applianceService = inject(ApplianceService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly router = inject(Router);

  readonly currentUserId = 'user-1';

  readonly rows = computed(() => {
    const purchases = this.purchaseService.getByUserId(this.currentUserId)();
    return purchases.map((p) => {
      const appliance = this.applianceService.getBySerial(p.serialId);
      return {
        id: p.id,
        serial: p.serialId,
        name: appliance?.name ?? 'Unknown',
        description: appliance?.description ?? '',
        purchaseDate: p.purchaseDate,
      };
    });
  });

  ngOnInit(): void {
    this.purchaseService.refresh();
    this.applianceService.refresh();
  }

  goToCatalog(): void {
    this.router.navigate(['/purchase']);
  }
}
