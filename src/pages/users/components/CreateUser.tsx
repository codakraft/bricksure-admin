import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useGetAllRolesQuery } from "../../../service/authService";
import { useCreateAdminMutation } from "../../../service/userService";

export function CreateUser() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Fetch all roles
  const { data: rolesResponse, isLoading: rolesLoading } =
    useGetAllRolesQuery();

  // Create admin mutation
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  console.log("Roles Response:", rolesResponse);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the createAdmin API
      const result = await createAdmin(formData).unwrap();

      addNotification({
        type: "success",
        title: "User Created Successfully",
        message: `${formData.firstName} ${formData.lastName} has been created successfully.`,
      });

      console.log("Admin created:", result);
      navigate("/users");
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      addNotification({
        type: "error",
        title: "Creation Failed",
        message:
          apiError?.data?.message || "Failed to create user. Please try again.",
      });
      console.error("Failed to create admin:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/users">
          <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New User
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add a new customer or admin user to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roleId"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    User Role *
                  </label>
                  <select
                    id="roleId"
                    name="roleId"
                    required
                    value={formData.roleId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    disabled={rolesLoading}
                  >
                    <option value="">Select a role</option>
                    {rolesLoading ? (
                      <option value="">Loading roles...</option>
                    ) : rolesResponse?.data?.roles &&
                      rolesResponse.data.roles.length > 0 ? (
                      rolesResponse.data.roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No roles available</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link to="/users">
                <Button variant="secondary" disabled={isCreating}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={isCreating}>
                Create User
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
