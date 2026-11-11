/**
 * Formulation Compatibility & Solubility Engine
 * Checks ionic charge conflicts (anionic + cationic precipitation), extreme pH issues, and solubility limits.
 */

import { FormulaItem, CompatibilityResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { estimatePH } from './phEngine';

export function checkCompatibility(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[]
): CompatibilityResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  const conflicts: CompatibilityResult['conflicts'] = [];
  const warnings: string[] = [];

  let hasAnionic = false;
  let hasCationic = false;

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    if (ing.ionicType === 'anionic') hasAnionic = true;
    if (ing.ionicType === 'cationic') hasCationic = true;
  });

  if (hasAnionic && hasCationic) {
    conflicts.push({
      type: 'INCOMPATIBLE_IONIC',
      severity: 'CRITICAL',
      message: 'CRITICAL IONIC INCOMPATIBILITY: Formulation contains both Anionic and Cationic surfactants, which form insoluble salt precipitates and ruin cleaning performance.'
    });
  }

  const phResult = estimatePH(items, customIngredients);
  if (phResult.estimatedPH !== null && phResult.estimatedPH < 3.0) {
    conflicts.push({
      type: 'PH_INSTABILITY',
      severity: 'CRITICAL',
      message: 'CRITICAL pH WARNING: Highly acidic formulation (pH < 3.0). Causes severe equipment corrosion and skin hazards.'
    });
  } else if (phResult.estimatedPH !== null && phResult.estimatedPH > 12.5) {
    conflicts.push({
      type: 'PH_INSTABILITY',
      severity: 'WARNING',
      message: 'HIGH ALKALINITY WARNING: Formulation pH exceeds 12.5. Requires heavy duty handling and alkaline resistant packaging.'
    });
  }

  return {
    isCompatible: conflicts.filter(c => c.severity === 'CRITICAL').length === 0,
    warnings,
    conflicts
  };
}
