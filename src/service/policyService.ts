import { api } from './api';

// Define policy-related types
export interface Policy {
  id: string;
  policyNumber: string;
  propertyId: string;
  userId: string;
  policyType: string;
  coverageAmount: number;
  premium: number;
  status: 'active' | 'inactive' | 'pending' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  coverageDetails: {
    buildingCoverage?: number;
    contentsCoverage?: number;
    liabilityCoverage?: number;
    deductible: number;
  };
  property?: {
    id: string;
    address: string;
    propertyType: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreatePolicyRequest {
  propertyId: string;
  userId: string;
  policyType: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  coverageDetails: {
    buildingCoverage?: number;
    contentsCoverage?: number;
    liabilityCoverage?: number;
    deductible: number;
  };
}

export interface UpdatePolicyRequest {
  id: string;
  policyType?: string;
  coverageAmount?: number;
  premium?: number;
  status?: Policy['status'];
  startDate?: string;
  endDate?: string;
  coverageDetails?: Partial<Policy['coverageDetails']>;
}

export interface PoliciesListResponse {
  policies: Policy[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PoliciesListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Policy['status'];
  policyType?: string;
  userId?: string;
  propertyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface PolicyQuoteRequest {
  propertyId: string;
  coverageAmount: number;
  policyType: string;
  coverageDetails: {
    buildingCoverage?: number;
    contentsCoverage?: number;
    liabilityCoverage?: number;
    deductible: number;
  };
}

export interface PolicyQuoteResponse {
  estimatedPremium: number;
  breakdown: {
    basePremium: number;
    riskAdjustment: number;
    taxes: number;
    fees: number;
  };
  validUntil: string;
}

// Inject endpoints into the main API slice
export const policyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all policies with pagination and filtering
    getPolicies: builder.query<PoliciesListResponse, PoliciesListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.policyType) searchParams.append('policyType', params.policyType);
        if (params?.userId) searchParams.append('userId', params.userId);
        if (params?.propertyId) searchParams.append('propertyId', params.propertyId);
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params?.startDate) searchParams.append('startDate', params.startDate);
        if (params?.endDate) searchParams.append('endDate', params.endDate);

        return `/policies?${searchParams.toString()}`;
      },
      providesTags: ['Policy'],
    }),

    // Get policy by ID
    getPolicyById: builder.query<Policy, string>({
      query: (id) => `/policies/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Policy', id }],
    }),

    // Create new policy
    createPolicy: builder.mutation<Policy, CreatePolicyRequest>({
      query: (policyData) => ({
        url: '/policies',
        method: 'POST',
        body: policyData,
      }),
      invalidatesTags: ['Policy'],
    }),

    // Update policy
    updatePolicy: builder.mutation<Policy, UpdatePolicyRequest>({
      query: ({ id, ...policyData }) => ({
        url: `/policies/${id}`,
        method: 'PUT',
        body: policyData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Policy', id },
        'Policy',
      ],
    }),

    // Cancel policy
    cancelPolicy: builder.mutation<Policy, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/policies/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Policy', id },
        'Policy',
      ],
    }),

    // Renew policy
    renewPolicy: builder.mutation<Policy, { id: string; endDate: string; premium?: number }>({
      query: ({ id, ...renewalData }) => ({
        url: `/policies/${id}/renew`,
        method: 'PATCH',
        body: renewalData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Policy', id },
        'Policy',
      ],
    }),

    // Get policy quote
    getPolicyQuote: builder.mutation<PolicyQuoteResponse, PolicyQuoteRequest>({
      query: (quoteData) => ({
        url: '/policies/quote',
        method: 'POST',
        body: quoteData,
      }),
    }),

    // Get policies by user ID
    getPoliciesByUser: builder.query<Policy[], string>({
      query: (userId) => `/policies/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Policy', id: `user-${userId}` }],
    }),

    // Get policies by property ID
    getPoliciesByProperty: builder.query<Policy[], string>({
      query: (propertyId) => `/policies/property/${propertyId}`,
      providesTags: (_result, _error, propertyId) => [{ type: 'Policy', id: `property-${propertyId}` }],
    }),

    // Get policy types
    getPolicyTypes: builder.query<string[], void>({
      query: () => '/policies/types',
    }),

    // Get policy statistics
    getPolicyStats: builder.query<{
      totalPolicies: number;
      activePolicies: number;
      pendingPolicies: number;
      expiredPolicies: number;
      totalPremium: number;
      averagePremium: number;
    }, void>({
      query: () => '/policies/stats',
      providesTags: ['Policy'],
    }),

    // Bulk update policies
    bulkUpdatePolicies: builder.mutation<{ updated: number }, { policyIds: string[]; updates: Partial<Policy> }>({
      query: (data) => ({
        url: '/policies/bulk',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Policy'],
    }),

    // Export policies data
    exportPolicies: builder.mutation<Blob, PoliciesListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.policyType) searchParams.append('policyType', params.policyType);
        if (params?.startDate) searchParams.append('startDate', params.startDate);
        if (params?.endDate) searchParams.append('endDate', params.endDate);

        return {
          url: `/policies/export?${searchParams.toString()}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useCancelPolicyMutation,
  useRenewPolicyMutation,
  useGetPolicyQuoteMutation,
  useGetPoliciesByUserQuery,
  useGetPoliciesByPropertyQuery,
  useGetPolicyTypesQuery,
  useGetPolicyStatsQuery,
  useBulkUpdatePoliciesMutation,
  useExportPoliciesMutation,
} = policyApi;