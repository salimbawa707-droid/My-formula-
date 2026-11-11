/**
 * Costing & Commercial Margin Engine
 * Calculates raw material cost per kg, cost per liter, manufacturing overhead, retail pricing, and gross margin chain.
 */

import { FormulaItem, CostingResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { calculateDensity } from './densityEngine';

export function calculateCosting(
  items: FormulaItem[],
  batchSizeKg: number = 100,
  customIngredients?: MasterIngredient[]
): CostingResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalDirectMaterialCostUSD = 0;
  let totalBatchWeightKg = 0;

  const ingredientCostBreakdown = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    totalBatchWeightKg += qtyKg;

    const pricePerKg = item.costPerKgOverride !== undefined
      ? item.costPerKgOverride
      : ing.costPerKg;

    const itemTotalUSD = qtyKg * pricePerKg;
    totalDirectMaterialCostUSD += itemTotalUSD;

    return {
      ingredientId: item.ingredientId,
      commercialName: ing.commercialName,
      quantityKg: qtyKg,
      costPerKgUSD: pricePerKg,
      itemTotalUSD,
      costPercentOfBatch: 0
    };
  });

  const activeBatchSizeKg = totalBatchWeightKg > 0 ? totalBatchWeightKg : batchSizeKg;
  const costPerKgUSD = totalDirectMaterialCostUSD / activeBatchSizeKg;

  ingredientCostBreakdown.forEach(item => {
    item.costPercentOfBatch = totalDirectMaterialCostUSD > 0
      ? (item.itemTotalUSD / totalDirectMaterialCostUSD) * 100
      : 0;
  });

  const densityResult = calculateDensity(items, customIngredients);
  const costPerLiterUSD = costPerKgUSD * densityResult.calculatedDensityGPerML;

  // Commercial estimates: Manufacturing overhead ~ 20%
  const suggestedManufacturingCostUSD = costPerKgUSD * 1.25;

  // Wholesale / Retail suggested price (e.g. 50% gross margin target)
  const suggestedRetailPriceUSD = suggestedManufacturingCostUSD * 2.2;
  const grossMarginPercentAtRetail = suggestedRetailPriceUSD > 0
    ? ((suggestedRetailPriceUSD - suggestedManufacturingCostUSD) / suggestedRetailPriceUSD) * 100
    : 0;

  return {
    directMaterialCostUSD: parseFloat(totalDirectMaterialCostUSD.toFixed(2)),
    costPerKgUSD: parseFloat(costPerKgUSD.toFixed(3)),
    costPerLiterUSD: parseFloat(costPerLiterUSD.toFixed(3)),
    suggestedManufacturingCostUSD: parseFloat(suggestedManufacturingCostUSD.toFixed(2)),
    suggestedRetailPriceUSD: parseFloat(suggestedRetailPriceUSD.toFixed(2)),
    grossMarginPercentAtRetail: parseFloat(grossMarginPercentAtRetail.toFixed(1)),
    ingredientCostBreakdown
  };
}
