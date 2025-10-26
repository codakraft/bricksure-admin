import { api } from "./api";
import { ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, LoginResponse, RefreshTokenRequest, RegisterRequest, ResetPasswordRequest } from "../types/auth";



// Inject endpoints into the main API slice
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/v1/admin/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation<
      { message: string },
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<LoginResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user profile
    getCurrentUser: builder.query<LoginResponse["user"], void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    // Verify token
    verifyToken: builder.query<{ valid: boolean }, void>({
      query: () => "/auth/verify-token",
      providesTags: ["Auth"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useVerifyTokenQuery,
} = authApi;
