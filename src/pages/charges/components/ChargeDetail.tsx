import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, DollarSign, Percent } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  useGetAllChargesQuery,
  useUpdateChargeMutation,
} from "../../../service/chargesService";
import { useNotifications } from "../../../contexts/NotificationContext";

export function ChargeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: chargesResponse,
    isLoading,
    isError,
    error,
  } = useGetAllChargesQuery();
  const [updateCharge, { isLoading: isUpdating }] = useUpdateChargeMutation();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    chargeType: "fixed" as "fixed" | "percentage",
    category: "",
    isActive: true,
  });

  // Populate form data based on the charge ID
  useEffect(() => {
    if (chargesResponse?.data && id) {
      // Map the ID to the actual charge data
      const chargeMap: Record<string, any> = {
        bungalow: {
          name: "Bungalow",
          description: "Charge per plot for bungalow properties",
          amount:
            chargesResponse.data.propertyTypeCharges?.bungalow?.perPlot || 0,
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
        },
        duplex: {
          name: "Duplex",
          description: "Charge per plot for duplex properties",
          amount:
            chargesResponse.data.propertyTypeCharges?.duplex?.perPlot || 0,
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
        },
        storey: {
          name: "Storey Building",
          description: "Charge per plot for storey building",
          amount:
            chargesResponse.data.propertyTypeCharges?.storeyBuilding?.perPlot ||
            0,
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
        },
        flats: {
          name: "Flats/Apartments",
          description: "Charge per plot for flats and apartments",
          amount: chargesResponse.data.propertyTypeCharges?.flats?.perPlot || 0,
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
        },
        "base-fee": {
          name: "Property Base Fee",
          description: "General base fee for all properties",
          amount: chargesResponse.data.propertyBaseFee || 0,
          chargeType: "fixed",
          category: "Base Fee",
          isActive: true,
        },
      };

      const charge = chargeMap[id];
      if (charge) {
        setFormData({
          ...charge,
          amount: String(charge.amount),
        });
      }
    }
  }, [chargesResponse, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updateCharge({
        id,
        data: {
          ...formData,
          amount: Number(formData.amount),
        },
      }).unwrap();

      addNotification({
        type: "success",
        title: "Charge Updated",
        message: `${formData.name} has been successfully updated.`,
      });

      navigate("/charges");
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Update Failed",
        message:
          err?.data?.message || "Failed to update charge. Please try again.",
      });
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
        : "Failed to load charge details. Please try again later.";

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Charge
        </h3>
        <p className="text-red-600">{errorMessage}</p>
        <Link to="/charges" className="mt-4 inline-block">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Charges
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate("/charges")}
        >
          Back to Charges
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Charge
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Update charge details and configuration
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Charge Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Charge Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Processing Fee"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              Charge name cannot be modified
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the charge"
            />
          </div>

          {/* Charge Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Charge Type
              </label>
              <div className="flex items-center space-x-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                {formData.chargeType === "fixed" ? (
                  <>
                    <DollarSign className="w-5 h-5" />
                    <span>Fixed</span>
                  </>
                ) : (
                  <>
                    <Percent className="w-5 h-5" />
                    <span>Percentage</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Charge type cannot be modified
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {formData.chargeType === "fixed" ? "₦" : "%"}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              Category cannot be modified
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active (charge is currently in use)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/charges")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={<Save className="w-4 h-4" />}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
