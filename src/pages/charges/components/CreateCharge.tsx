import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Percent, Save } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { useCreateChargeMutation } from "../../../service/chargesService";
import { useNotifications } from "../../../contexts/NotificationContext";

export function CreateCharge() {
  const navigate = useNavigate();
  const [createCharge, { isLoading }] = useCreateChargeMutation();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    chargeType: "fixed" as "fixed" | "percentage",
    category: "",
    isActive: true,
    applicableTo: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Charge name is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (formData.chargeType === "percentage" && Number(formData.amount) > 100) {
      newErrors.amount = "Percentage cannot exceed 100%";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await createCharge({
        ...formData,
        amount: Number(formData.amount),
      }).unwrap();

      addNotification({
        type: "success",
        title: "Charge Created",
        message: `${formData.name} has been successfully created.`,
      });

      navigate("/charges");
    } catch (err: any) {
      addNotification({
        type: "error",
        title: "Creation Failed",
        message:
          err?.data?.message || "Failed to create charge. Please try again.",
      });
    }
  };

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
          Create New Charge
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new charge to the system
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Charge Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Charge Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="e.g., Processing Fee"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
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
                Charge Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, chargeType: "fixed" })
                  }
                  className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                    formData.chargeType === "fixed"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Fixed</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, chargeType: "percentage" })
                  }
                  className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                    formData.chargeType === "percentage"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Percent className="w-5 h-5" />
                  <span>Percentage</span>
                </button>
              </div>
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
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white ${
                    errors.amount
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Select a category</option>
              <option value="Property Type">Property Type</option>
              <option value="Base Fee">Base Fee</option>
              <option value="Risk Adjustment">Risk Adjustment</option>
              <option value="Security Discount">Security Discount</option>
              <option value="Extra Coverage">Extra Coverage</option>
              <option value="Processing">Processing</option>
              <option value="Administrative">Administrative</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
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
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Charge"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
