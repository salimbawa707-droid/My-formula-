/**
 * Detergent Formula Expert — Domain Types
 * Strictly supports two categories: LIQUID DETERGENTS & DISH WASH
 */

export type MainCategory = 'LIQUID DETERGENTS' | 'DISH WASH';

export type LiquidDetergentSubcategory =
  | 'hand_wash_laundry'
  | 'top_load_laundry'
  | 'front_load_laundry'
  | 'general_laundry'
  | 'concentrated_laundry';

export type DishWashSubcategory =
  | 'hand_dishwash'
  | 'auto_dishwasher';

export type ProductSubcategory = LiquidDetergentSubcategory | DishWashSubcategory;

export type DataStatus = 'VERIFIED_SPECIFICATION' | 'ESTIMATED_WITH_ASSUMPTIONS' | 'UNKNOWN';

export type IngredientCategory =
  | 'Anionic Surfactant'
  | 'Nonionic Surfactant'
  | 'Cationic Surfactant'
  | 'Amphoteric Surfactant'
  | 'Neutralizing Agent / Base'
  | 'Acid / pH Adjuster'
  | 'Chelating Agent / Builder'
  | 'Alkaline Builder'
  | 'Hydrotrope / Solvent'
  | 'Polymer Thickener / Rheology'
  | 'Enzyme'
  | 'Preservative / Biocide'
  | 'Fragrance / Colorant'
  | 'Water / Base Solvent'
  | 'Other Additive';

export interface MasterIngredient {
  id: string;
  chemicalName: string;
  commercialName: string;
  category: IngredientCategory;
  casNumber?: string;
  molecularWeight?: number; // g/mol
  activeFraction: number; // e.g. 0.90 for 90%
  commercialConcentrationPercent: number; // e.g. 90
  density: number; // g/mL
  typicalPH?: number;
  pKaValues?: number[];
  hlb?: number;
  isAcidic?: boolean;
  isBasic?: boolean;
  equivalentWeight?: number; // g/eq
  chelationCapacityMgCaCO3PerG?: number; // mg CaCO3 / g raw material (commercial as-supplied basis)
  theoreticalActiveCapacityMgPerG?: number; // mg CaCO3 / g 100% active chemical
  capacityBasis?: 'COMMERCIAL_PRODUCT' | 'ACTIVE_CHEMICAL';
  solubilityGPer100gWater?: number;
  ionicType?: 'anionic' | 'nonionic' | 'cationic' | 'amphoteric' | 'non_ionic_special';
  functionalRole: string;
  costPerKg: number | null; // INR (₹) / kg (user-controlled, default null)
  supplierName?: string;
  gradePurchased?: string;
  purchaseDate?: string;
  notes?: string;
  supplierSpec?: string;
  dataSource: string;
  dataStatus: DataStatus;
  missingInformationNotes?: string;
}

export interface FormulaItem {
  ingredientId: string;
  quantityKg: number;
  activeConcentrationPercentOverride?: number;
  costPerKgOverride?: number;
  notes?: string;
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  mainCategory: MainCategory;
  subcategory: ProductSubcategory;
  batchSizeKg: number;
  items: FormulaItem[];
  targetActiveMatterMin?: number;
  targetActiveMatterMax?: number;
  targetPHMin?: number;
  targetPHMax?: number;
  targetViscosityMin?: number; // cP
  targetViscosityMax?: number;
  waterHardnessPpmCaCO3?: number; // default e.g. 150 ppm
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}

export interface ActiveMatterResult {
  surfactantActiveMatterPercent: number;
  totalSurfactantActiveMatterPercent?: number; // alias
  totalSurfactantActiveMassKg: number;
  totalActiveMatterPercent: number; // SSOT alias
  totalActiveMassKg: number; // SSOT alias
  anionicActivePercent: number;
  nonionicActivePercent: number;
  amphotericActivePercent: number;
  cationicActivePercent: number;
  nonSurfactantActiveMassKg: number;
  nonSurfactantSolidsPercent?: number;
  totalDrySolidsPercent?: number;
  totalNonVolatileSolidsPercent?: number;
  breakdownByIngredient: {
    ingredientId: string;
    commercialName: string;
    category: IngredientCategory;
    isSurfactant: boolean;
    quantityKg: number;
    weightPercent: number;
    activeFraction: number;
    activeContributionPercent: number;
    activeMassKg: number;
  }[];
}

