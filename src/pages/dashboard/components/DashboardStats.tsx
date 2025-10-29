import React from "react";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { DashboardData } from "../../../types/auth";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

interface DashboardStatsProps {
  data?: DashboardData;
  isLoading?: boolean;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  yellow:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
};

export function DashboardStats({ data, isLoading }: DashboardStatsProps) {
  // Show loading state
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <LoadingSpinner size="sm" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate conversion rate (activeQuotes / totalQuotes)
  const conversionRate =
    data.totalQuotes > 0
      ? ((data.activeQuotes / data.totalQuotes) * 100).toFixed(1)
      : "0.0";

  // Calculate claims ratio (this is a placeholder - adjust based on actual claims data)
  const claimsRatio =
    data.activeQuotes > 0
      ? ((data.totalUnderGoingReview / data.activeQuotes) * 100).toFixed(1)
      : "0.0";

  const stats = [
    {
      name: "Total Users",
      value: data.users.toLocaleString(),
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      name: "Active Quotes",
      value: data.activeQuotes.toLocaleString(),
      change: "+8%",
      changeType: "increase" as const,
      icon: FileText,
      color: "green" as const,
    },
    {
      name: "Premium Collected",
      value: `₦${(data.totalAmountForActivePolicies / 1000000).toFixed(1)}M`,
      change: "+15%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "indigo" as const,
    },
    {
      name: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "-2%",
      changeType: "decrease" as const,
      icon: TrendingUp,
      color: "orange" as const,
    },
    {
      name: "Review Ratio",
      value: `${claimsRatio}%`,
      change: "+1%",
      changeType: "increase" as const,
      icon: Shield,
      color: "red" as const,
    },
    {
      name: "Pending Reviews",
      value: data.totalUnderGoingReview.toLocaleString(),
      change: "-5%",
      changeType: "decrease" as const,
      icon: AlertTriangle,
      color: "yellow" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                stat.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
