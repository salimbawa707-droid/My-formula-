/**
 * Active Matter Calculation Engine
 * Formula: Active Matter (%) = ∑(Quantity_i * Active_Fraction_i) / Total_Batch_Weight * 100
 */

import { FormulaItem, ActiveMatterResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function calculateActiveMatter(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[]
): ActiveMatterResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalBatchWeightKg = 0;
  let totalActiveMassKg = 0;
  let anionicActiveMassKg = 0;
  let nonionicActiveMassKg = 0;
  let amphotericActiveMassKg = 0;
  let cationicActiveMassKg = 0;

  const breakdownByIngredient = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    totalBatchWeightKg += qtyKg;

    const activeFraction = item.activeConcentrationPercentOverride !== undefined
      ? item.activeConcentrationPercentOverride / 100
      : ing.activeFraction;

    const activeContributionMassKg = qtyKg * activeFraction;
    totalActiveMassKg += activeContributionMassKg;

    if (ing.ionicType === 'anionic') anionicActiveMassKg += activeContributionMassKg;
    else if (ing.ionicType === 'nonionic' || ing.ionicType === 'non_ionic_special') nonionicActiveMassKg += activeContributionMassKg;
    else if (ing.ionicType === 'amphoteric') amphotericActiveMassKg += activeContributionMassKg;
    else if (ing.ionicType === 'cationic') cationicActiveMassKg += activeContributionMassKg;

    return {
      ingredientId: item.ingredientId,
      commercialName: ing.commercialName,
      quantityKg: qtyKg,
      weightPercent: 0, // calculated after total
      activeFraction,
      activeContributionPercent: 0 // calculated after total
    };
  });

  const batchSizeKg = totalBatchWeightKg > 0 ? totalBatchWeightKg : 100;
  const totalActiveMatterPercent = (totalActiveMassKg / batchSizeKg) * 100;

  breakdownByIngredient.forEach(b => {
    b.weightPercent = (b.quantityKg / batchSizeKg) * 100;
    b.activeContributionPercent = (b.quantityKg * b.activeFraction / batchSizeKg) * 100;
  });

  return {
    totalActiveMatterPercent: parseFloat(totalActiveMatterPercent.toFixed(2)),
    totalActiveMassKg: parseFloat(totalActiveMassKg.toFixed(2)),
    anionicActivePercent: parseFloat(((anionicActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    nonionicActivePercent: parseFloat(((nonionicActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    amphotericActivePercent: parseFloat(((amphotericActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    cationicActivePercent: parseFloat(((cationicActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    breakdownByIngredient
  };
}
