/**
 * Support types for Chemical Equilibrium pH Engine and Stoichiometric Neutralization
 */

export type ProductCategoryId =
  | 'liquid_laundry'
  | 'hand_dishwash'
  | 'auto_dishwasher'
  | 'general_cleaner'
  | string;

export function normalizeProductCategory(categoryRaw: string): ProductCategoryId {
  const norm = categoryRaw.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (norm.includes('dishwash') || norm.includes('manual_dish')) return 'hand_dishwash';
  if (norm.includes('dishwasher') || norm.includes('auto_dish')) return 'auto_dishwasher';
  return 'liquid_laundry';
}

export function getScientificProductProfile(category: ProductCategoryId) {
  return {
    category,
    physicalForm: 'LIQUID' as const,
    isPowder: false
  };
}

export interface IngredientInput {
  id?: string;
  ingredientId?: string;
  name?: string;
  commercialName?: string;
  type?: string;
  rawKg?: number;
  rawPercent?: number;
  weightKg?: number;
  percentage?: number;
  activePercent?: number;
  activePercentage?: number;
  acidValue?: number;
  costPerKg?: number | null;
  category?: string;
  function?: string;
  hlb?: number;
  density?: number;
  pHEffect?: 'acid' | 'base' | 'neutral' | 'buffer';
  pKa?: number;
  purity?: number;
}

export interface FormulationIngredient {
  id?: string;
  ingredientId?: string;
  name?: string;
  commercialName?: string;
  category?: string;
  percent?: number;
  percentage?: number;
  percentageInFormula?: number;
  activePercent?: number;
  activeMatterPct?: number;
  activeMatterPurity?: number;
  activeMatterInputSource?: 'SOURCE_BACKED' | 'CATALOG_DEFAULT' | 'USER_ENTERED' | 'UNKNOWN';
  costPerKg?: number | null;
  hlb?: number;
  function?: string;
  casNumber?: string | null;
  canonicalIngredientId?: string;
}

export type ScientificMaturity =
  | 'MEASURED'
  | 'LAB_VALIDATED'
  | 'EMPIRICALLY_CALIBRATED'
  | 'SOURCE_BACKED'
  | 'MODEL_PREDICTION'
  | 'ESTIMATED'
  | 'HEURISTIC_SCREENING'
  | 'UNKNOWN';

export interface ScientificResult<T> {
  value: T;
  unit?: string;
  property: string;
  maturity: ScientificMaturity;
  validationStatus:
    | 'UNVALIDATED'
    | 'DATA_PENDING'
    | 'DATA_INSUFFICIENT'
    | 'VALIDATED_WITH_LIMITATIONS';
  uncertainty?: Array<{
    type: string;
    description?: string;
  }>;
  applicabilityScope?: string[];
  modelVersion?: string;
  evidenceIds?: string[];
  limitations?: string[];
  assumptions?: string[];
  timestamp: string;
}
