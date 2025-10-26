import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Key,
  UserX,
  UserCheck,
  Mail,
  // Phone,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useGetUserByIdQuery,
  useDisableUserMutation,
  useEnableUserMutation,
} from "../../../service/userService";
import { useNotifications } from "../../../contexts/NotificationContext";

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotifications();

  // Fetch user data from API with optimizations
  const {
    data: userResponse,
    isLoading,
    isError,
    error,
    // isFetching,
    refetch,
  } = useGetUserByIdQuery(
    { id: id! },
    {
      skip: !id, // Skip the query if id is not available
      refetchOnMountOrArgChange: false, // Don't refetch on component remount if data exists
      refetchOnFocus: false, // Don't refetch when window regains focus
    }
  );

  // Disable and Enable user mutations
  const [disableUser, { isLoading: isDisabling }] = useDisableUserMutation();
  const [enableUser, { isLoading: isEnabling }] = useEnableUserMutation();

  // console.log("UserDetail userResponse:", userResponse, id, isError, error);
  // console.log("error:", isError, error);

  // Handler for disabling a user
  const handleDisableUser = async () => {
    if (!id) return;

    try {
      const res = await disableUser({ id }).unwrap();
      console.log("Disable user response:", res);
      if (res.data) {
        addNotification({
          type: "success",
          title: "User Disabled",
          message: "User has been successfully disabled.",
        });
        // Refetch user data to update the UI
        refetch();
      }
    } catch (err) {
      console.log("Disable user error:", err);
      const error = err as { data?: { message?: string } };
      addNotification({
        type: "error",
        title: "Disable Failed",
        message:
          error.data?.message || "Failed to disable user. Please try again.",
      });
    }
  };

  // Handler for enabling a user
  const handleEnableUser = async () => {
    if (!id) return;

    try {
      await enableUser({ id }).unwrap();
      addNotification({
        type: "success",
        title: "User Enabled",
        message: "User has been successfully enabled.",
      });
      // Refetch user data to update the UI
      refetch();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      addNotification({
        type: "error",
        title: "Enable Failed",
        message:
          error.data?.message || "Failed to enable user. Please try again.",
      });
    }
  };

  // Transform API data with memoization for performance
  const user = useMemo(() => {
    if (!userResponse?.data) return null;

    const apiUser = userResponse.data;
    return {
      id: apiUser._id,
      name:
        `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim() || "N/A",
      email: apiUser.email,
      phone: apiUser.phoneNumber || "N/A",
      role: "Customer", // Default since API doesn't provide it
      status: apiUser.disabled
        ? "suspended"
        : ((apiUser.emailVerified ? "active" : "pending") as
            | "active"
            | "suspended"
            | "pending"),
      createdAt: apiUser.createdAt,
      lastLogin: apiUser.updatedAt, // Using updatedAt as lastLogin since API doesn't provide it
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        apiUser.firstName + " " + apiUser.lastName
      )}&background=random`,
      department: "N/A",
      mfaEnabled: false, // Default since API doesn't provide it
      address: {
        street: "N/A",
        city: "N/A",
        state: "N/A",
        country: "Nigeria",
      },
      policies: [] as Array<{
        id: string;
        property: string;
        premium: string;
        status: "active" | "suspended" | "pending";
      }>, // Empty array since API doesn't provide policies
    };
  }, [userResponse]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "data" in error
        ? (error.data as { message?: string })?.message
        : "Failed to load user details. Please try again later.";

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/users">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading User
          </h3>
          <p className="text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // If user data is not available, show error
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/users">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            User Not Found
          </h3>
          <p className="text-red-600">Unable to load user details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/users">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Details
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage user account and permissions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" icon={<Key className="w-4 h-4" />}>
            Reset Password
          </Button>
          <Button variant="secondary" icon={<Mail className="w-4 h-4" />}>
            Send Email
          </Button>
          {user.status === "active" ? (
            <Button
              variant="danger"
              icon={<UserX className="w-4 h-4" />}
              onClick={handleDisableUser}
              loading={isDisabling}
            >
              Disable
            </Button>
          ) : (
            <Button
              icon={<UserCheck className="w-4 h-4" />}
              onClick={handleEnableUser}
              loading={isEnabling}
            >
              Enable
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <div className="mt-2">
                <StatusBadge status={user.status} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <p className="text-gray-900 dark:text-white">{user.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <p className="text-gray-900 dark:text-white">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.department}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  MFA Status
                </label>
                <div className="flex items-center space-x-2">
                  <Shield
                    className={`w-4 h-4 ${
                      user.mfaEnabled ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <span className="text-gray-900 dark:text-white">
                    {user.mfaEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Member Since
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Login
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street Address
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.address.street}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.address.city}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  State
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.address.state}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.address.country}
                </p>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Active Policies
            </h3>
            {user.policies.length > 0 ? (
              <div className="space-y-4">
                {user.policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {policy.id}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {policy.property}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {policy.premium}
                      </p>
                      <StatusBadge status={policy.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No active policies found for this user.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
