import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplianceService } from '../../../services/appliance.service';
import { ComplianceService } from '../../../services/compliance.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compliance-list',
  imports: [DatePipe],
  templateUrl: './compliance-list.html',
  styleUrl: './compliance-list.scss',
})
export class ComplianceListComponent implements OnInit {
  private readonly applianceService = inject(ApplianceService);
  private readonly complianceService = inject(ComplianceService);
  private readonly router = inject(Router);

  readonly compliances = this.complianceService.getCompliances();

  readonly rows = computed(() =>
    this.compliances().map((c) => ({
      ...c,
      applianceName:
        this.applianceService.getBySerial(c.serialId)?.name ?? 'Unknown',
    })),
  );

  ngOnInit(): void {
    this.complianceService.refresh();
  }

  fileNew(): void {
    this.router.navigate(['/compliance/new']);
  }

  statusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
