/**
 * Scientific Engine Validation & Regression Test Suite
 * Fully self-contained, 100% offline, verifying:
 * 1. Active Surfactant Matter (excluding non-surfactants and builders)
 * 2. Molar Stoichiometric Neutralization (reactive equivalents, limiting reagent, generated water)
 * 3. Thermodynamic Equilibrium pH Solver (PHEngineV2 charge-balance)
 * 4. Chelation Capacity (pure active vs commercial product basis, actual water volume)
 * 5. Indian Commercial Costing (₹ / INR & density volumetric pricing)
 * 6. 11-Stage Formula Analysis Pipeline
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { calculateActiveMatter } from '../activeMatterEngine';
import { calculateNeutralization } from '../neutralizationEngine';
import { estimatePH } from '../phEngine';
import { calculateChelation } from '../chelationEngine';
import { calculateCosting } from '../costingEngine';
import { calculateDensity } from '../densityEngine';
import { runFormulaAnalysisPipeline } from '../formulaAnalysisPipeline';
import { DEFAULT_FORMULAS } from '../../data/defaultFormulas';
import { getSubcategoryInfo } from '../../domain/taxonomy';

describe('1. Active Surfactant Matter Engine Tests', () => {
  test('surfactant active matter strictly counts surfactants and excludes builders/salts', () => {
    const items = [
      { ingredientId: 'labsa-90', quantityKg: 10.0 }, // 10 * 0.90 = 9.0 kg active surfactant
      { ingredientId: 'sles-28', quantityKg: 20.0 },  // 20 * 0.28 = 5.6 kg active surfactant
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 5.0 }, // Non-surfactant builder (0% surfactant AM)
      { ingredientId: 'sodium-chloride', quantityKg: 2.0 }, // Inorganic salt (0% surfactant AM)
      { ingredientId: 'deionized-water', quantityKg: 63.0 }
    ];

    const result = calculateActiveMatter(items, undefined);
    assert.equal(result.totalSurfactantActiveMatterPercent, 14.6);
    assert.equal(result.anionicActivePercent, 14.6);
    assert.equal(result.nonionicActivePercent, 0);
    assert.equal(result.amphotericActivePercent, 0);
    assert.equal(result.cationicActivePercent, 0);
  });
});

describe('2. Stoichiometric Neutralization Engine Tests', () => {
  test('calculates reactive equivalents, caustic demand, limiting reagent, and reaction water', () => {
    const items = [
      { ingredientId: 'labsa-90', quantityKg: 10.0 }, // 9 kg pure LABSA -> ~27.57 moles H+
      { ingredientId: 'naoh-50', quantityKg: 2.2053 }, // ~1.1026 kg pure NaOH -> ~27.57 moles OH-
      { ingredientId: 'deionized-water', quantityKg: 87.7947 }
    ];

    const result = calculateNeutralization(items, undefined, 100);
    assert.equal(result.neutralizationStatus, 'FULLY_NEUTRALIZED');
    assert.equal(result.acidName, 'LABSA 90% (Acid Slurry)');
    assert.ok(result.acidReactiveEquivalents > 27.0 && result.acidReactiveEquivalents < 28.5);
    assert.ok(result.baseReactiveEquivalents > 27.0 && result.baseReactiveEquivalents < 28.5);
    assert.ok(result.reactionGeneratedWaterGrams > 490 && result.reactionGeneratedWaterGrams < 510);
  });

  test('flags excess acid when caustic soda is insufficient', () => {
    const items = [
      { ingredientId: 'labsa-90', quantityKg: 10.0 },
      { ingredientId: 'naoh-50', quantityKg: 1.0 }, // Insufficient base
      { ingredientId: 'deionized-water', quantityKg: 89.0 }
    ];

    const result = calculateNeutralization(items, undefined, 100);
    assert.equal(result.neutralizationStatus, 'UNDER_NEUTRALIZED');
    assert.ok(result.excessAcidEquivalents > 15.0);
  });
});

describe('3. Thermodynamic Equilibrium pH Engine Tests', () => {
  test('solves equilibrium pH for buffered citrate detergent system', () => {
    const items = [
      { ingredientId: 'labsa-90', quantityKg: 6.0 },
      { ingredientId: 'naoh-50', quantityKg: 1.58 },
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.25 },
      { ingredientId: 'sles-28', quantityKg: 20.0 },
      { ingredientId: 'capb-30', quantityKg: 2.0 },
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 1.5 },
      { ingredientId: 'sodium-chloride', quantityKg: 1.2 },
      { ingredientId: 'deionized-water', quantityKg: 67.47 }
    ];

    const phRes = estimatePH(items);
    assert.equal(phRes.solverConvergence, 'CONVERGED');
    assert.ok(phRes.estimatedPH !== null && phRes.estimatedPH > 6.5 && phRes.estimatedPH < 8.0);
    assert.ok(phRes.detailedSpeciation && phRes.detailedSpeciation.length > 0);
  });
});

describe('4. Chelation Capacity Engine Tests', () => {
  test('differentiates pure active vs commercial product binding capacity', () => {
    const items = [
      { ingredientId: 'glda-47', quantityKg: 2.0 }, // 2000 g * 150 mg/g commercial = 300,000 mg CaCO3
      { ingredientId: 'deionized-water', quantityKg: 98.0 }
    ];

    const result = calculateChelation(items, 100, 150, undefined, { currentPH: 8.0 });
    assert.equal(result.totalBindingCapacityMgCaCO3, 300000);
    assert.ok((result.totalActiveBindingCapacityMgCaCO3 ?? 0) > 250000);
    assert.ok((result.actualWaterVolumeLiters ?? 0) > 0);
    assert.equal(result.chelatorBreakdown[0].isWithinPhWindow, true);
  });

  test('explicitly marks HEDP threshold scale inhibition mode', () => {
    const items = [
      { ingredientId: 'hedp-60', quantityKg: 0.5 },
      { ingredientId: 'deionized-water', quantityKg: 99.5 }
    ];

    const result = calculateChelation(items, 100, 150, undefined, { currentPH: 8.0 });
    assert.equal(result.chelatorBreakdown.length, 1);
    assert.ok(result.chelatorBreakdown[0].notes?.includes('NOT_MODELED_STOICHIOMETRICALLY'));
  });
});

describe('5. Indian Commercial Costing Engine Tests (User-Controlled Pricing)', () => {
  test('flags costing as incomplete when ingredient prices are missing', () => {
    const items = [
      { ingredientId: 'labsa-90', quantityKg: 10.0 },
      { ingredientId: 'sles-28', quantityKg: 20.0 },
      { ingredientId: 'deionized-water', quantityKg: 70.0 }
    ];

    // Built-in prices removed -> costPerKg is null by default
    const costing = calculateCosting(items, 100);

    assert.equal(costing.currency, 'INR');
    assert.equal(costing.isCostingComplete, false);
    assert.ok(costing.unpricedIngredientNames.length >= 2);
    assert.equal(costing.directMaterialCostINR, 0);
  });

  test('calculates exact direct material cost when user price overrides are supplied', () => {
    const items = [
      { ingredientId: 'labsa-90', quantityKg: 10.0, costPerKgOverride: 140 }, // 10 * 140 = 1400
      { ingredientId: 'sles-28', quantityKg: 20.0, costPerKgOverride: 68 },   // 20 * 68 = 1360
      { ingredientId: 'deionized-water', quantityKg: 70.0, costPerKgOverride: 0.50 } // 70 * 0.5 = 35
    ];

    const density = calculateDensity(items);
    const costing = calculateCosting(items, 100);

    assert.equal(costing.currency, 'INR');
    assert.equal(costing.isCostingComplete, true);
    assert.equal(costing.unpricedIngredientNames.length, 0);
    assert.equal(costing.directMaterialCostINR, 2795.0);
    assert.equal(costing.costPerKgINR, 27.95);
    assert.ok(costing.costPerLiterINR > costing.costPerKgINR); // density > 1.0 kg/L
    assert.ok(density.calculatedDensityGPerML > 1.0);
  });
});

describe('6. Taxonomy Classification & Routing Tests', () => {
  test('correctly maps auto_dishwasher before hand_dishwash in taxonomy classification', () => {
    const autoInfo = getSubcategoryInfo('auto_dishwasher');
    const handInfo = getSubcategoryInfo('hand_dishwash');

    assert.equal(autoInfo.parentCategory, 'DISH WASH');
    assert.equal(handInfo.parentCategory, 'DISH WASH');
    assert.notEqual(autoInfo.id, handInfo.id);
  });
});

describe('7. 11-Stage Formula Analysis Pipeline Tests', () => {
  test('executes all 11 stages deterministically on default formulas', () => {
    for (const formula of DEFAULT_FORMULAS) {
      const report = runFormulaAnalysisPipeline(formula);
      assert.equal(report.stages.length, 11);
      assert.equal(report.massBalance.isBalanced100Percent, true);
      assert.ok(report.overallSummary.surfactantActiveMatterPercent >= 0);
      assert.ok(['OPTIMAL', 'ACCEPTABLE', 'NON_COMPLIANT'].includes(report.overallSummary.productRoutingSuitability));
    }
  });
});
