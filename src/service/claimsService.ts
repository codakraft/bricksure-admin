import { api } from './api';

// Define claims-related types
export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  propertyId: string;
  claimType: 'fire' | 'water' | 'theft' | 'vandalism' | 'weather' | 'liability' | 'other';
  status: 'submitted' | 'under-review' | 'investigating' | 'approved' | 'denied' | 'closed' | 'settled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  incidentDate: string;
  reportedDate: string;
  description: string;
  estimatedAmount: number;
  approvedAmount?: number;
  settledAmount?: number;
  deductible: number;
  adjusterId?: string;
  createdAt: string;
  updatedAt: string;
  policy?: {
    id: string;
    policyNumber: string;
    policyType: string;
  };
  property?: {
    id: string;
    address: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  adjuster?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  notes?: Array<{
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
  }>;
}

export interface CreateClaimRequest {
  policyId: string;
  claimType: Claim['claimType'];
  incidentDate: string;
  description: string;
  estimatedAmount: number;
  priority?: Claim['priority'];
}

export interface UpdateClaimRequest {
  id: string;
  status?: Claim['status'];
  priority?: Claim['priority'];
  description?: string;
  estimatedAmount?: number;
  approvedAmount?: number;
  settledAmount?: number;
  adjusterId?: string;
}

