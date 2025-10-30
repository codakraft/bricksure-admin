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

// Type for charge data
interface ChargeData {
  name: string;
  description: string;
  chargeType: "fixed" | "percentage";
  category: string;
  isActive: boolean;
  amount?: string; // For single-value charges (backward compatibility)
  subCharges?: {
    label: string;
    amount: number;
    key: string; // API key path
  }[];
}

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

  const [formData, setFormData] = useState<ChargeData>({
    name: "",
    description: "",
    chargeType: "fixed",
    category: "",
    isActive: true,
    subCharges: [],
  });

  // Populate form data based on the charge ID
  useEffect(() => {
    if (chargesResponse?.data && id) {
      // Build comprehensive charge map with all charges from the API (matching ChargesList structure)
      const chargeMap: Record<string, ChargeData> = {
        // Property Type Charges - Bungalow (single property)
        bungalow: {
          name: "Bungalow",
          description: "Charge for bungalow properties",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.bungalow?.perPlot ||
                0,
              key: "propertyTypeCharges.bungalow.perPlot",
            },
          ],
        },
        // Property Type Charges - Duplex (multiple properties)
        duplex: {
          name: "Duplex",
          description: "Charge for duplex properties (Per Floor, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.duplex?.perFloor || 0,
              key: "propertyTypeCharges.duplex.perFloor",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.duplex?.perPlot || 0,
              key: "propertyTypeCharges.duplex.perPlot",
            },
          ],
        },
        // Property Type Charges - Storey Building (multiple properties)
        storeyBuilding: {
          name: "Storey Building",
          description: "Charge for storey building (Per Floor, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.storeyBuilding
                  ?.perFloor || 0,
              key: "propertyTypeCharges.storeyBuilding.perFloor",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.storeyBuilding
                  ?.perPlot || 0,
              key: "propertyTypeCharges.storeyBuilding.perPlot",
            },
          ],
        },
        // Property Type Charges - Flats (single property)
        flats: {
          name: "Flats/Apartments",
          description: "Charge for flats and apartments",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.flats?.perPlot || 0,
              key: "propertyTypeCharges.flats.perPlot",
            },
          ],
        },
        // Property Type Charges - Single Occupancy Office (multiple properties)
        singleOccOffice: {
          name: "Single Occupancy Office",
          description:
            "Charge for single occupancy office (Per Floor, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccOffice
                  ?.perFloor || 0,
              key: "propertyTypeCharges.singleOccOffice.perFloor",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccOffice
                  ?.perPlot || 0,
              key: "propertyTypeCharges.singleOccOffice.perPlot",
            },
          ],
        },
        // Property Type Charges - Single Occupancy Residential (multiple properties)
        singleOccResidential: {
          name: "Single Occupancy Residential",
          description:
            "Charge for single occupancy residential (Per Floor, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccResidential
                  ?.perFloor || 0,
              key: "propertyTypeCharges.singleOccResidential.perFloor",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccResidential
                  ?.perPlot || 0,
              key: "propertyTypeCharges.singleOccResidential.perPlot",
            },
          ],
        },
        // Property Type Charges - Hotel/Hostel/Guest House (multiple properties)
        hotelHostelGuest: {
          name: "Hotel/Hostel/Guest House",
          description:
            "Charge for hotel/hostel/guest house (Per Room, Per Bed)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Room",
              amount:
                chargesResponse.data.propertyTypeCharges?.hotelHostelGuest
                  ?.perRoom || 0,
              key: "propertyTypeCharges.hotelHostelGuest.perRoom",
            },
            {
              label: "Per Bed",
              amount:
                chargesResponse.data.propertyTypeCharges?.hotelHostelGuest
                  ?.perBed || 0,
              key: "propertyTypeCharges.hotelHostelGuest.perBed",
            },
          ],
        },
        // Property Type Charges - Recreation/Cinema (multiple properties)
        recreationCinema: {
          name: "Recreation/Cinema",
          description:
            "Charge for recreation/cinema (Per Floor, Per Cinema Seat)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.recreationCinema
                  ?.perFloor || 0,
              key: "propertyTypeCharges.recreationCinema.perFloor",
            },
            {
              label: "Per Cinema Seat",
              amount:
                chargesResponse.data.propertyTypeCharges?.recreationCinema
                  ?.perCinemaSeat || 0,
              key: "propertyTypeCharges.recreationCinema.perCinemaSeat",
            },
          ],
        },
        // Property Type Charges - School (multiple properties)
        school: {
          name: "School",
          description:
            "Charge for school (Per Block, Per Pupil Seat, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Block",
              amount:
                chargesResponse.data.propertyTypeCharges?.school?.perBlock || 0,
              key: "propertyTypeCharges.school.perBlock",
            },
            {
              label: "Per Pupil Seat",
              amount:
                chargesResponse.data.propertyTypeCharges?.school
                  ?.perPupilSeat || 0,
              key: "propertyTypeCharges.school.perPupilSeat",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.school?.perPlot || 0,
              key: "propertyTypeCharges.school.perPlot",
            },
          ],
        },
        // Property Type Charges - Petrol/Gas Station (single property)
        petrolGasStation: {
          name: "Petrol/Gas Station",
          description: "Charge for petrol/gas station",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Pump",
              amount:
                chargesResponse.data.propertyTypeCharges?.petrolGasStation
                  ?.perPump || 0,
              key: "propertyTypeCharges.petrolGasStation.perPump",
            },
          ],
        },
        // Property Type Charges - Hospital/Clinic (multiple properties)
        hospitalClinic: {
          name: "Hospital/Clinic",
          description: "Charge for hospital/clinic (Per Floor, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.hospitalClinic
                  ?.perFloor || 0,
              key: "propertyTypeCharges.hospitalClinic.perFloor",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.hospitalClinic
                  ?.perPlot || 0,
              key: "propertyTypeCharges.hospitalClinic.perPlot",
            },
          ],
        },
        // Property Type Charges - Multi-Occupancy Business (single property)
        multiOccBusiness: {
          name: "Multi-Occupancy Business",
          description: "Charge for multi-occupancy business",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Apartment/Office Wing",
              amount:
                chargesResponse.data.propertyTypeCharges?.multiOccBusiness
                  ?.perApartmentOfficeWing || 0,
              key: "propertyTypeCharges.multiOccBusiness.perApartmentOfficeWing",
            },
          ],
        },
        // Property Type Charges - Multi-Occupancy Mixed Residential (single property)
        multiOccMixedRes: {
          name: "Multi-Occupancy Mixed Residential",
          description: "Charge for multi-occupancy mixed residential",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Apartment/Office Wing",
              amount:
                chargesResponse.data.propertyTypeCharges?.multiOccMixedRes
                  ?.perApartmentOfficeWing || 0,
              key: "propertyTypeCharges.multiOccMixedRes.perApartmentOfficeWing",
            },
          ],
        },
        // Property Type Charges - Others (multiple properties)
        others: {
          name: "Others",
          description: "Charge for other property types (Per Floor, Per Plot)",
          chargeType: "fixed",
          category: "Property Type",
          isActive: true,
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.others?.perFloor || 0,
              key: "propertyTypeCharges.others.perFloor",
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.others?.perPlot || 0,
              key: "propertyTypeCharges.others.perPlot",
            },
          ],
        },
        // Property Base Fee
        propertyBaseFee: {
          name: "Property Base Fee",
          description: "General base fee for all properties",
          chargeType: "fixed",
          category: "Base Fee",
          isActive: true,
          subCharges: [
            {
              label: "Base Fee",
              amount: chargesResponse.data.propertyBaseFee || 0,
              key: "propertyBaseFee",
            },
          ],
        },
        // Risk Adjustments - Wall Material (grouped)
        wallMaterial: {
          name: "Wall Material",
          description: "Risk adjustments for different wall materials",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Brick",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial?.brick || 0,
              key: "riskAdjustments.wallMaterial.brick",
            },
            {
              label: "Mud",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial?.mud || 0,
              key: "riskAdjustments.wallMaterial.mud",
            },
            {
              label: "Wood",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial?.wood || 0,
              key: "riskAdjustments.wallMaterial.wood",
            },
            {
              label: "Mixed Materials",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial
                  ?.mixedMaterials || 0,
              key: "riskAdjustments.wallMaterial.mixedMaterials",
            },
          ],
        },
        // Risk Adjustments - Building Age (grouped)
        buildingAge: {
          name: "Building Age",
          description: "Risk adjustments based on building age",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "0-5 Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["0-5"] || 0,
              key: "riskAdjustments.buildingAge.0-5",
            },
            {
              label: "5-10 Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["5-10"] ||
                0,
              key: "riskAdjustments.buildingAge.5-10",
            },
            {
              label: "10-20 Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["10-20"] ||
                0,
              key: "riskAdjustments.buildingAge.10-20",
            },
            {
              label: "20+ Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["20+"] || 0,
              key: "riskAdjustments.buildingAge.20+",
            },
          ],
        },
        // Risk Adjustments - Other Factors (single values)
        pastLoss: {
          name: "Past Loss",
          description: "Risk adjustment for properties with past loss",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Past Loss",
              amount: chargesResponse.data.riskAdjustments?.pastLoss || 0,
              key: "riskAdjustments.pastLoss",
            },
          ],
        },
        unOccupiedForAwhile: {
          name: "Unoccupied For Awhile",
          description: "Risk adjustment for properties unoccupied for awhile",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Unoccupied",
              amount:
                chargesResponse.data.riskAdjustments?.unOccupiedForAwhile || 0,
              key: "riskAdjustments.unOccupiedForAwhile",
            },
          ],
        },
        floodRisk: {
          name: "Flood Risk",
          description: "Risk adjustment for properties in flood risk areas",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Flood Risk",
              amount: chargesResponse.data.riskAdjustments?.floodRisk || 0,
              key: "riskAdjustments.floodRisk",
            },
          ],
        },
        specialRisk: {
          name: "Special Risk",
          description: "Risk adjustment for properties with special risks",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Special Risk",
              amount: chargesResponse.data.riskAdjustments?.specialRisk || 0,
              key: "riskAdjustments.specialRisk",
            },
          ],
        },
        repairNeeded: {
          name: "Repair Needed",
          description: "Risk adjustment for properties needing repair",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Repair Needed",
              amount: chargesResponse.data.riskAdjustments?.repairNeeded || 0,
              key: "riskAdjustments.repairNeeded",
            },
          ],
        },
        commercialUse: {
          name: "Commercial Use",
          description: "Risk adjustment for commercial use properties",
          chargeType: "percentage",
          category: "Risk Adjustments",
          isActive: true,
          subCharges: [
            {
              label: "Commercial Use",
              amount: chargesResponse.data.riskAdjustments?.commercialUse || 0,
              key: "riskAdjustments.commercialUse",
            },
          ],
        },
        // Safety & Security Discounts - Security/Safety (grouped)
        securitySafety: {
          name: "Security & Safety Features",
          description: "Discounts for security and safety features",
          chargeType: "percentage",
          category: "Safety & Security Discounts",
          isActive: true,
          subCharges: [
            {
              label: "Estate Gate",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.estateGate || 0,
              key: "safetySecurityDiscounts.securitySafety.estateGate",
            },
            {
              label: "CCTV",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.cctv || 0,
              key: "safetySecurityDiscounts.securitySafety.cctv",
            },
            {
              label: "Security Guards",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.securityGuards || 0,
              key: "safetySecurityDiscounts.securitySafety.securityGuards",
            },
            {
              label: "Strong Locks",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.strongLocks || 0,
              key: "safetySecurityDiscounts.securitySafety.strongLocks",
            },
            {
              label: "No Glass Panels",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.noGlassPanels || 0,
              key: "safetySecurityDiscounts.securitySafety.noGlassPanels",
            },
            {
              label: "Occupied",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.occupied || 0,
              key: "safetySecurityDiscounts.securitySafety.occupied",
            },
          ],
        },
        // Safety & Security Discounts - Fire Safety (grouped)
        fireSafety: {
          name: "Fire Safety Features",
          description: "Discounts for fire safety features",
          chargeType: "percentage",
          category: "Safety & Security Discounts",
          isActive: true,
          subCharges: [
            {
              label: "Fire Extinguisher",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.fireSafety
                  ?.fireExtinguisher || 0,
              key: "safetySecurityDiscounts.fireSafety.fireExtinguisher",
            },
            {
              label: "Smoke Alarm",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.fireSafety
                  ?.smokeAlarm || 0,
              key: "safetySecurityDiscounts.fireSafety.smokeAlarm",
            },
            {
              label: "Water Access",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.fireSafety
                  ?.waterAccess || 0,
              key: "safetySecurityDiscounts.fireSafety.waterAccess",
            },
          ],
        },
        // Extra Coverage Fees (grouped)
        extraCoverage: {
          name: "Extra Coverage Fees",
          description: "Additional fees for extended coverage",
          chargeType: "percentage",
          category: "Extra Coverage Fees",
          isActive: true,
          subCharges: [
            {
              label: "Theft",
              amount: chargesResponse.data.extraCoverageFees?.theft || 0,
              key: "extraCoverageFees.theft",
            },
            {
              label: "Flood Protection",
              amount:
                chargesResponse.data.extraCoverageFees?.floodProtection || 0,
              key: "extraCoverageFees.floodProtection",
            },
            {
              label: "Public Liability",
              amount:
                chargesResponse.data.extraCoverageFees?.publicLiability || 0,
              key: "extraCoverageFees.publicLiability",
            },
            {
              label: "Extended Fire Cover",
              amount:
                chargesResponse.data.extraCoverageFees?.extendedFireCover || 0,
              key: "extraCoverageFees.extendedFireCover",
            },
            {
              label: "Burglary Cover",
              amount:
                chargesResponse.data.extraCoverageFees?.burglaryCover || 0,
              key: "extraCoverageFees.burglaryCover",
            },
          ],
        },
      };

      const charge = chargeMap[id];
      if (charge) {
        setFormData(charge);
      }
    }
  }, [chargesResponse, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      // Build the API update payload from subCharges
      const updateData: Record<string, unknown> = {};

      if (formData.subCharges && formData.subCharges.length > 0) {
        // Convert subCharges back to nested API structure
        formData.subCharges.forEach((subCharge) => {
          const keys = subCharge.key.split(".");
          let current: Record<string, unknown> = updateData;

          // Build nested object structure
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]] as Record<string, unknown>;
          }

          // Set the final value
          current[keys[keys.length - 1]] = subCharge.amount;
        });
      } else if (formData.amount) {
        // Single amount charge (fallback for charges without subCharges)
        updateData.amount = Number(formData.amount);
      }

      await updateCharge({
        id,
        data: updateData,
      }).unwrap();

      addNotification({
        type: "success",
        title: "Charge Updated",
        message: `${formData.name} has been successfully updated.`,
      });

      navigate("/charges");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      addNotification({
        type: "error",
        title: "Update Failed",
        message:
          error?.data?.message || "Failed to update charge. Please try again.",
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

          {/* Charge Type */}
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

          {/* Amounts - Show all subCharges */}
          {formData.subCharges && formData.subCharges.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Charge Amounts <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.subCharges.map((subCharge, index) => (
                  <div key={index}>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {subCharge.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {formData.chargeType === "fixed" ? "₦" : "%"}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={subCharge.amount}
                        onChange={(e) => {
                          const newSubCharges = [
                            ...(formData.subCharges || []),
                          ];
                          newSubCharges[index] = {
                            ...newSubCharges[index],
                            amount: Number(e.target.value),
                          };
                          setFormData({
                            ...formData,
                            subCharges: newSubCharges,
                          });
                        }}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
          )}

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
