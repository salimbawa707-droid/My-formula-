/**
 * Indian Commercial Costing Engine
 * Calculates raw material cost in Indian Rupees (₹ / INR), cost per kg,
 * volumetric cost per liter (via physical density), and raw material cost contributions.
 * Strictly excludes invented overhead multipliers, simulated retail markups, or arbitrary distributor margins.
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

  let totalDirectMaterialCostINR = 0;
  let totalBatchWeightKg = 0;

  const ingredientCostBreakdown = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = Number.isFinite(item.quantityKg) ? item.quantityKg : 0;
    totalBatchWeightKg += qtyKg;

    // Price in ₹ / kg from override or authoritative master database
    const pricePerKgINR = item.costPerKgOverride !== undefined && item.costPerKgOverride !== null
      ? item.costPerKgOverride
      : (ing.costPerKg ?? 0);

    const itemTotalINR = qtyKg * pricePerKgINR;
    totalDirectMaterialCostINR += itemTotalINR;

    return {
      ingredientId: item.ingredientId,
      commercialName: ing.commercialName,
      quantityKg: qtyKg,
      costPerKgINR: pricePerKgINR,
      itemTotalINR,
      costPercentOfBatch: 0,
      // Legacy backward-compatible aliases
      costPerKgUSD: pricePerKgINR,
      itemTotalUSD: itemTotalINR
    };
  });

  const activeBatchSizeKg = totalBatchWeightKg > 0 ? totalBatchWeightKg : batchSizeKg;
  const costPerKgINR = activeBatchSizeKg > 0 ? (totalDirectMaterialCostINR / activeBatchSizeKg) : 0;

  ingredientCostBreakdown.forEach(item => {
    item.costPercentOfBatch = totalDirectMaterialCostINR > 0
      ? Number(((item.itemTotalINR / totalDirectMaterialCostINR) * 100).toFixed(2))
      : 0;
  });

  // Volumetric density conversion: Cost per liter = Cost per kg * density (kg/L)
  const densityResult = calculateDensity(items, customIngredients);
  const densityGPerML = densityResult.calculatedDensityGPerML > 0 ? densityResult.calculatedDensityGPerML : 1.03;
  const costPerLiterINR = costPerKgINR * densityGPerML;

  return {
    directMaterialCostINR: parseFloat(totalDirectMaterialCostINR.toFixed(2)),
    costPerKgINR: parseFloat(costPerKgINR.toFixed(2)),
    costPerLiterINR: parseFloat(costPerLiterINR.toFixed(2)),
    totalBatchWeightKg: parseFloat(activeBatchSizeKg.toFixed(2)),
    currency: 'INR',
    ingredientCostBreakdown,
    // Backward compatibility aliases for existing UI components
    directMaterialCostUSD: parseFloat(totalDirectMaterialCostINR.toFixed(2)),
    costPerKgUSD: parseFloat(costPerKgINR.toFixed(2)),
    costPerLiterUSD: parseFloat(costPerLiterINR.toFixed(2))
  };
}
