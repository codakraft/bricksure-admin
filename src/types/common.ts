export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export type Status = 'draft' | 'submitted' | 'underwriting' | 'approved' | 'active' | 'suspended' | 'cancelled' | 'expired';
export type Status = 'draft' | 'submitted' | 'underwriting' | 'approved' | 'active' | 'suspended' | 'cancelled' | 'expired' | 'under-review' | 'rejected' | 'amended' | 'pending' | 'failed' | 'flagged' | 'investigating';

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, { before: any; after: any }>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface FieldReview {
  fieldName: string;
  fieldValue: any;
  status: 'approved' | 'rejected' | 'amended';
  comments: string;
  suggestedValue?: any;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  propertyId: string;
  propertyAddress: string;
  applicationData: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      dateOfBirth: string;
      occupation: string;
    };
    propertyInfo: {
      address: string;
      propertyType: string;
      constructionYear: string;
      constructionMaterial: string;
      roofType: string;
      numberOfFloors: number;
      estimatedValue: number;
    };
    coverageInfo: {
      coverageType: string;
      sumInsured: number;
      excess: number;
      riders: string[];
    };
    documents: {
      propertyPhotos: string[];
      identityDocument: string;
      proofOfOwnership: string;
      valuationReport?: string;
    };
  };
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'amended';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  premium?: number;
  certificateIssued?: boolean;
}