import React from "react";
import { Status } from "../../types/common";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800 border-gray-200" },
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  underwriting: {
    label: "Underwriting",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  suspended: {
    label: "Suspended",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  "under-review": {
    label: "Under Review",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  amended: {
    label: "Amended",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  failed: { label: "Failed", color: "bg-red-100 text-red-800 border-red-200" },
  flagged: {
    label: "Flagged",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  investigating: {
    label: "Investigating",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config?.color} ${className}`}
    >
      {config?.label}
    </span>
  );
}
