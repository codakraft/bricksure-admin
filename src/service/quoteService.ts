import { QuotesResponseData } from "../types/auth";
import { api } from "./api";

// Inject endpoints into the main API slice
export const quoteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuotes: builder.query<QuotesResponseData, void>({
      query: () => {
        // Make endDate dynamic - always use current date
        const endDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const startDate = '2025-09-12'; // Keep start date as is or make it configurable
        
        return {
          url: `/api/v1/admin/quotes/view-all?startDate=${startDate}&endDate=${endDate}`,
          method: "GET",
        };
      },
    //   providesTags: ["Quote"],
    }),
    getQuoteById: builder.query<QuotesResponseData, { id: string }>({
      query: ({ id }) => {
        const url = `/api/v1/admin/quotes/view/${id}`;
        return {
          url,
          method: "GET",
        };
      },
      // providesTags: (_result, _error, { id }) => [{ type: "Quote", id }],
    }),

  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllQuotesQuery,
    useGetQuoteByIdQuery,
} = quoteApi;
