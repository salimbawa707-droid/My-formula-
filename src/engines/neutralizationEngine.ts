/**
 * Stoichiometric Neutralization Calculation Engine
 * Calculates exact alkali demand (NaOH / KOH / TEA) for LABSA neutralization
 */

import { FormulaItem, NeutralizationResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function calculateNeutralization(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[]
): NeutralizationResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let labsaQuantityKg = 0;
  let labsaActiveFraction = 0.90;
  let labsaMW = 322.0;

  let causticSodaInFormulaKg = 0;
  let causticActiveFraction = 0.50; // e.g. 50% caustic liquid
  let causticMW = 40.0;

  let totalAcidMoles = 0;
  let totalBaseMoles = 0;

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    const activeFrac = item.activeConcentrationPercentOverride !== undefined
      ? item.activeConcentrationPercentOverride / 100
      : ing.activeFraction;

    if (ing.id.includes('labsa')) {
      labsaQuantityKg += qtyKg;
      labsaActiveFraction = activeFrac;
      labsaMW = ing.molecularWeight || 322.0;
      const labsaActiveMassG = qtyKg * activeFrac * 1000;
      const moles = labsaActiveMassG / labsaMW;
      totalAcidMoles += moles;
    } else if (ing.isBasic || ing.category === 'Neutralizing Agent / Base') {
      causticSodaInFormulaKg += qtyKg;
      causticActiveFraction = activeFrac;
      const baseMW = ing.molecularWeight || 40.0;
      const activeBaseMassG = qtyKg * activeFrac * 1000;
      const moles = activeBaseMassG / baseMW;
      totalBaseMoles += moles;
    }
  });

  const labsaActiveMassKg = labsaQuantityKg * labsaActiveFraction;
  const labsaMoles = (labsaActiveMassKg * 1000) / labsaMW;

  // Pure NaOH required (g) = Moles * 40.00 g/mol
  const requiredPureNaOHGrams = labsaMoles * 40.00;
  const requiredPureKOHGrams = labsaMoles * 56.11;

  // Caustic Soda 50% Solution kg needed = requiredPureNaOHGrams / (0.50 * 1000)
  const causticSodaSolutionKgNeeded = requiredPureNaOHGrams / (0.50 * 1000);

  const moleDiff = totalBaseMoles - totalAcidMoles;
  let status: NeutralizationResult['neutralizationStatus'] = 'EXACT';
  let excessAcidMoles = 0;
  let excessBaseMoles = 0;

  if (labsaQuantityKg === 0) {
    status = 'NO_ACID_REQUIRING_NEUTRALIZATION';
  } else if (Math.abs(moleDiff) < 0.05) {
    status = 'EXACT';
  } else if (moleDiff < -0.05) {
    status = 'EXCESS_ACID';
    excessAcidMoles = Math.abs(moleDiff);
  } else {
    status = 'EXCESS_BASE';
    excessBaseMoles = moleDiff;
  }

  const equation = `R-SO3H (322 g/mol) + NaOH (40 g/mol) -> R-SO3-Na+ + H2O`;
  const notes = labsaQuantityKg > 0
    ? `LABSA Active Mass: ${(labsaActiveMassKg).toFixed(2)} kg (${labsaMoles.toFixed(2)} moles). Required 50% Caustic Soda: ${causticSodaSolutionKgNeeded.toFixed(2)} kg.`
    : 'No LABSA sulfonic acid present requiring neutralization.';

  return {
    labsaQuantityKg,
    labsaActiveMassKg,
    labsaMoles,
    requiredPureNaOHGrams,
    requiredPureKOHGrams,
    causticSodaSolutionKgNeeded,
    causticSodaInFormulaKg,
    neutralizationStatus: status,
    excessAcidMoles,
    excessBaseMoles,
    equation,
    notes
  };
}
