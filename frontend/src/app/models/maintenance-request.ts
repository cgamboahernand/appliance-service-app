export type MaintenanceStatus =
  | 'Pending'
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

export interface MaintenanceRequest {
  id: string;
  userId: string;
  serialId: string;
  description: string;
  preferredDate: Date;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}
