import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  UserCheck,
  UserX,
  Key,
  Shield,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { useGetAllUsersQuery } from "../../../service/userService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "pending";
  lastLogin: string;
  avatar: string;
  department: string;
  mfaEnabled: boolean;
}

export function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch users from API
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery();

  // Transform API data to match the User interface
  const users: User[] = useMemo(() => {
    if (!usersResponse?.data) return [];

    return usersResponse.data.map((user) => ({
      id: user._id,
      name:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "N/A",
      email: user.email,
      role: "Customer", // Default role since API doesn't provide it
      status: user.emailVerified
        ? "active"
        : ("pending" as "active" | "suspended" | "pending"),
      lastLogin: user.updatedAt || user.createdAt,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.fullName || user.email
      )}&background=random`,
      department: "N/A",
      mfaEnabled: false, // Default since API doesn't provide it
    }));
  }, [usersResponse]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (userId: string) => {
    console.log("Toggling selection for userId:", userId);
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

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
        : "Failed to load users. Please try again later.";

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Users
        </h3>
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage customer accounts and admin users
          </p>
        </div>
        <Link to="/users/create">
          <Button icon={<Plus className="w-4 h-4" />}>Create User</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedUsers.length} user{selectedUsers.length === 1 ? "" : "s"}{" "}
              selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                icon={<UserCheck className="w-4 h-4" />}
              >
                Activate
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<UserX className="w-4 h-4" />}
              >
                Suspend
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<Key className="w-4 h-4" />}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  User
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Role
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Last Login
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Security
                </th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/users/${user.id}`}
                      className="flex items-center hover:text-blue-600"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {user.mfaEnabled ? (
                        <div title="MFA Enabled">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div title="MFA Disabled">
                          <Shield className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