export interface NeutralizationResult {
  acidName: string;
  acidActiveMassKg: number;
  acidMoles: number;
  acidReactiveEquivalents: number;
  baseReactiveEquivalents: number;
  limitingReagent: 'ACID' | 'BASE' | 'STOICHIOMETRIC' | 'STOICHIOMETRIC_EQUIVALENCE' | 'NONE' | 'UNKNOWN';
  neutralizationFraction: number; // 0.0 to 1.0
  neutralizationStatus: 'FULLY_NEUTRALIZED' | 'UNDER_NEUTRALIZED' | 'BASE_EXCESS' | 'EXCESS_ACID' | 'EXCESS_BASE' | 'NO_REACTION' | 'INSUFFICIENT_DATA';
  pureNaOHDemandGrams: number;
  pureKOHDemandGrams: number;
  commercialCausticDemandKg: number;
  reactionGeneratedWaterGrams: number;
  excessAcidEquivalents: number;
  excessBaseEquivalents: number;
  equation: string;
  notes: string;
  // Aliases
  labsaQuantityKg?: number;
  labsaMoles?: number;
  causticSodaSolutionKgNeeded?: number;
  causticSodaInFormulaKg?: number;
  excessAcidMoles?: number;
  excessBaseMoles?: number;
  reactionWaterGeneratedKg?: number;
}

export interface PHEstimationResult {
  estimatedPH: number | null;
  estimatedPHMin?: number;
  estimatedPHMax?: number;
  pH?: number | null;
  status?: 'CONVERGED' | 'INSUFFICIENT_DATA' | 'APPROXIMATED' | 'FAILED' | 'NON_CONVERGED';
  solverConvergence: 'CONVERGED' | 'APPROXIMATED' | 'FAILED' | 'CHARGE_BALANCE_FAILED' | 'OUT_OF_BOUNDS';
  solverStatus?: string;
  solverIterations?: number;
  iterations?: number;
  ionicStrength?: number | null;
  bufferCapacityBeta?: number | null;
  activityModel?: string;
  isBufferingSystem?: boolean;
  excessAcidMoles?: number;
  excessBaseMoles?: number;
  detailedSpeciation?: { species: string; concentrationMolPerL: number; charge?: number }[];
  speciation?: { species: string; concentrationMolPerL: number }[];
  assumptions: string[];
  missingInformation: string[];
  warnings: string[];
}

export interface ChelationResult {
  totalBindingCapacityMgCaCO3: number;
  totalActiveBindingCapacityMgCaCO3?: number;
  pureActiveCapacityMgCaCO3?: number;
  commercialCapacityMgCaCO3?: number;
  actualWaterVolumeLiters?: number;
  waterVolumeLiters?: number;
  ppmCaCO3ChelationCapacity: number;
  waterHardnessPpmCaCO3: number;
  hardnessLoadMgCaCO3: number;
  chelationCapacityRatio: number;
  safetyMarginPercent: number;
  isAdequateForHardness: boolean;
  warnings?: string[];
  chelatorBreakdown: {
    ingredientId: string;
    commercialName: string;
    quantityKg: number;
    activeFraction: number;
    capacityBasis?: 'COMMERCIAL_PRODUCT' | 'ACTIVE_CHEMICAL';
    pureActiveCapacityMgPerG?: number;
    commercialCapacityMgPerG?: number;
    bindingPerG?: number;
    bindingCapacityMgCaCO3: number;
    activeBindingCapacityMgCaCO3?: number;
    mechanism?: string;
    phOperatingRange?: { min: number; max: number; optimal?: number };
    isWithinPhWindow?: boolean;
    scientificStatus?: string;
    notes?: string;
  }[];
}

