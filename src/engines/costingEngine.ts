/**
 * Indian Commercial Costing Engine (User-Controlled Pricing)
 * Strictly calculates costing from user-entered purchase prices.
 * Returns isCostingComplete = false if any ingredient price is missing.
 * Allows user-entered optional commercial operational cost fields without hardcoding defaults.
 */

import { FormulaItem, CostingResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { calculateDensity } from './densityEngine';

export interface OptionalCommercialCostInputs {
  packagingCostINR?: number | null;
  laborCostINR?: number | null;
  electricityCostINR?: number | null;
  overheadCostINR?: number | null;
  transportationCostINR?: number | null;
  otherCostINR?: number | null;
  distributorMarginPercent?: number | null;
  retailerMarginPercent?: number | null;
  desiredProfitMarginPercent?: number | null;
}

export function calculateCosting(
  items: FormulaItem[],
  batchSizeKg: number = 100,
  customIngredients?: MasterIngredient[],
  commercialInputs?: OptionalCommercialCostInputs
): CostingResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  let totalBatchWeightKg = 0;
  let knownSubtotalCostINR = 0;
  const unpricedIngredientNames: string[] = [];

  const ingredientCostBreakdown = items.map(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = Number.isFinite(item.quantityKg) && item.quantityKg > 0 ? item.quantityKg : 0;
    totalBatchWeightKg += qtyKg;

    // Price resolution: override first, then ing.costPerKg from user prices
    let pricePerKgINR: number | null = null;
    if (item.costPerKgOverride !== undefined && item.costPerKgOverride !== null && Number.isFinite(item.costPerKgOverride)) {
      pricePerKgINR = item.costPerKgOverride;
    } else if (ing.costPerKg !== undefined && ing.costPerKg !== null && Number.isFinite(ing.costPerKg)) {
      pricePerKgINR = ing.costPerKg;
    }

    const hasPrice = pricePerKgINR !== null && pricePerKgINR >= 0;
    let itemTotalINR = 0;

    if (hasPrice) {
      itemTotalINR = qtyKg * (pricePerKgINR as number);
      knownSubtotalCostINR += itemTotalINR;
    } else {
      if (qtyKg > 0 && !ing.id.includes('water')) {
        unpricedIngredientNames.push(ing.commercialName);
      }
    }

    return {
      ingredientId: item.ingredientId,
      commercialName: ing.commercialName,
      quantityKg: qtyKg,
      costPerKgINR: hasPrice ? pricePerKgINR : null,
      hasPrice,
      itemTotalINR: parseFloat(itemTotalINR.toFixed(2)),
      costPercentOfBatch: 0,
      // USD aliases
      costPerKgUSD: hasPrice ? pricePerKgINR : null,
      itemTotalUSD: parseFloat(itemTotalINR.toFixed(2))
    };
  });

  const isCostingComplete = unpricedIngredientNames.length === 0;
  const activeBatchSizeKg = totalBatchWeightKg > 0 ? totalBatchWeightKg : batchSizeKg;

  ingredientCostBreakdown.forEach(item => {
    item.costPercentOfBatch = knownSubtotalCostINR > 0
      ? Number(((item.itemTotalINR / knownSubtotalCostINR) * 100).toFixed(2))
      : 0;
  });

  const directMaterialCostINR = knownSubtotalCostINR;
  const costPerKgINR = activeBatchSizeKg > 0 ? (directMaterialCostINR / activeBatchSizeKg) : 0;

  // Volumetric density conversion: Cost per liter = Cost per kg * density (kg/L)
  const densityResult = calculateDensity(items, customIngredients);
  const densityGPerML = densityResult.calculatedDensityGPerML > 0 ? densityResult.calculatedDensityGPerML : 1.03;
  const costPerLiterINR = costPerKgINR * densityGPerML;

  // User-provided optional operational cost fields (no hardcoded percentages)
  let totalManufacturingCostINR: number | null = null;
  let suggestedSellingPriceINR: number | null = null;

  const pkgCost = commercialInputs?.packagingCostINR ?? 0;
  const lbrCost = commercialInputs?.laborCostINR ?? 0;
  const eleCost = commercialInputs?.electricityCostINR ?? 0;
  const ovhCost = commercialInputs?.overheadCostINR ?? 0;
  const trnCost = commercialInputs?.transportationCostINR ?? 0;
  const othCost = commercialInputs?.otherCostINR ?? 0;

  const hasOptionalCosts = (pkgCost + lbrCost + eleCost + ovhCost + trnCost + othCost) > 0;
  if (hasOptionalCosts && isCostingComplete) {
    totalManufacturingCostINR = directMaterialCostINR + pkgCost + lbrCost + eleCost + ovhCost + trnCost + othCost;

    const profitMargin = commercialInputs?.desiredProfitMarginPercent ?? 0;
    if (profitMargin > 0 && profitMargin < 100) {
      suggestedSellingPriceINR = totalManufacturingCostINR / (1 - profitMargin / 100);
    }
  }

  return {
    currency: 'INR',
    isCostingComplete,
    unpricedIngredientNames,
    knownSubtotalCostINR: parseFloat(knownSubtotalCostINR.toFixed(2)),
    directMaterialCostINR: parseFloat(directMaterialCostINR.toFixed(2)),
    costPerKgINR: parseFloat(costPerKgINR.toFixed(2)),
    costPerLiterINR: parseFloat(costPerLiterINR.toFixed(2)),
    totalBatchWeightKg: parseFloat(activeBatchSizeKg.toFixed(2)),
    packagingCostINR: commercialInputs?.packagingCostINR ?? null,
    laborCostINR: commercialInputs?.laborCostINR ?? null,
    electricityCostINR: commercialInputs?.electricityCostINR ?? null,
    overheadCostINR: commercialInputs?.overheadCostINR ?? null,
    transportationCostINR: commercialInputs?.transportationCostINR ?? null,
    otherCostINR: commercialInputs?.otherCostINR ?? null,
    distributorMarginPercent: commercialInputs?.distributorMarginPercent ?? null,
    retailerMarginPercent: commercialInputs?.retailerMarginPercent ?? null,
    desiredProfitMarginPercent: commercialInputs?.desiredProfitMarginPercent ?? null,
    totalManufacturingCostINR: totalManufacturingCostINR !== null ? parseFloat(totalManufacturingCostINR.toFixed(2)) : null,
    suggestedSellingPriceINR: suggestedSellingPriceINR !== null ? parseFloat(suggestedSellingPriceINR.toFixed(2)) : null,
    ingredientCostBreakdown,
    // Backward compatibility aliases
    directMaterialCostUSD: parseFloat(directMaterialCostINR.toFixed(2)),
    costPerKgUSD: parseFloat(costPerKgINR.toFixed(2)),
    costPerLiterUSD: parseFloat(costPerLiterINR.toFixed(2))
  };
}
