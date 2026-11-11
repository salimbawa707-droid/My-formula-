/**
 * Surfactant Active Matter Calculation Engine
 * Strictly excludes builders, salts, chelators, water, and non-surfactant materials.
 *
 * Equation:
 * Surfactant Active Matter (%) =
 * 100 * Sum(Surfactant Commercial Mass * Surfactant Active Fraction) / Total Batch Mass
 */

import { FormulaItem, ActiveMatterResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient, isSurfactantCategory } from '../domain/ingredientsMaster';

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
  let totalSurfactantActiveMassKg = 0;
  let anionicActiveMassKg = 0;
  let nonionicActiveMassKg = 0;
  let amphotericActiveMassKg = 0;
  let cationicActiveMassKg = 0;
  let nonSurfactantActiveMassKg = 0;
  let totalNonVolatileSolidsMassKg = 0;

  // Validation checks: negative quantities or NaN are strictly clamped to 0
  const breakdownByIngredient = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const rawQtyKg = item.quantityKg;
    const qtyKg = typeof rawQtyKg === 'number' && Number.isFinite(rawQtyKg) && rawQtyKg > 0 ? rawQtyKg : 0;
    totalBatchWeightKg += qtyKg;

    // Active fraction resolution with strict bounds [0.0, 1.0]
    let activeFraction = ing.activeFraction;
    if (item.activeConcentrationPercentOverride !== undefined) {
      const override = item.activeConcentrationPercentOverride;
      if (typeof override === 'number' && Number.isFinite(override)) {
        activeFraction = Math.max(0, Math.min(1.0, override / 100));
      }
    }

    const isSurfactant = isSurfactantCategory(ing.category);
    const activeMassKg = qtyKg * activeFraction;

    if (isSurfactant) {
      totalSurfactantActiveMassKg += activeMassKg;

      if (ing.ionicType === 'anionic' || ing.category === 'Anionic Surfactant') {
        anionicActiveMassKg += activeMassKg;
      } else if (
        ing.ionicType === 'nonionic' ||
        ing.ionicType === 'non_ionic_special' ||
        ing.category === 'Nonionic Surfactant'
      ) {
        nonionicActiveMassKg += activeMassKg;
      } else if (ing.ionicType === 'amphoteric' || ing.category === 'Amphoteric Surfactant') {
        amphotericActiveMassKg += activeMassKg;
      } else if (ing.ionicType === 'cationic' || ing.category === 'Cationic Surfactant') {
        cationicActiveMassKg += activeMassKg;
      }
    } else {
      nonSurfactantActiveMassKg += activeMassKg;
    }

    // Non-volatile solids estimation: all ingredients excluding water and volatile solvents
    const isVolatileSolvent = ing.id.includes('water') || ing.id.includes('ethanol');
    if (!isVolatileSolvent) {
      totalNonVolatileSolidsMassKg += activeMassKg;
    }

    return {
      ingredientId: item.ingredientId,
      commercialName: ing.commercialName,
      category: ing.category,
      isSurfactant,
      quantityKg: qtyKg,
      weightPercent: 0, // computed post-loop
      activeFraction,
      activeContributionPercent: 0, // computed post-loop
      activeMassKg
    };
  });

  const batchSizeKg = totalBatchWeightKg > 0 ? totalBatchWeightKg : 100;
  const surfactantActiveMatterPercent = (totalSurfactantActiveMassKg / batchSizeKg) * 100;
  const totalNonVolatileSolidsPercent = (totalNonVolatileSolidsMassKg / batchSizeKg) * 100;

  breakdownByIngredient.forEach(b => {
    b.weightPercent = (b.quantityKg / batchSizeKg) * 100;
    // Active contribution percent is relative to batch size
    b.activeContributionPercent = (b.activeMassKg / batchSizeKg) * 100;
  });

  return {
    totalSurfactantActiveMatterPercent: parseFloat(surfactantActiveMatterPercent.toFixed(2)),
    surfactantActiveMatterPercent: parseFloat(surfactantActiveMatterPercent.toFixed(2)),
    totalSurfactantActiveMassKg: parseFloat(totalSurfactantActiveMassKg.toFixed(2)),
    totalActiveMatterPercent: parseFloat(surfactantActiveMatterPercent.toFixed(2)), // SSOT alias
    totalActiveMassKg: parseFloat(totalSurfactantActiveMassKg.toFixed(2)), // SSOT alias
    anionicActivePercent: parseFloat(((anionicActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    nonionicActivePercent: parseFloat(((nonionicActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    amphotericActivePercent: parseFloat(((amphotericActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    cationicActivePercent: parseFloat(((cationicActiveMassKg / batchSizeKg) * 100).toFixed(2)),
    nonSurfactantActiveMassKg: parseFloat(nonSurfactantActiveMassKg.toFixed(2)),
    totalNonVolatileSolidsPercent: parseFloat(totalNonVolatileSolidsPercent.toFixed(2)),
    breakdownByIngredient
  };
}
