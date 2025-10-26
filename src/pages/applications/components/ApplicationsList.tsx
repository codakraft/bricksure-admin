import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Clock,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Application } from "../../../types/common";
import { useGetAllQuotesQuery } from "../../../service/quoteService";
import { QuoteData } from "../../../types/auth";

export function ApplicationsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch quotes from API
  const {
    data: quotesResponse,
    isLoading,
    isError,
    error,
  } = useGetAllQuotesQuery();

  console.log("Quotes Response:", quotesResponse);

  // Transform quotes data to Application format
  const applications: Application[] = useMemo(() => {
    if (!quotesResponse?.data) return [];

    return quotesResponse.data.map((quote: QuoteData) => ({
      id: quote._id,
      userId: quote.user?._id || "N/A",
      userName: quote.user?.email?.split("@")[0] || "N/A",
      userEmail: quote.user?.email || "N/A",
      propertyId: quote._id,
      propertyAddress: quote.address || "N/A",
      applicationData: {
        personalInfo: {
          fullName: quote.user?.email?.split("@")[0] || "N/A",
          email: quote.user?.email || "N/A",
          phone: quote.user?.phoneNumber || "N/A",
          dateOfBirth: "N/A",
          occupation: "N/A",
        },
        propertyInfo: {
          address: quote.address || "N/A",
          propertyType: quote.category || "N/A",
          constructionYear: quote.buildingAge || "N/A",
          constructionMaterial: quote.wallMaterial || "N/A",
          roofType: quote.roofMaterial || "N/A",
          numberOfFloors: 0,
          estimatedValue: quote.propertyValue || 0,
        },
        coverageInfo: {
          coverageType: quote.paymentFrequency || "N/A",
          sumInsured: quote.propertyValue || 0,
          excess: 0,
          riders: [],
        },
        documents: {
          propertyPhotos: [],
          identityDocument: "",
          proofOfOwnership: "",
        },
      },
      status: (quote.status === "draft" ? "submitted" : quote.status) as
        | "submitted"
        | "pending"
        | "approved"
        | "rejected"
        | "amended",
      submittedAt: quote.createdAt,
      premium: quote.totalAmount || 0,
    }));
  }, [quotesResponse]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <Eye className="w-4 h-4 text-blue-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "amended":
        return <Edit className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
        : "Failed to load applications. Please try again later.";

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Applications
        </h3>
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Application Review
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review, approve, reject, or amend customer applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Submitted
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter((a) => a.status === "submitted").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter((a) => a.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Approved
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter((a) => a.status === "approved").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Rejected
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter((a) => a.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Edit className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Amended
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter((a) => a.status === "amended").length}
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
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="amended">Amended</option>
            </select>
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Application ID
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Applicant
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Property
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Coverage
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Premium
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                  Submitted
                </th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-4">
                    <Link
                      to={`/applications/${application.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {application.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {application.userName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {application.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {application.applicationData.propertyInfo.propertyType}
                      </p>
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate"
                        title={application.propertyAddress}
                      >
                        {application.propertyAddress}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ₦
                        {application.applicationData.coverageInfo.sumInsured.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {application.applicationData.coverageInfo.coverageType}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₦{application.premium?.toLocaleString() || "TBD"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <StatusBadge status={application.status} />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/applications/${application.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Review
                      </Button>
                    </Link>
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
