/**
 * Detergent Formula Expert — Domain Types
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
  chelationCapacityMgCaCO3PerG?: number; // mg CaCO3 / g raw material
  solubilityGPer100gWater?: number;
  ionicType?: 'anionic' | 'nonionic' | 'cationic' | 'amphoteric' | 'non_ionic_special';
  functionalRole: string;
  costPerKg: number; // USD / kg
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
  totalActiveMatterPercent: number;
  totalActiveMassKg: number;
  anionicActivePercent: number;
  nonionicActivePercent: number;
  amphotericActivePercent: number;
  cationicActivePercent: number;
  breakdownByIngredient: {
    ingredientId: string;
    commercialName: string;
    quantityKg: number;
    weightPercent: number;
    activeFraction: number;
    activeContributionPercent: number;
  }[];
}

export interface NeutralizationResult {
  labsaQuantityKg: number;
  labsaActiveMassKg: number;
  labsaMoles: number;
  requiredPureNaOHGrams: number;
  requiredPureKOHGrams: number;
  causticSodaSolutionKgNeeded: number; // based on caustic %
  causticSodaInFormulaKg: number;
  neutralizationStatus: 'EXACT' | 'EXCESS_ACID' | 'EXCESS_BASE' | 'NO_ACID_REQUIRING_NEUTRALIZATION';
  excessAcidMoles: number;
  excessBaseMoles: number;
  equation: string;
  notes: string;
}

export interface PHEstimationResult {
  estimatedPH: number;
  estimatedPHMin: number;
  estimatedPHMax: number;
  solverConvergence: 'CONVERGED' | 'APPROXIMATED' | 'FAILED';
  bufferCapacityBeta: number;
  isBufferingSystem: boolean;
  assumptions: string[];
  missingInformation: string[];
  warnings: string[];
}

export interface ChelationResult {
  totalBindingCapacityMgCaCO3: number;
  ppmCaCO3ChelationCapacity: number; // at batch volume
  waterHardnessPpmCaCO3: number;
  hardnessLoadMgCaCO3: number;
  chelationCapacityRatio: number;
  safetyMarginPercent: number;
  isAdequateForHardness: boolean;
  chelatorBreakdown: {
    ingredientId: string;
    commercialName: string;
    quantityKg: number;
    bindingCapacityMgCaCO3: number;
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
  directMaterialCostUSD: number;
  costPerKgUSD: number;
  costPerLiterUSD: number;
  suggestedManufacturingCostUSD: number;
  suggestedRetailPriceUSD: number;
  grossMarginPercentAtRetail: number;
  ingredientCostBreakdown: {
    ingredientId: string;
    commercialName: string;
    quantityKg: number;
    costPerKgUSD: number;
    itemTotalUSD: number;
    costPercentOfBatch: number;
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
  status: 'PASSED' | 'WARNING' | 'INSUFFICIENT_DATA';
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
    activeMatterPercent: number;
    estimatedPH: string;
    chelationCapacityPpm: number;
    costPerKgUSD: number;
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
