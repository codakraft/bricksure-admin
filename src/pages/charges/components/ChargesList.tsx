import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  TrendingUp,
  Percent,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useGetAllChargesQuery,
  useDeleteChargeMutation,
} from "../../../service/chargesService";
import { useNotifications } from "../../../contexts/NotificationContext";

export function ChargesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: chargesResponse,
    isLoading,
    isError,
    error,
  } = useGetAllChargesQuery();
  const [deleteCharge] = useDeleteChargeMutation();
  const { addNotification } = useNotifications();

  // Transform the charges data structure into an array for display
  const charges = chargesResponse?.data
    ? [
        // Property Type Charges
        {
          _id: "bungalow",
          name: "Bungalow",
          description: "Charge per plot for bungalow properties",
          amount:
            chargesResponse.data.propertyTypeCharges?.bungalow?.perPlot || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["bungalow"],
        },
        {
          _id: "duplex",
          name: "Duplex",
          description: "Charge per floor and per plot for duplex properties",
          amount:
            chargesResponse.data.propertyTypeCharges?.duplex?.perPlot || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["duplex"],
        },
        {
          _id: "storey",
          name: "Storey Building",
          description: "Charge per floor and per plot for storey building",
          amount:
            chargesResponse.data.propertyTypeCharges?.storeyBuilding?.perPlot ||
            0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["storeyBuilding"],
        },
        {
          _id: "flats",
          name: "Flats/Apartments",
          description: "Charge per plot for flats and apartments",
          amount: chargesResponse.data.propertyTypeCharges?.flats?.perPlot || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["flats"],
        },
        // Property Base Fee
        {
          _id: "base-fee",
          name: "Property Base Fee",
          description: "General base fee for all properties",
          amount: chargesResponse.data.propertyBaseFee || 0,
          chargeType: "fixed" as const,
          category: "Base Fee",
          isActive: true,
          applicableTo: ["all"],
        },
      ]
    : [];

  const filteredCharges = charges.filter((charge: any) => {
    const matchesSearch =
      charge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || charge.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && charge.isActive) ||
      (statusFilter === "inactive" && !charge.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteCharge({ id }).unwrap();
      addNotification({
        type: "success",
        title: "Charge Deleted",
        message: `${name} has been successfully deleted.`,
      });
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Delete Failed",
        message:
          err?.data?.message || "Failed to delete charge. Please try again.",
      });
    }
  };

  const categories = Array.from(
    new Set(charges.map((c: any) => c.category))
  ).filter(Boolean);

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
        : "Failed to load charges. Please try again later.";

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Charges
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
            Charges Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and configure all system charges
          </p>
        </div>
        <Link to="/charges/create">
          <Button icon={<Plus className="w-4 h-4" />}>Create New Charge</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Charges
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {charges.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <ToggleRight className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {charges.filter((c: any) => c.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Fixed Charges
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {charges.filter((c: any) => c.chargeType === "fixed").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Percent className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Percentage
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  charges.filter((c: any) => c.chargeType === "percentage")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search charges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Charges Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Charge Name
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Category
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredCharges.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No charges found.{" "}
                    {searchTerm && "Try adjusting your search filters."}
                  </td>
                </tr>
              ) : (
                filteredCharges.map((charge: any) => (
                  <tr
                    key={charge._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <Link
                          to={`/charges/${charge._id}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {charge.name}
                        </Link>
                        {charge.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {charge.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {charge.category || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {charge.chargeType === "percentage" ? (
                          <Percent className="w-4 h-4 text-purple-600" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {charge.chargeType}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {charge.chargeType === "percentage"
                          ? `${charge.amount}%`
                          : `₦${charge.amount.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {charge.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                        <StatusBadge
                          status={charge.isActive ? "approved" : "rejected"}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Link to={`/charges/${charge._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit className="w-4 h-4" />}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDelete(charge._id, charge.name)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
