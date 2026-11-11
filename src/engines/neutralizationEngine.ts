/**
 * Stoichiometric Neutralization Engine (Remediated)
 * Powered by Authoritative StoichiometricNeutralizationEngine.
 *
 * Removes hardcoded 50% caustic assumptions.
 * Dynamically computes:
 * - Active acid mass & reactive equivalents
 * - Active base mass & reactive equivalents
 * - Limiting reagent
 * - Pure NaOH demand (g)
 * - Commercial caustic demand (for flakes 98%, 50% lye, KOH, etc.)
 * - Neutralization fraction (0.0 to 1.0)
 * - Stoichiometric reaction-generated water (H+ + OH- -> H2O)
 * - Excess acid / base equivalents
 */

import { FormulaItem, NeutralizationResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { StoichiometricNeutralizationEngine } from './ph/stoichiometricNeutralizationEngine';
import { FormulationIngredient } from './ph/supportTypes';

export function calculateNeutralization(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[],
  batchSizeKg: number = 100
): NeutralizationResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalWeightKg = 0;
  items.forEach(item => {
    totalWeightKg += (item.quantityKg || 0);
  });
  const effectiveBatchKg = totalWeightKg > 0 ? totalWeightKg : batchSizeKg;

  // Prepare FormulationIngredient input for the authoritative engine
  let primaryAcidName = '';
  let primaryAcidActiveMassKg = 0;
  let primaryAcidMoles = 0;
  let causticInFormulaKg = 0;
  let causticActiveFraction = 0.50;
  let causticCommercialName = 'Caustic Soda 50% Liquid';

  const engineInputs: FormulationIngredient[] = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    const percent = (qtyKg / effectiveBatchKg) * 100;
    const activePercent = item.activeConcentrationPercentOverride !== undefined
      ? item.activeConcentrationPercentOverride
      : ing.commercialConcentrationPercent;

    if (ing.id.includes('labsa')) {
      primaryAcidName = ing.commercialName;
      primaryAcidActiveMassKg += qtyKg * (activePercent / 100);
      const mw = ing.molecularWeight || 322.0;
      primaryAcidMoles += (qtyKg * (activePercent / 100) * 1000) / mw;
    }

    if (ing.isBasic || ing.category === 'Neutralizing Agent / Base') {
      causticInFormulaKg += qtyKg;
      causticActiveFraction = activePercent / 100;
      causticCommercialName = ing.commercialName;
    }

    return {
      id: ing.id,
      name: ing.chemicalName || ing.commercialName,
      category: ing.category,
      percent,
      activePercent,
      costPerKg: ing.costPerKg
    };
  });

  const evaluation = StoichiometricNeutralizationEngine.evaluatePrimaryNeutralization(
    engineInputs,
    effectiveBatchKg
  );
  const state = evaluation.value;

  // Pure NaOH Demand (g) based on total initial acid equivalents
  // 1 equivalent acid requires 1 mole NaOH = 40.00 g NaOH
  const pureNaOHDemandGrams = state.totalAcidEquivalentsInitial * 40.00;
  const pureKOHDemandGrams = state.totalAcidEquivalentsInitial * 56.11;

  // Commercial caustic demand based on actual base activeFraction present in formula (e.g. 50% lye or 98% flakes)
  const activeFrac = causticActiveFraction > 0 ? causticActiveFraction : 0.50;
  const commercialCausticDemandKg = (pureNaOHDemandGrams / (activeFrac * 1000));

  let status: NeutralizationResult['neutralizationStatus'] = 'NO_REACTION';
  if (state.status === 'FULLY_NEUTRALIZED') status = 'FULLY_NEUTRALIZED';
  else if (state.status === 'UNDER_NEUTRALIZED' || state.status === 'ACID_EXCESS') status = 'UNDER_NEUTRALIZED';
  else if (state.status === 'BASE_EXCESS') status = 'BASE_EXCESS';
  else if (state.status === 'INSUFFICIENT_DATA') status = 'INSUFFICIENT_DATA';
  else status = 'NO_REACTION';

  const equation = `R-SO3H (LABSA) + NaOH -> R-SO3Na (LAS) + H2O`;
  const waterGenGrams = state.waterGeneratedGrams ?? 0;
  const notes = state.totalAcidEquivalentsInitial > 0
    ? `Acid Equivalents: ${state.totalAcidEquivalentsInitial.toFixed(3)} eq. Base Equivalents: ${state.totalBaseEquivalentsInitial.toFixed(3)} eq. Neutralization Extent: ${((state.primaryNeutralizationFraction || 0) * 100).toFixed(1)}%. Water Generated: ${waterGenGrams.toFixed(1)} g.`
    : 'No primary acid requiring stoichiometric neutralization was detected in this formulation.';

  return {
    acidName: primaryAcidName || 'LABSA Sulfonic Acid',
    acidActiveMassKg: parseFloat(primaryAcidActiveMassKg.toFixed(2)),
    acidMoles: parseFloat(primaryAcidMoles.toFixed(2)),
    acidReactiveEquivalents: parseFloat(state.totalAcidEquivalentsInitial.toFixed(3)),
    baseReactiveEquivalents: parseFloat(state.totalBaseEquivalentsInitial.toFixed(3)),
    limitingReagent: state.limitingReagent,
    neutralizationFraction: state.primaryNeutralizationFraction !== null ? state.primaryNeutralizationFraction : 1.0,
    neutralizationStatus: status,
    pureNaOHDemandGrams: parseFloat(pureNaOHDemandGrams.toFixed(2)),
    pureKOHDemandGrams: parseFloat(pureKOHDemandGrams.toFixed(2)),
    commercialCausticDemandKg: parseFloat(commercialCausticDemandKg.toFixed(3)),
    reactionGeneratedWaterGrams: parseFloat(waterGenGrams.toFixed(1)),
    excessAcidEquivalents: parseFloat(state.excessAcidEquivalents.toFixed(3)),
    excessBaseEquivalents: parseFloat(state.excessBaseEquivalents.toFixed(3)),
    equation,
    notes,
    // Backward compatibility aliases
    labsaQuantityKg: parseFloat(primaryAcidActiveMassKg.toFixed(2)),
    labsaMoles: parseFloat(primaryAcidMoles.toFixed(2)),
    causticSodaSolutionKgNeeded: parseFloat(commercialCausticDemandKg.toFixed(3)),
    causticSodaInFormulaKg: parseFloat(causticInFormulaKg.toFixed(2)),
    excessAcidMoles: parseFloat(state.excessAcidEquivalents.toFixed(3)),
    excessBaseMoles: parseFloat(state.excessBaseEquivalents.toFixed(3)),
    reactionWaterGeneratedKg: parseFloat((waterGenGrams / 1000).toFixed(3))
  };
}
