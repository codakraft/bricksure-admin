export type UserRole = 
  | 'super-admin'
  | 'underwriter'
  | 'finance-admin'
  | 'compliance-officer'
  | 'support-agent'
  | 'content-ops'
  | 'claims-manager'
  | 'risk-analyst'
  | 'data-analyst'
  | 'devops-admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department: string;
  lastLogin: string;
  mfaEnabled: boolean;
}

export interface Right {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  rights: string[];
  createdBy: string;
  createdAt: string;
  isSystem: boolean;
}

export interface MakerCheckerRequest {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  checkedBy?: string;
  checkedAt?: string;
  reason?: string;
  data: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ApplicationReview {
  id: string;
  applicationId: string;
  reviewerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'amended';
  fieldReviews: FieldReview[];
  overallComments: string;
  reviewedAt: string;
  makerCheckerId?: string;
}