export interface HLBResult {
  weightedHLB: number | null;
  nonionicRatioPercent: number;
  nonionicIngredientCount: number;
  isApplicable: boolean;
  notes: string;
}

export interface DensityResult {
  calculatedDensityGPerML: number;
  totalVolumeLiters: number;
  assumptions: string[];
}

export interface ViscosityResult {
  estimatedViscosityRangeCP: [number, number] | null;
  status: 'ESTIMATED' | 'INSUFFICIENT_DATA';
  reasoning: string;
}

export interface CostingResult {
  currency: 'INR';
  isCostingComplete: boolean;
  unpricedIngredientNames: string[];
  knownSubtotalCostINR: number;
  directMaterialCostINR: number;
  costPerKgINR: number;
  costPerLiterINR: number;
  totalBatchWeightKg?: number;
  packagingCostINR?: number | null;
  laborCostINR?: number | null;
  electricityCostINR?: number | null;
  overheadCostINR?: number | null;
  transportationCostINR?: number | null;
  otherCostINR?: number | null;
  distributorMarginPercent?: number | null;
  retailerMarginPercent?: number | null;
  desiredProfitMarginPercent?: number | null;
  totalManufacturingCostINR?: number | null;
  suggestedSellingPriceINR?: number | null;
  // Aliases for backwards compatibility where needed
  directMaterialCostUSD: number;
  costPerKgUSD: number;
  costPerLiterUSD: number;
  ingredientCostBreakdown: {
    ingredientId: string;
    commercialName: string;
    quantityKg: number;
    costPerKgINR: number | null;
    hasPrice?: boolean;
    itemTotalINR: number;
    costPercentOfBatch: number;
    // USD aliases
    costPerKgUSD: number | null;
    itemTotalUSD: number;
  }[];
}

export interface CompatibilityResult {
  isCompatible: boolean;
  warnings: string[];
  conflicts: {
    type: 'INCOMPATIBLE_IONIC' | 'PH_INSTABILITY' | 'SOLUBILITY_EXCEEDED' | 'SURFACTANT_MISMATCH';
    severity: 'WARNING' | 'CRITICAL';
    message: string;
  }[];
}

export interface AnalysisStageReport {
  stageNumber: number;
  stageName: string;
  inputsSummary: Record<string, any>;
  calculationMethod: string;
  equationUsed: string;
  actualCalculatedResult: Record<string, any>;
  assumptions: string[];
  missingData: string[];
  warnings: string[];
  status: 'CALCULATED' | 'WARNING' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
}

export interface FormulaAnalysisReport {
  formulaId: string;
  formulaName: string;
  mainCategory: MainCategory;
  subcategory: ProductSubcategory;
  batchSizeKg: number;
  massBalance: {
    totalWeightKg: number;
    waterQuantityKg: number;
    waterPercent: number;
    discrepancyFrom100Percent: number;
    isBalanced100Percent: boolean;
  };
  stages: AnalysisStageReport[];
  overallSummary: {
    surfactantActiveMatterPercent: number;
    activeMatterPercent: number; // alias
    estimatedPH: string;
    chelationCapacityPpm: number;
    costPerKgINR: number;
    costPerKgUSD: number; // alias
    productRoutingSuitability: 'OPTIMAL' | 'ACCEPTABLE' | 'NON_COMPLIANT';
    routingNotes: string[];
  };
}

export interface ManufacturingBatchRecord {
  id: string;
  formulaId: string;
  formulaName: string;
  batchNumber: string;
  plannedBatchSizeKg: number;
  actualBatchSizeKg: number;
  date: string;
  operatorName: string;
  ingredientAdditions: {
    ingredientId: string;
    commercialName: string;
    targetQtyKg: number;
    actualQtyKg: number;
    lotNumber?: string;
  }[];
  measuredPH?: number;
  measuredViscosityCP?: number;
  measuredDensityGPerML?: number;
  notes?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}
