/**
 * Water Hardness & Chelation Capacity Engine
 * Calculates theoretical calcium carbonate binding capacity (mg CaCO3) for GLDA, Citrate, HEDP, EDTA, Gluconate
 */

import { FormulaItem, ChelationResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function calculateChelation(
  items: FormulaItem[],
  batchSizeKg: number = 100,
  waterHardnessPpmCaCO3: number = 150,
  customIngredients?: MasterIngredient[]
): ChelationResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalBindingCapacityMgCaCO3 = 0;
  const chelatorBreakdown: ChelationResult['chelatorBreakdown'] = [];

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    const qtyGrams = qtyKg * 1000;

    let bindingPerG = ing.chelationCapacityMgCaCO3PerG || 0;

    // Default known fallback bindings if missing on custom items
    if (bindingPerG === 0) {
      if (ing.id.includes('glda')) bindingPerG = 150.0;
      else if (ing.id.includes('citrate')) bindingPerG = 120.0;
      else if (ing.id.includes('hedp')) bindingPerG = 450.0;
      else if (ing.id.includes('edta')) bindingPerG = 220.0;
      else if (ing.id.includes('gluconate')) bindingPerG = 80.0;
      else if (ing.id.includes('citric-acid')) bindingPerG = 140.0;
    }

    if (bindingPerG > 0) {
      const bindingMg = qtyGrams * bindingPerG;
      totalBindingCapacityMgCaCO3 += bindingMg;
      chelatorBreakdown.push({
        ingredientId: item.ingredientId,
        commercialName: ing.commercialName,
        quantityKg: qtyKg,
        bindingCapacityMgCaCO3: bindingMg
      });
    }
  });

  // ppm CaCO3 = Total mg CaCO3 / Liters of formulation water (approx Liters = batchSizeKg)
  const liters = batchSizeKg > 0 ? batchSizeKg : 100;
  const ppmCaCO3ChelationCapacity = totalBindingCapacityMgCaCO3 / liters;

  // Hardness load (mg CaCO3) = Liters * waterHardnessPpmCaCO3
  const hardnessLoadMgCaCO3 = liters * waterHardnessPpmCaCO3;
  const chelationCapacityRatio = hardnessLoadMgCaCO3 > 0
    ? totalBindingCapacityMgCaCO3 / hardnessLoadMgCaCO3
    : 1.0;

  const safetyMarginPercent = (chelationCapacityRatio - 1.0) * 100;
  const isAdequateForHardness = totalBindingCapacityMgCaCO3 >= hardnessLoadMgCaCO3;

  return {
    totalBindingCapacityMgCaCO3,
    ppmCaCO3ChelationCapacity,
    waterHardnessPpmCaCO3,
    hardnessLoadMgCaCO3,
    chelationCapacityRatio,
    safetyMarginPercent,
    isAdequateForHardness,
    chelatorBreakdown
  };
}
