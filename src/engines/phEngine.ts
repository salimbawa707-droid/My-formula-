/**
 * Equilibrium pH Estimation Engine
 * Integrates rigorous chemical equilibrium solver (PHEngineV2)
 * using charge-balance, Davies activity coefficients, and Newton-Raphson solver.
 */

import { FormulaItem, PHEstimationResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { PHEngineV2 } from './ph/pHEngineV2';
import { IngredientInput } from './ph/supportTypes';

export function estimatePH(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[],
  options?: { temperatureC?: number; targetPH?: number }
): PHEstimationResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  const totalMassKg = items.reduce((sum, item) => sum + (Number.isFinite(item.quantityKg) ? item.quantityKg : 0), 0);
  const missingInformation: string[] = [];
  const assumptions: string[] = [];
  const warnings: string[] = [];

  if (totalMassKg <= 0) {
    return {
      estimatedPH: null,
      solverConvergence: 'OUT_OF_BOUNDS',
      assumptions: ['Total formulation mass must be greater than zero.'],
      missingInformation: ['No formulation ingredients specified.'],
      warnings: ['Cannot calculate pH for empty formula.']
    };
  }

  // Map FormulaItem list to PHEngineV2's IngredientInput format
  const ingredientInputs: IngredientInput[] = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const weightPct = (item.quantityKg / totalMassKg) * 100;
    const activePercent = (ing.commercialConcentrationPercent ?? (ing.activeFraction ? ing.activeFraction * 100 : 100));
    
    if (ing.dataStatus === 'UNKNOWN') {
      missingInformation.push(`Chemical identity / acid-base constant not fully specified for ${ing.commercialName}.`);
    }

    return {
      name: ing.chemicalName || ing.commercialName,
      rawPercent: weightPct,
      weightPct,
      rawKg: item.quantityKg,
      weightKg: item.quantityKg,
      activePercent,
      activePct: activePercent,
      id: ing.id,
      category: ing.category,
      purity: activePercent,
      density: ing.density
    };
  });

  const rawResult = PHEngineV2.calculatePH(ingredientInputs, totalMassKg, {
    temperatureC: options?.temperatureC ?? 25.0,
    targetPH: options?.targetPH,
    activityModel: 'davies'
  });

  assumptions.push(...rawResult.assumptions);
  warnings.push(...rawResult.warnings);

  // Map solver convergence status
  let solverConvergence: PHEstimationResult['solverConvergence'] = 'CONVERGED';
  if (rawResult.status === 'NON_CONVERGED') {
    solverConvergence = 'CHARGE_BALANCE_FAILED';
  } else if (rawResult.status === 'INSUFFICIENT_DATA') {
    solverConvergence = 'OUT_OF_BOUNDS';
  }

  const estimatedPH = rawResult.pH;
  const bufferCapacityBeta = rawResult.bufferCapacity;
  const isBufferingSystem = (bufferCapacityBeta ?? 0) > 0.02;

  let estimatedPHMin: number | undefined;
  let estimatedPHMax: number | undefined;

  if (estimatedPH !== null) {
    estimatedPHMin = Math.max(0.5, parseFloat((estimatedPH - 0.3).toFixed(2)));
    estimatedPHMax = Math.min(14.0, parseFloat((estimatedPH + 0.3).toFixed(2)));
  } else if (rawResult.status === 'INSUFFICIENT_DATA') {
    // If only neutral surfactants & water are present without any acid/base/buffer,
    // note the neutral formulation window while flagging absence of pH buffers.
    const hasOnlyNeutrals = items.every(item => {
      const ing = getIngredient(item.ingredientId);
      const cat = (ing.category || '').toLowerCase();
      return cat.includes('surfactant') || cat.includes('solvent') || ing.id.includes('water') || cat.includes('additive');
    });
    if (hasOnlyNeutrals) {
      estimatedPHMin = 6.5;
      estimatedPHMax = 7.5;
      assumptions.push('Formulation contains only neutral surfactants and solvent; baseline neutral pH expected (~6.5-7.5) with minimal buffer resistance.');
    }
  }

  const detailedSpeciation: { species: string; concentrationMolPerL: number; charge: number }[] = [];
  if (rawResult.details?.speciation) {
    for (const group of (rawResult.details.speciation as any[])) {
      if (Array.isArray(group.species)) {
        for (const sp of group.species) {
          detailedSpeciation.push({
            species: sp.speciesName,
            concentrationMolPerL: sp.molarConcentration,
            charge: sp.charge
          });
        }
      }
    }
  }

  return {
    estimatedPH,
    estimatedPHMin,
    estimatedPHMax,
    solverConvergence,
    bufferCapacityBeta,
    ionicStrength: rawResult.ionicStrength,
    solverIterations: rawResult.iterations,
    isBufferingSystem,
    excessAcidMoles: rawResult.excessAcidEquivalents,
    excessBaseMoles: rawResult.excessBaseEquivalents,
    assumptions,
    missingInformation,
    warnings,
    detailedSpeciation
  };
}
