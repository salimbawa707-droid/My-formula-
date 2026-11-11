/**
 * Viscosity Estimation Module
 * Evaluates polymer thickener level, SLES/Betaine micellar salt curve, and hydrotropes.
 * Output is honestly flagged as INSUFFICIENT_DATA or an estimated range with scientific caveats.
 */

import { FormulaItem, ViscosityResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function estimateViscosity(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[]
): ViscosityResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalWeightKg = 0;
  let slesQty = 0;
  let saltQty = 0;
  let capbQty = 0;
  let polymerQty = 0;
  let hydrotropeQty = 0;

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qty = item.quantityKg || 0;
    totalWeightKg += qty;

    if (ing.id.includes('sles')) slesQty += qty;
    if (ing.id.includes('sodium-chloride')) saltQty += qty;
    if (ing.id.includes('capb')) capbQty += qty;
    if (ing.category === 'Polymer Thickener / Rheology' && !ing.id.includes('chloride')) polymerQty += qty;
    if (ing.category === 'Hydrotrope / Solvent') hydrotropeQty += qty;
  });

  const batchSizeKg = totalWeightKg > 0 ? totalWeightKg : 100;
  const slesPct = (slesQty / batchSizeKg) * 100;
  const saltPct = (saltQty / batchSizeKg) * 100;
  const polymerPct = (polymerQty / batchSizeKg) * 100;
  const hydrotropePct = (hydrotropeQty / batchSizeKg) * 100;

  // Check if enough thickening parameters are defined
  if (slesPct === 0 && polymerPct === 0) {
    return {
      estimatedViscosityRangeCP: null,
      status: 'INSUFFICIENT_DATA',
      reasoning: 'INSUFFICIENT_DATA: Formulation contains no polymer thickeners (CMC/Xanthan) or SLES-electrolyte micellar thickening system. Viscosity cannot be estimated mathematically without experimental rheometer curves.'
    };
  }

  // Salt-SLES micellar thickening estimation
  if (slesPct > 0) {
    if (saltPct === 0 && polymerPct === 0) {
      return {
        estimatedViscosityRangeCP: [50, 150],
        status: 'ESTIMATED',
        reasoning: 'Water-like thin liquid (~50-150 cP). SLES present without NaCl electrolyte salt addition.'
      };
    }

    if (saltPct >= 0.8 && saltPct <= 2.2) {
      if (hydrotropePct > 2.0) {
        return {
          estimatedViscosityRangeCP: [200, 600],
          status: 'ESTIMATED',
          reasoning: 'Moderately low viscosity (200-600 cP). Hydrotrope content suppresses micellar wormlike growth.'
        };
      }
      return {
        estimatedViscosityRangeCP: [1200, 3500],
        status: 'ESTIMATED',
        reasoning: 'Standard gel liquid viscosity (1200-3500 cP) achieved via SLES/CAPB wormlike micellar salt response (0.8-2.2% NaCl).'
      };
    }

    if (saltPct > 2.5) {
      return {
        estimatedViscosityRangeCP: [100, 400],
        status: 'ESTIMATED',
        reasoning: 'Viscosity drop due to salt over-curve (excess NaCl > 2.5% breaks wormlike micellar structure).'
      };
    }
  }

  if (polymerPct > 0) {
    return {
      estimatedViscosityRangeCP: [800, 2500],
      status: 'ESTIMATED',
      reasoning: 'Polymeric viscosity build (~800-2500 cP) based on cellulosics/xanthan gum addition.'
    };
  }

  return {
    estimatedViscosityRangeCP: null,
    status: 'INSUFFICIENT_DATA',
    reasoning: 'INSUFFICIENT_DATA: Rheological properties require rotational viscometer testing.'
  };
}
