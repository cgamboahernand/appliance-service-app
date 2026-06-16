export type ComplianceReason = 'Malfunction' | 'Broken';
export type ComplianceStatus = 'Pending' | 'Reviewed' | 'Assigned' | 'Closed';

export interface Compliance {
  id: string;
  serialId: string;
  userId: string;
  reason: ComplianceReason;
  description: string;
  status: ComplianceStatus;
  createdAt: Date;
  updatedAt: Date;
}
