export type UserRole =
  | "super-admin"
  | "underwriter"
  | "finance-admin"
  | "compliance-officer"
  | "support-agent"
  | "content-ops"
  | "claims-manager"
  | "risk-analyst"
  | "data-analyst"
  | "devops-admin";


// Define the auth-related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    role: string;
    permissions: string[];
  };
  token: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

  // Users 
export interface GetAllUsersResponse {
  message: string
  data: Users[]
  metaData: UsersMetaData
}

export interface Users {
  _id: string
  firstName?: string
  lastName?: string
  email: string
  emailVerified: boolean
  phoneNumber: string
  createdAt: string
  updatedAt: string
  fullName?: string
}

export interface UsersMetaData {
  totalUsers: number
  page: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface UserByIDResponseData {
  message: string
  data: UserByIDData
}

export interface UserByIDData {
  _id: string
  firstName: string
  lastName: string
  email: string
  emailVerified: boolean
  disabled: boolean
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export interface UserWalletResponse {
  message: string
  data: UserWalletData
}

export interface UserWalletData {
  _id: string
  balance: number
  totalAmountFunded: number
  hasPin: boolean
}

export interface DisableUserResponse {
  message: string
  data: DisableUserData
}

export interface DisableUserData {
  userId: string
  email: string
  disabledAt: string
}

export interface EnableUserResponse {
  message: string
  data: EnableUserData
}

export interface EnableUserData {
  userId: string
  email: string
}

// Quotes
export interface QuotesResponseData {
  message: string
  data: QuoteData[]
  metaData: MetaData
}

export interface QuoteData {
  expired?: boolean
  _id: string
  user: QuoteUser
  status: string
  charges: Charges
  category: string
  paymentFrequency: string
  extraCoverage: ExtraCoverage
  wallMaterial: string
  floodRisk: string
  specialRisk: string
  roofMaterial: string
  buildingAge: string
  rent: boolean
  residentDomesticStaff: boolean
  repairNeeded: boolean
  furnished: boolean
  commercialUse: boolean
  pastInsurance: boolean
  pastInsuranceDetails: string
  currentlyInsured: boolean
  pastLoss: boolean
  pastLossDetails: string
  address: string
  propertyValue: number
  propertyAge: number
  totalAmount: number
  amountPaid: number
  nextPayment: string
  policyPeriod: string
  securitySafety: SecuritySafety
  fireSafety: FireSafety
  createdAt: string
  updatedAt: string
  policyCode: string
}

export interface QuoteUser {
  _id: string
  email: string
  phoneNumber: string
}

export interface Charges {
  perRoom: number
  perBed: number
}

export interface ExtraCoverage {
  theft: boolean
  floodProtection: boolean
  publicLiability: boolean
  extendedFireCover: boolean
  burglaryCover: boolean
}

export interface SecuritySafety {
  estateGate: boolean
  cctv: boolean
  securityGuards: boolean
  strongLocks: boolean
  noGlassPanels: boolean
  occupied: boolean
}

export interface FireSafety {
  fireExtinguisher: boolean
  smokeAlarm: boolean
  waterAccess: boolean
}

export interface MetaData {
  totalQuotes: number
  page: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// charges
export interface ChargesResponse {
  message: string
  data: ChargesData
}

export interface ChargesData {
  propertyTypeCharges: PropertyTypeCharges
  riskAdjustments: RiskAdjustments
  safetySecurityDiscounts: SafetySecurityDiscounts
  extraCoverageFees: ExtraCoverageFees
  _id: string
  createdBy: CreatedBy
  propertyBaseFee: number
  createdAt: string
  updatedAt: string
  __v: number
  lastUpdatedBy: LastUpdatedBy
}

export interface PropertyTypeCharges {
  bungalow: Bungalow
  duplex: Duplex
  storeyBuilding: StoreyBuilding
  flats: Flats
  singleOccOffice: SingleOccOffice
  singleOccResidential: SingleOccResidential
  hotelHostelGuest: HotelHostelGuest
  recreationCinema: RecreationCinema
  school: School
  petrolGasStation: PetrolGasStation
  hospitalClinic: HospitalClinic
  multiOccBusiness: MultiOccBusiness
  multiOccMixedRes: MultiOccMixedRes
  others: Others
}

export interface Bungalow {
  perPlot: number
}

export interface Duplex {
  perFloor: number
  perPlot: number
}

export interface StoreyBuilding {
  perFloor: number
  perPlot: number
}

export interface Flats {
  perPlot: number
}

export interface SingleOccOffice {
  perFloor: number
  perPlot: number
}

export interface SingleOccResidential {
  perFloor: number
  perPlot: number
}

export interface HotelHostelGuest {
  perRoom: number
  perBed: number
}

export interface RecreationCinema {
  perFloor: number
  perCinemaSeat: number
}

export interface School {
  perBlock: number
  perPupilSeat: number
  perPlot: number
}

export interface PetrolGasStation {
  perPump: number
}

export interface HospitalClinic {
  perFloor: number
  perPlot: number
}

export interface MultiOccBusiness {
  perApartmentOfficeWing: number
}

export interface MultiOccMixedRes {
  perApartmentOfficeWing: number
}

export interface Others {
  perFloor: number
  perPlot: number
}

export interface RiskAdjustments {
  wallMaterial: WallMaterial
  buildingAge: BuildingAge
  pastLoss: number
  unOccupiedForAwhile: number
  floodRisk: number
  specialRisk: number
  repairNeeded: number
  commercialUse: number
}

export interface WallMaterial {
  brick: number
  mud: number
  wood: number
  mixedMaterials: number
}

export interface BuildingAge {
  "0-5": number
  "5-10": number
  "10-20": number
  "20+": number
}

export interface SafetySecurityDiscounts {
  securitySafety: ChargesSecuritySafety
  fireSafety: ChargesFireSafety
}

export interface ChargesSecuritySafety {
  estateGate: number
  cctv: number
  securityGuards: number
  strongLocks: number
  noGlassPanels: number
  occupied: number
}

export interface ChargesFireSafety {
  fireExtinguisher: number
  smokeAlarm: number
  waterAccess: number
}

export interface ExtraCoverageFees {
  theft: number
  floodProtection: number
  publicLiability: number
  extendedFireCover: number
  burglaryCover: number
}

export interface CreatedBy {
  _id: string
  email: string
}

export interface LastUpdatedBy {
  _id: string
  email: string
}
