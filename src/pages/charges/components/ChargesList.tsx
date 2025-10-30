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

// Type for individual charge items
interface ChargeItem {
  _id: string;
  name: string;
  description: string;
  amount: number | string; // Can be a single number or formatted string for multiple values
  chargeType: "fixed" | "percentage";
  category: string;
  isActive: boolean;
  applicableTo: string[];
  subCategory?: string;
  // For charges with multiple properties
  subCharges?: {
    label: string;
    amount: number;
  }[];
}

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
        // Property Type Charges - Bungalow (single property)
        {
          _id: "bungalow",
          name: "Bungalow",
          description: "Charge for bungalow properties",
          amount:
            chargesResponse.data.propertyTypeCharges?.bungalow?.perPlot || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["bungalow"],
          subCharges: [
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.bungalow?.perPlot ||
                0,
            },
          ],
        },

        // Property Type Charges - Duplex (multiple properties)
        {
          _id: "duplex",
          name: "Duplex",
          description: "Charge for duplex properties (Per Floor, Per Plot)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.duplex?.perFloor || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.duplex?.perPlot || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["duplex"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.duplex?.perFloor || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.duplex?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Storey Building (multiple properties)
        {
          _id: "storeyBuilding",
          name: "Storey Building",
          description: "Charge for storey building (Per Floor, Per Plot)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.storeyBuilding
              ?.perFloor || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.storeyBuilding?.perPlot ||
            0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["storeyBuilding"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.storeyBuilding
                  ?.perFloor || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.storeyBuilding
                  ?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Flats (single property)
        {
          _id: "flats",
          name: "Flats/Apartments",
          description: "Charge for flats and apartments",
          amount: chargesResponse.data.propertyTypeCharges?.flats?.perPlot || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["flats"],
          subCharges: [
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.flats?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Single Occupancy Office (multiple properties)
        {
          _id: "singleOccOffice",
          name: "Single Occupancy Office",
          description:
            "Charge for single occupancy office (Per Floor, Per Plot)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.singleOccOffice
              ?.perFloor || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.singleOccOffice
              ?.perPlot || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["singleOccOffice"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccOffice
                  ?.perFloor || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccOffice
                  ?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Single Occupancy Residential (multiple properties)
        {
          _id: "singleOccResidential",
          name: "Single Occupancy Residential",
          description:
            "Charge for single occupancy residential (Per Floor, Per Plot)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.singleOccResidential
              ?.perFloor || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.singleOccResidential
              ?.perPlot || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["singleOccResidential"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccResidential
                  ?.perFloor || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.singleOccResidential
                  ?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Hotel/Hostel/Guest House (multiple properties)
        {
          _id: "hotelHostelGuest",
          name: "Hotel/Hostel/Guest House",
          description:
            "Charge for hotel/hostel/guest house (Per Room, Per Bed)",
          amount: `Room: ₦${(
            chargesResponse.data.propertyTypeCharges?.hotelHostelGuest
              ?.perRoom || 0
          ).toLocaleString()}, Bed: ₦${(
            chargesResponse.data.propertyTypeCharges?.hotelHostelGuest
              ?.perBed || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["hotelHostelGuest"],
          subCharges: [
            {
              label: "Per Room",
              amount:
                chargesResponse.data.propertyTypeCharges?.hotelHostelGuest
                  ?.perRoom || 0,
            },
            {
              label: "Per Bed",
              amount:
                chargesResponse.data.propertyTypeCharges?.hotelHostelGuest
                  ?.perBed || 0,
            },
          ],
        },

        // Property Type Charges - Recreation/Cinema (multiple properties)
        {
          _id: "recreationCinema",
          name: "Recreation/Cinema",
          description:
            "Charge for recreation/cinema (Per Floor, Per Cinema Seat)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.recreationCinema
              ?.perFloor || 0
          ).toLocaleString()}, Cinema Seat: ₦${(
            chargesResponse.data.propertyTypeCharges?.recreationCinema
              ?.perCinemaSeat || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["recreationCinema"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.recreationCinema
                  ?.perFloor || 0,
            },
            {
              label: "Per Cinema Seat",
              amount:
                chargesResponse.data.propertyTypeCharges?.recreationCinema
                  ?.perCinemaSeat || 0,
            },
          ],
        },

        // Property Type Charges - School (multiple properties)
        {
          _id: "school",
          name: "School",
          description:
            "Charge for school (Per Block, Per Pupil Seat, Per Plot)",
          amount: `Block: ₦${(
            chargesResponse.data.propertyTypeCharges?.school?.perBlock || 0
          ).toLocaleString()}, Pupil Seat: ₦${(
            chargesResponse.data.propertyTypeCharges?.school?.perPupilSeat || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.school?.perPlot || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["school"],
          subCharges: [
            {
              label: "Per Block",
              amount:
                chargesResponse.data.propertyTypeCharges?.school?.perBlock || 0,
            },
            {
              label: "Per Pupil Seat",
              amount:
                chargesResponse.data.propertyTypeCharges?.school
                  ?.perPupilSeat || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.school?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Petrol/Gas Station (single property)
        {
          _id: "petrolGasStation",
          name: "Petrol/Gas Station",
          description: "Charge for petrol/gas station",
          amount:
            chargesResponse.data.propertyTypeCharges?.petrolGasStation
              ?.perPump || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["petrolGasStation"],
          subCharges: [
            {
              label: "Per Pump",
              amount:
                chargesResponse.data.propertyTypeCharges?.petrolGasStation
                  ?.perPump || 0,
            },
          ],
        },

        // Property Type Charges - Hospital/Clinic (multiple properties)
        {
          _id: "hospitalClinic",
          name: "Hospital/Clinic",
          description: "Charge for hospital/clinic (Per Floor, Per Plot)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.hospitalClinic
              ?.perFloor || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.hospitalClinic?.perPlot ||
            0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["hospitalClinic"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.hospitalClinic
                  ?.perFloor || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.hospitalClinic
                  ?.perPlot || 0,
            },
          ],
        },

        // Property Type Charges - Multi-Occupancy Business (single property)
        {
          _id: "multiOccBusiness",
          name: "Multi-Occupancy Business",
          description: "Charge for multi-occupancy business",
          amount:
            chargesResponse.data.propertyTypeCharges?.multiOccBusiness
              ?.perApartmentOfficeWing || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["multiOccBusiness"],
          subCharges: [
            {
              label: "Per Apartment/Office Wing",
              amount:
                chargesResponse.data.propertyTypeCharges?.multiOccBusiness
                  ?.perApartmentOfficeWing || 0,
            },
          ],
        },

        // Property Type Charges - Multi-Occupancy Mixed Residential (single property)
        {
          _id: "multiOccMixedRes",
          name: "Multi-Occupancy Mixed Residential",
          description: "Charge for multi-occupancy mixed residential",
          amount:
            chargesResponse.data.propertyTypeCharges?.multiOccMixedRes
              ?.perApartmentOfficeWing || 0,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["multiOccMixedRes"],
          subCharges: [
            {
              label: "Per Apartment/Office Wing",
              amount:
                chargesResponse.data.propertyTypeCharges?.multiOccMixedRes
                  ?.perApartmentOfficeWing || 0,
            },
          ],
        },

        // Property Type Charges - Others (multiple properties)
        {
          _id: "others",
          name: "Others",
          description: "Charge for other property types (Per Floor, Per Plot)",
          amount: `Floor: ₦${(
            chargesResponse.data.propertyTypeCharges?.others?.perFloor || 0
          ).toLocaleString()}, Plot: ₦${(
            chargesResponse.data.propertyTypeCharges?.others?.perPlot || 0
          ).toLocaleString()}`,
          chargeType: "fixed" as const,
          category: "Property Type",
          isActive: true,
          applicableTo: ["others"],
          subCharges: [
            {
              label: "Per Floor",
              amount:
                chargesResponse.data.propertyTypeCharges?.others?.perFloor || 0,
            },
            {
              label: "Per Plot",
              amount:
                chargesResponse.data.propertyTypeCharges?.others?.perPlot || 0,
            },
          ],
        },

        // Property Base Fee
        {
          _id: "propertyBaseFee",
          name: "Property Base Fee",
          description: "General base fee for all properties",
          amount: chargesResponse.data.propertyBaseFee || 0,
          chargeType: "fixed" as const,
          category: "Base Fee",
          isActive: true,
          applicableTo: ["all"],
        },

        // Risk Adjustments - Wall Material (grouped)
        {
          _id: "wallMaterial",
          name: "Wall Material",
          description:
            "Risk adjustments for different wall materials (Brick, Mud, Wood, Mixed Materials)",
          amount: `Brick: ${
            chargesResponse.data.riskAdjustments?.wallMaterial?.brick || 0
          }%, Mud: ${
            chargesResponse.data.riskAdjustments?.wallMaterial?.mud || 0
          }%, Wood: ${
            chargesResponse.data.riskAdjustments?.wallMaterial?.wood || 0
          }%, Mixed: ${
            chargesResponse.data.riskAdjustments?.wallMaterial
              ?.mixedMaterials || 0
          }%`,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["wallMaterial"],
          subCharges: [
            {
              label: "Brick",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial?.brick || 0,
            },
            {
              label: "Mud",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial?.mud || 0,
            },
            {
              label: "Wood",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial?.wood || 0,
            },
            {
              label: "Mixed Materials",
              amount:
                chargesResponse.data.riskAdjustments?.wallMaterial
                  ?.mixedMaterials || 0,
            },
          ],
        },

        // Risk Adjustments - Building Age (grouped)
        {
          _id: "buildingAge",
          name: "Building Age",
          description:
            "Risk adjustments based on building age (0-5, 5-10, 10-20, 20+ years)",
          amount: `0-5 yrs: ${
            chargesResponse.data.riskAdjustments?.buildingAge?.["0-5"] || 0
          }%, 5-10 yrs: ${
            chargesResponse.data.riskAdjustments?.buildingAge?.["5-10"] || 0
          }%, 10-20 yrs: ${
            chargesResponse.data.riskAdjustments?.buildingAge?.["10-20"] || 0
          }%, 20+ yrs: ${
            chargesResponse.data.riskAdjustments?.buildingAge?.["20+"] || 0
          }%`,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["buildingAge"],
          subCharges: [
            {
              label: "0-5 Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["0-5"] || 0,
            },
            {
              label: "5-10 Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["5-10"] ||
                0,
            },
            {
              label: "10-20 Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["10-20"] ||
                0,
            },
            {
              label: "20+ Years",
              amount:
                chargesResponse.data.riskAdjustments?.buildingAge?.["20+"] || 0,
            },
          ],
        },

        // Risk Adjustments - Other Factors
        {
          _id: "pastLoss",
          name: "Past Loss",
          description: "Risk adjustment for properties with past loss",
          amount: chargesResponse.data.riskAdjustments?.pastLoss || 0,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["pastLoss"],
        },
        {
          _id: "unOccupiedForAwhile",
          name: "Unoccupied For Awhile",
          description: "Risk adjustment for properties unoccupied for awhile",
          amount:
            chargesResponse.data.riskAdjustments?.unOccupiedForAwhile || 0,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["unOccupiedForAwhile"],
        },
        {
          _id: "floodRisk",
          name: "Flood Risk",
          description: "Risk adjustment for properties in flood risk areas",
          amount: chargesResponse.data.riskAdjustments?.floodRisk || 0,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["floodRisk"],
        },
        {
          _id: "specialRisk",
          name: "Special Risk",
          description: "Risk adjustment for properties with special risks",
          amount: chargesResponse.data.riskAdjustments?.specialRisk || 0,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["specialRisk"],
        },
        {
          _id: "repairNeeded",
          name: "Repair Needed",
          description: "Risk adjustment for properties needing repair",
          amount: chargesResponse.data.riskAdjustments?.repairNeeded || 0,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["repairNeeded"],
        },
        {
          _id: "commercialUse",
          name: "Commercial Use",
          description: "Risk adjustment for commercial use properties",
          amount: chargesResponse.data.riskAdjustments?.commercialUse || 0,
          chargeType: "percentage" as const,
          category: "Risk Adjustments",
          isActive: true,
          applicableTo: ["commercialUse"],
        },

        // Safety & Security Discounts - Security/Safety (grouped)
        {
          _id: "securitySafety",
          name: "Security & Safety Features",
          description:
            "Discounts for security and safety features (Estate Gate, CCTV, Security Guards, Strong Locks, No Glass Panels, Occupied)",
          amount: `Gate: ${
            chargesResponse.data.safetySecurityDiscounts?.securitySafety
              ?.estateGate || 0
          }%, CCTV: ${
            chargesResponse.data.safetySecurityDiscounts?.securitySafety
              ?.cctv || 0
          }%, Guards: ${
            chargesResponse.data.safetySecurityDiscounts?.securitySafety
              ?.securityGuards || 0
          }%, Locks: ${
            chargesResponse.data.safetySecurityDiscounts?.securitySafety
              ?.strongLocks || 0
          }%, No Glass: ${
            chargesResponse.data.safetySecurityDiscounts?.securitySafety
              ?.noGlassPanels || 0
          }%, Occupied: ${
            chargesResponse.data.safetySecurityDiscounts?.securitySafety
              ?.occupied || 0
          }%`,
          chargeType: "percentage" as const,
          category: "Safety & Security Discounts",
          isActive: true,
          applicableTo: ["securitySafety"],
          subCharges: [
            {
              label: "Estate Gate",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.estateGate || 0,
            },
            {
              label: "CCTV",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.cctv || 0,
            },
            {
              label: "Security Guards",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.securityGuards || 0,
            },
            {
              label: "Strong Locks",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.strongLocks || 0,
            },
            {
              label: "No Glass Panels",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.noGlassPanels || 0,
            },
            {
              label: "Occupied",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.securitySafety
                  ?.occupied || 0,
            },
          ],
        },

        // Safety & Security Discounts - Fire Safety (grouped)
        {
          _id: "fireSafety",
          name: "Fire Safety Features",
          description:
            "Discounts for fire safety features (Fire Extinguisher, Smoke Alarm, Water Access)",
          amount: `Fire Ext: ${
            chargesResponse.data.safetySecurityDiscounts?.fireSafety
              ?.fireExtinguisher || 0
          }%, Smoke Alarm: ${
            chargesResponse.data.safetySecurityDiscounts?.fireSafety
              ?.smokeAlarm || 0
          }%, Water Access: ${
            chargesResponse.data.safetySecurityDiscounts?.fireSafety
              ?.waterAccess || 0
          }%`,
          chargeType: "percentage" as const,
          category: "Safety & Security Discounts",
          isActive: true,
          applicableTo: ["fireSafety"],
          subCharges: [
            {
              label: "Fire Extinguisher",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.fireSafety
                  ?.fireExtinguisher || 0,
            },
            {
              label: "Smoke Alarm",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.fireSafety
                  ?.smokeAlarm || 0,
            },
            {
              label: "Water Access",
              amount:
                chargesResponse.data.safetySecurityDiscounts?.fireSafety
                  ?.waterAccess || 0,
            },
          ],
        },

        // Extra Coverage Fees (grouped)
        {
          _id: "extraCoverage",
          name: "Extra Coverage Fees",
          description:
            "Additional fees for extended coverage (Theft, Flood Protection, Public Liability, Extended Fire Cover, Burglary Cover)",
          amount: `Theft: ${
            chargesResponse.data.extraCoverageFees?.theft || 0
          }%, Flood: ${
            chargesResponse.data.extraCoverageFees?.floodProtection || 0
          }%, Public Liability: ${
            chargesResponse.data.extraCoverageFees?.publicLiability || 0
          }%, Fire Cover: ${
            chargesResponse.data.extraCoverageFees?.extendedFireCover || 0
          }%, Burglary: ${
            chargesResponse.data.extraCoverageFees?.burglaryCover || 0
          }%`,
          chargeType: "percentage" as const,
          category: "Extra Coverage Fees",
          isActive: true,
          applicableTo: ["extraCoverage"],
          subCharges: [
            {
              label: "Theft",
              amount: chargesResponse.data.extraCoverageFees?.theft || 0,
            },
            {
              label: "Flood Protection",
              amount:
                chargesResponse.data.extraCoverageFees?.floodProtection || 0,
            },
            {
              label: "Public Liability",
              amount:
                chargesResponse.data.extraCoverageFees?.publicLiability || 0,
            },
            {
              label: "Extended Fire Cover",
              amount:
                chargesResponse.data.extraCoverageFees?.extendedFireCover || 0,
            },
            {
              label: "Burglary Cover",
              amount:
                chargesResponse.data.extraCoverageFees?.burglaryCover || 0,
            },
          ],
        },
      ]
    : [];

  const filteredCharges = charges.filter((charge: ChargeItem) => {
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
    } catch (err) {
      const error = err as { data?: { message?: string } };
      addNotification({
        type: "error",
        title: "Delete Failed",
        message:
          error?.data?.message || "Failed to delete charge. Please try again.",
      });
    }
  };

  const categories = Array.from(
    new Set(charges.map((c: ChargeItem) => c.category))
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
                {charges.filter((c: ChargeItem) => c.isActive).length}
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
                {
                  charges.filter((c: ChargeItem) => c.chargeType === "fixed")
                    .length
                }
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
                  charges.filter(
                    (c: ChargeItem) => c.chargeType === "percentage"
                  ).length
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
              {categories.map((cat: string) => (
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
                filteredCharges.map((charge: ChargeItem) => (
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
                      <div className="text-sm">
                        {charge.subCharges && charge.subCharges.length > 1 ? (
                          // Multiple subcharges - show summary and expandable list
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white mb-1">
                              Multiple Values
                            </div>
                            <div className="space-y-1">
                              {charge.subCharges.map((sub, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-600 dark:text-gray-400"
                                >
                                  <span className="font-medium">
                                    {sub.label}:
                                  </span>{" "}
                                  <span className="text-gray-900 dark:text-white">
                                    {charge.chargeType === "percentage"
                                      ? `${sub.amount}%`
                                      : `₦${sub.amount.toLocaleString()}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : charge.subCharges &&
                          charge.subCharges.length === 1 ? (
                          // Single subcharge - show directly
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {charge.chargeType === "percentage"
                                ? `${charge.subCharges[0].amount}%`
                                : `₦${charge.subCharges[0].amount.toLocaleString()}`}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {charge.subCharges[0].label}
                            </div>
                          </div>
                        ) : (
                          // Fallback for charges without subCharges
                          <span className="font-medium text-gray-900 dark:text-white">
                            {typeof charge.amount === "number"
                              ? charge.chargeType === "percentage"
                                ? `${charge.amount}%`
                                : `₦${charge.amount.toLocaleString()}`
                              : charge.amount}
                          </span>
                        )}
                      </div>
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