export interface ClaimsListResponse {
  claims: Claim[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ClaimsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Claim['status'];
  claimType?: Claim['claimType'];
  priority?: Claim['priority'];
  userId?: string;
  policyId?: string;
  adjusterId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClaimNote {
  content: string;
  isInternal?: boolean;
}

export interface ClaimAssignment {
  claimId: string;
  adjusterId: string;
}

export interface ClaimStatusUpdate {
  claimId: string;
  status: Claim['status'];
  reason?: string;
  amount?: number;
}

// Inject endpoints into the main API slice
export const claimApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all claims with pagination and filtering
    getClaims: builder.query<ClaimsListResponse, ClaimsListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.claimType) searchParams.append('claimType', params.claimType);
        if (params?.priority) searchParams.append('priority', params.priority);
        if (params?.userId) searchParams.append('userId', params.userId);
        if (params?.policyId) searchParams.append('policyId', params.policyId);
        if (params?.adjusterId) searchParams.append('adjusterId', params.adjusterId);
        if (params?.startDate) searchParams.append('startDate', params.startDate);
        if (params?.endDate) searchParams.append('endDate', params.endDate);
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        return `/claims?${searchParams.toString()}`;
      },
      providesTags: ['Claim'],
    }),

    // Get claim by ID
    getClaimById: builder.query<Claim, string>({
      query: (id) => `/claims/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Claim', id }],
    }),

    // Create new claim
    createClaim: builder.mutation<Claim, CreateClaimRequest>({
      query: (claimData) => ({
        url: '/claims',
        method: 'POST',
        body: claimData,
      }),
      invalidatesTags: ['Claim'],
    }),

    // Update claim
    updateClaim: builder.mutation<Claim, UpdateClaimRequest>({
      query: ({ id, ...claimData }) => ({
        url: `/claims/${id}`,
        method: 'PUT',
        body: claimData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Claim', id },
        'Claim',
      ],
    }),

    // Update claim status
    updateClaimStatus: builder.mutation<Claim, ClaimStatusUpdate>({
      query: ({ claimId, ...statusData }) => ({
        url: `/claims/${claimId}/status`,
        method: 'PATCH',
        body: statusData,
      }),
      invalidatesTags: (_result, _error, { claimId }) => [
        { type: 'Claim', id: claimId },
        'Claim',
      ],
    }),

    // Assign claim to adjuster
    assignClaim: builder.mutation<Claim, ClaimAssignment>({
      query: ({ claimId, adjusterId }) => ({
        url: `/claims/${claimId}/assign`,
        method: 'PATCH',
        body: { adjusterId },
      }),
      invalidatesTags: (_result, _error, { claimId }) => [
        { type: 'Claim', id: claimId },
        'Claim',
      ],
    }),

    // Add note to claim
    addClaimNote: builder.mutation<Claim, { claimId: string } & ClaimNote>({
      query: ({ claimId, ...noteData }) => ({
        url: `/claims/${claimId}/notes`,
        method: 'POST',
        body: noteData,
      }),
      invalidatesTags: (_result, _error, { claimId }) => [
        { type: 'Claim', id: claimId },
      ],
    }),

    // Upload claim documents
    uploadClaimDocuments: builder.mutation<{ documents: Claim['documents'] }, { claimId: string; formData: FormData }>({
      query: ({ claimId, formData }) => ({
        url: `/claims/${claimId}/documents`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { claimId }) => [
        { type: 'Claim', id: claimId },
      ],
    }),

    // Get claims by user ID
    getClaimsByUser: builder.query<Claim[], string>({
      query: (userId) => `/claims/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Claim', id: `user-${userId}` }],
    }),

    // Get claims by policy ID
    getClaimsByPolicy: builder.query<Claim[], string>({
      query: (policyId) => `/claims/policy/${policyId}`,
      providesTags: (_result, _error, policyId) => [{ type: 'Claim', id: `policy-${policyId}` }],
    }),

    // Get claims by adjuster ID
    getClaimsByAdjuster: builder.query<Claim[], string>({
      query: (adjusterId) => `/claims/adjuster/${adjusterId}`,
      providesTags: (_result, _error, adjusterId) => [{ type: 'Claim', id: `adjuster-${adjusterId}` }],
    }),

    // Get claim types
    getClaimTypes: builder.query<string[], void>({
      query: () => '/claims/types',
    }),

    // Get available adjusters
    getAdjusters: builder.query<Array<{ id: string; name: string; email: string; activeClaimsCount: number }>, void>({
      query: () => '/claims/adjusters',
    }),

    // Get claim statistics
    getClaimStats: builder.query<{
      totalClaims: number;
      pendingClaims: number;
      approvedClaims: number;
      deniedClaims: number;
      totalClaimAmount: number;
      averageClaimAmount: number;
      averageProcessingTime: number;
      claimTypeDistribution: Record<string, number>;
    }, void>({
      query: () => '/claims/stats',
      providesTags: ['Claim'],
    }),

    // Bulk update claims
    bulkUpdateClaims: builder.mutation<{ updated: number }, { claimIds: string[]; updates: Partial<Claim> }>({
      query: (data) => ({
        url: '/claims/bulk',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Claim'],
    }),

    // Export claims data
    exportClaims: builder.mutation<Blob, ClaimsListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.claimType) searchParams.append('claimType', params.claimType);
        if (params?.priority) searchParams.append('priority', params.priority);
        if (params?.startDate) searchParams.append('startDate', params.startDate);
        if (params?.endDate) searchParams.append('endDate', params.endDate);

        return {
          url: `/claims/export?${searchParams.toString()}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    // Get claim timeline/history
    getClaimTimeline: builder.query<Array<{
      id: string;
      action: string;
      description: string;
      performedBy: string;
      performedAt: string;
      metadata?: Record<string, unknown>;
    }>, string>({
      query: (claimId) => `/claims/${claimId}/timeline`,
      providesTags: (_result, _error, claimId) => [{ type: 'Claim', id: `${claimId}-timeline` }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetClaimsQuery,
  useGetClaimByIdQuery,
  useCreateClaimMutation,
  useUpdateClaimMutation,
  useUpdateClaimStatusMutation,
  useAssignClaimMutation,
  useAddClaimNoteMutation,
  useUploadClaimDocumentsMutation,
  useGetClaimsByUserQuery,
  useGetClaimsByPolicyQuery,
  useGetClaimsByAdjusterQuery,
  useGetClaimTypesQuery,
  useGetAdjustersQuery,
  useGetClaimStatsQuery,
  useBulkUpdateClaimsMutation,
  useExportClaimsMutation,
  useGetClaimTimelineQuery,
} = claimApi;