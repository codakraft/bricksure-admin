import {
  CreateAdminRequest,
  CreateAdminResponse,
  DisableUserResponse,
  EnableUserResponse,
  GetAllUsersResponse,
  UserByIDResponseData,
  UserWalletResponse,
} from "../types/auth";
import { api } from "./api";

// Inject endpoints into the main API slice
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: "/api/v1/admin/users/view-all",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get user by ID
    getUserById: builder.query<UserByIDResponseData, { id: string }>({
      query: ({ id }) => {
        const url = `/api/v1/admin/users/${id}/view`;
        return {
          url,
          method: "GET",
        };
      },
      // providesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),

    // Create new user
    createAdmin: builder.mutation<CreateAdminResponse, CreateAdminRequest>({
      query: (body) => ({
        url: "/api/v1/admin/auth/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // // Update user
    // updateUser: builder.mutation<User, UpdateUserRequest>({
    //   query: ({ id, ...userData }) => ({
    //     url: `/users/${id}`,
    //     method: "PUT",
    //     body: userData,
    //   }),
    //   invalidatesTags: (_result, _error, { id }) => [
    //     { type: "User", id },
    //     "User",
    //   ],
    // }),

    // // Delete user (soft delete)
    // deleteUser: builder.mutation<{ message: string }, string>({
    //   query: (id) => ({
    //     url: `/users/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: (_result, _error, id) => [{ type: "User", id }, "User"],
    // }),

    // // Activate/Deactivate user
    // toggleUserStatus: builder.mutation<User, { id: string; isActive: boolean }>(
    //   {
    //     query: ({ id, isActive }) => ({
    //       url: `/users/${id}/status`,
    //       method: "PATCH",
    //       body: { isActive },
    //     }),
    //     invalidatesTags: (_result, _error, { id }) => [
    //       { type: "User", id },
    //       "User",
    //     ],
    //   }
    // ),

    // // Get user activity logs
    // getUserActivity: builder.query<
    //   Array<{
    //     id: string;
    //     action: string;
    //     timestamp: string;
    //     details?: string;
    //   }>,
    //   string
    // >({
    //   query: (id) => `/users/${id}/activity`,
    //   providesTags: (_result, _error, id) => [
    //     { type: "User", id: `${id}-activity` },
    //   ],
    // }),

    // // Update user profile (for current user)
    // updateProfile: builder.mutation<User, Partial<User>>({
    //   query: (userData) => ({
    //     url: "/users/profile",
    //     method: "PUT",
    //     body: userData,
    //   }),
    //   invalidatesTags: ["Auth", "User"],
    // }),

    // // Upload profile image
    // uploadProfileImage: builder.mutation<{ profileImage: string }, FormData>({
    //   query: (formData) => ({
    //     url: "/users/profile/image",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Auth", "User"],
    // }),

    // // Get user roles
    // getUserRoles: builder.query<string[], void>({
    //   query: () => "/users/roles",
    // }),

    // // Bulk user operations
    // bulkUpdateUsers: builder.mutation<
    //   { updated: number },
    //   { userIds: string[]; updates: Partial<User> }
    // >({
    //   query: (data) => ({
    //     url: "/users/bulk",
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["User"],
    // }),

    // // Export users data
    // exportUsers: builder.mutation<Blob, UsersListParams | void>({
    //   query: (params) => {
    //     const searchParams = new URLSearchParams();

    //     if (params?.search) searchParams.append("search", params.search);
    //     if (params?.role) searchParams.append("role", params.role);
    //     if (params?.isActive !== undefined)
    //       searchParams.append("isActive", params.isActive.toString());

    //     return {
    //       url: `/users/export?${searchParams.toString()}`,
    //       method: "GET",
    //       responseHandler: (response) => response.blob(),
    //     };
    //   },
    // }),
    getUserWallet: builder.query<UserWalletResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/users/${id}/wallet`,
        method: "GET",
      }),
      // providesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),
    disableUser: builder.mutation<DisableUserResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/users/${id}/disable`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    enableUser: builder.mutation<EnableUserResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/users/${id}/enable`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // useGetUsersQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useLazyGetUserWalletQuery,
  useDisableUserMutation,
  useEnableUserMutation,
  useCreateAdminMutation,
  // useUpdateUserMutation,
  // useDeleteUserMutation,
  // useToggleUserStatusMutation,
  // useGetUserActivityQuery,
  // useUpdateProfileMutation,
  // useUploadProfileImageMutation,
  // useGetUserRolesQuery,
  // useBulkUpdateUsersMutation,
  // useExportUsersMutation,
} = userApi;
