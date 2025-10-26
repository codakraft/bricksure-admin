import { api } from './api';

// Define property-related types
export interface Property {
  id: string;
  ownerId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'residential' | 'commercial' | 'industrial' | 'mixed-use';
  buildingType: string;
  yearBuilt: number;
  squareFootage: number;
  bedrooms?: number;
  bathrooms?: number;
  floors: number;
  hasBasement: boolean;
  hasGarage: boolean;
  hasPool: boolean;
  constructionMaterial: string;
  roofType: string;
  heatingType: string;
  coolingType: string;
  electricalSystem: string;
  plumbingSystem: string;
  marketValue: number;
  purchasePrice: number;
  purchaseDate: string;
  status: 'active' | 'inactive' | 'pending' | 'sold';
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  images?: string[];
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

export interface CreatePropertyRequest {
  ownerId: string;
  address: Property['address'];
  propertyType: Property['propertyType'];
  buildingType: string;
  yearBuilt: number;
  squareFootage: number;
  bedrooms?: number;
  bathrooms?: number;
  floors: number;
  hasBasement: boolean;
  hasGarage: boolean;
  hasPool: boolean;
  constructionMaterial: string;
  roofType: string;
  heatingType: string;
  coolingType: string;
  electricalSystem: string;
  plumbingSystem: string;
  marketValue: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface UpdatePropertyRequest {
  id: string;
  address?: Partial<Property['address']>;
  propertyType?: Property['propertyType'];
  buildingType?: string;
  yearBuilt?: number;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  hasBasement?: boolean;
  hasGarage?: boolean;
  hasPool?: boolean;
  constructionMaterial?: string;
  roofType?: string;
  heatingType?: string;
  coolingType?: string;
  electricalSystem?: string;
  plumbingSystem?: string;
  marketValue?: number;
  status?: Property['status'];
}

export interface PropertiesListResponse {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PropertiesListParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: Property['propertyType'];
  status?: Property['status'];
  ownerId?: string;
  city?: string;
  state?: string;
  minValue?: number;
  maxValue?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertyValuationRequest {
  propertyId: string;
  valuationType: 'market' | 'insurance' | 'tax';
}

export interface PropertyValuationResponse {
  propertyId: string;
  estimatedValue: number;
  valuationType: string;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  confidence: number;
  lastUpdated: string;
}

export interface PropertyRiskAssessment {
  propertyId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  factors: Array<{
    category: string;
    score: number;
    description: string;
    recommendations?: string[];
  }>;
  lastAssessed: string;
}

// Inject endpoints into the main API slice
export const propertyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all properties with pagination and filtering
    getProperties: builder.query<PropertiesListResponse, PropertiesListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.propertyType) searchParams.append('propertyType', params.propertyType);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.ownerId) searchParams.append('ownerId', params.ownerId);
        if (params?.city) searchParams.append('city', params.city);
        if (params?.state) searchParams.append('state', params.state);
        if (params?.minValue) searchParams.append('minValue', params.minValue.toString());
        if (params?.maxValue) searchParams.append('maxValue', params.maxValue.toString());
        if (params?.yearBuiltMin) searchParams.append('yearBuiltMin', params.yearBuiltMin.toString());
        if (params?.yearBuiltMax) searchParams.append('yearBuiltMax', params.yearBuiltMax.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        return `/properties?${searchParams.toString()}`;
      },
      providesTags: ['Property'],
    }),

    // Get property by ID
    getPropertyById: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Property', id }],
    }),

    // Create new property
    createProperty: builder.mutation<Property, CreatePropertyRequest>({
      query: (propertyData) => ({
        url: '/properties',
        method: 'POST',
        body: propertyData,
      }),
      invalidatesTags: ['Property'],
    }),

    // Update property
    updateProperty: builder.mutation<Property, UpdatePropertyRequest>({
      query: ({ id, ...propertyData }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: propertyData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Property', id },
        'Property',
      ],
    }),

    // Delete property
    deleteProperty: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Property', id },
        'Property',
      ],
    }),

    // Get properties by owner ID
    getPropertiesByOwner: builder.query<Property[], string>({
      query: (ownerId) => `/properties/owner/${ownerId}`,
      providesTags: (_result, _error, ownerId) => [{ type: 'Property', id: `owner-${ownerId}` }],
    }),

    // Get property valuation
    getPropertyValuation: builder.mutation<PropertyValuationResponse, PropertyValuationRequest>({
      query: (valuationData) => ({
        url: '/properties/valuation',
        method: 'POST',
        body: valuationData,
      }),
    }),

    // Get property risk assessment
    getPropertyRiskAssessment: builder.query<PropertyRiskAssessment, string>({
      query: (propertyId) => `/properties/${propertyId}/risk-assessment`,
      providesTags: (_result, _error, propertyId) => [{ type: 'Property', id: `${propertyId}-risk` }],
    }),

    // Upload property images
    uploadPropertyImages: builder.mutation<{ images: string[] }, { propertyId: string; formData: FormData }>({
      query: ({ propertyId, formData }) => ({
        url: `/properties/${propertyId}/images`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: 'Property', id: propertyId },
      ],
    }),

    // Upload property documents
    uploadPropertyDocuments: builder.mutation<{ documents: Property['documents'] }, { propertyId: string; formData: FormData }>({
      query: ({ propertyId, formData }) => ({
        url: `/properties/${propertyId}/documents`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { propertyId }) => [
        { type: 'Property', id: propertyId },
      ],
    }),

    // Get property types
    getPropertyTypes: builder.query<string[], void>({
      query: () => '/properties/types',
    }),

    // Get building types
    getBuildingTypes: builder.query<string[], void>({
      query: () => '/properties/building-types',
    }),

    // Get property statistics
    getPropertyStats: builder.query<{
      totalProperties: number;
      activeProperties: number;
      totalValue: number;
      averageValue: number;
      propertyTypeDistribution: Record<string, number>;
      stateDistribution: Record<string, number>;
    }, void>({
      query: () => '/properties/stats',
      providesTags: ['Property'],
    }),

    // Bulk update properties
    bulkUpdateProperties: builder.mutation<{ updated: number }, { propertyIds: string[]; updates: Partial<Property> }>({
      query: (data) => ({
        url: '/properties/bulk',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Property'],
    }),

    // Export properties data
    exportProperties: builder.mutation<Blob, PropertiesListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params?.search) searchParams.append('search', params.search);
        if (params?.propertyType) searchParams.append('propertyType', params.propertyType);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.city) searchParams.append('city', params.city);
        if (params?.state) searchParams.append('state', params.state);

        return {
          url: `/properties/export?${searchParams.toString()}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetPropertiesByOwnerQuery,
  useGetPropertyValuationMutation,
  useGetPropertyRiskAssessmentQuery,
  useUploadPropertyImagesMutation,
  useUploadPropertyDocumentsMutation,
  useGetPropertyTypesQuery,
  useGetBuildingTypesQuery,
  useGetPropertyStatsQuery,
  useBulkUpdatePropertiesMutation,
  useExportPropertiesMutation,
} = propertyApi;