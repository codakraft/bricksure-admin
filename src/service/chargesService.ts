import { ChargeRequestData, ChargesResponse } from "../types/auth";
import { api } from "./api";

// Additional types for charge operations
export interface CreateChargeRequest {
  name: string;
  description: string;
  amount: number;
  chargeType: 'fixed' | 'percentage';
  category: string;
  isActive: boolean;
  applicableTo: string[];
}


// Inject endpoints into the main API slice
export const chargesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCharges: builder.query<ChargesResponse, void>({
      query: () => ({
        url: `/api/v1/admin/charges/view`,
        method: "GET",
      }),
      providesTags: ["Charges"],
    }),
    
    getChargeById: builder.query<ChargesResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/charges/${id}/view`,
        method: "GET",
      }),
      providesTags: (_result, _error, { id }) => [{ type: "Charges", id }],
    }),
    
    createCharge: builder.mutation<ChargesResponse, CreateChargeRequest>({
      query: (data) => ({
        url: `/api/v1/admin/charges/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Charges"],
    }),
    
    updateCharge: builder.mutation<ChargesResponse, { id: string; data: ChargeRequestData }>({
      query: ({ id, data }) => ({
        url: `/api/v1/admin/charges/update/${id}`,
        method: "PUT",
        body: data,
      }),
    //   invalidatesTags: (_result, _error, { id }) => [{ type: "Charges", id }, "Charges"],
    }),
    
    deleteCharge: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/charges/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Charges"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllChargesQuery,
  useGetChargeByIdQuery,
  useCreateChargeMutation,
  useUpdateChargeMutation,
  useDeleteChargeMutation,
} = chargesApi;

