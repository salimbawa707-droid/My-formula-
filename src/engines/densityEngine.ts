/**
 * Volumetric Mass Balance Density Calculation Engine
 * Formula: Density = Total_Mass / Sum(Mass_i / Density_i)
 */

import { FormulaItem, DensityResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function calculateDensity(
  items: FormulaItem[],
  customIngredients?: MasterIngredient[]
): DensityResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalBatchMassGrams = 0;
  let totalVolumeML = 0;
  const assumptions: string[] = [
    'Volumetric mass balance assumes ideal solution mixing behavior without significant partial molar volume compression.'
  ];

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    const massGrams = qtyKg * 1000;
    const density = ing.density && ing.density > 0 ? ing.density : 1.0;

    totalBatchMassGrams += massGrams;
    const volumeML = massGrams / density;
    totalVolumeML += volumeML;
  });

  const calculatedDensityGPerML = totalVolumeML > 0 ? totalBatchMassGrams / totalVolumeML : 1.03;
  const totalVolumeLiters = totalVolumeML / 1000;

  return {
    calculatedDensityGPerML: parseFloat(calculatedDensityGPerML.toFixed(3)),
    totalVolumeLiters: parseFloat(totalVolumeLiters.toFixed(2)),
    assumptions
  };
}
