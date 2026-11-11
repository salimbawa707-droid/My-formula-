/**
 * Hydrophilic-Lipophilic Balance (HLB) Calculation Engine
 * Mass-weighted average HLB applied exclusively to nonionic surfactants with verified HLB numbers.
 */

import { FormulaItem, HLBResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function calculateHLB(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[]
): HLBResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalNonionicWeightKg = 0;
  let weightedHLBSum = 0;
  let nonionicIngredientCount = 0;
  let totalSurfactantWeightKg = 0;

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;

    if (ing.ionicType === 'anionic' || ing.ionicType === 'nonionic' || ing.ionicType === 'amphoteric' || ing.ionicType === 'non_ionic_special') {
      totalSurfactantWeightKg += qtyKg;
    }

    if (ing.ionicType === 'nonionic' && ing.hlb !== undefined && ing.hlb > 0) {
      nonionicIngredientCount++;
      totalNonionicWeightKg += qtyKg;
      weightedHLBSum += qtyKg * ing.hlb;
    }
  });

  if (nonionicIngredientCount === 0 || totalNonionicWeightKg === 0) {
    return {
      weightedHLB: null,
      nonionicRatioPercent: 0,
      nonionicIngredientCount: 0,
      isApplicable: false,
      notes: 'No nonionic surfactants with defined HLB values were present in the formulation.'
    };
  }

  const weightedHLB = weightedHLBSum / totalNonionicWeightKg;
  const nonionicRatioPercent = totalSurfactantWeightKg > 0
    ? (totalNonionicWeightKg / totalSurfactantWeightKg) * 100
    : 100;

  return {
    weightedHLB: parseFloat(weightedHLB.toFixed(2)),
    nonionicRatioPercent: parseFloat(nonionicRatioPercent.toFixed(1)),
    nonionicIngredientCount,
    isApplicable: true,
    notes: `Calculated mass-weighted HLB across ${nonionicIngredientCount} nonionic surfactant component(s).`
  };
}
